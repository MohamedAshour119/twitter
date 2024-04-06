import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {Link} from "react-router-dom";
import {HiMiniXMark} from "react-icons/hi2";
import {IoCheckmarkDoneOutline} from "react-icons/io5";
import ApiClient from "../services/ApiClient.tsx";
import {Notification} from "../../Interfaces.tsx";

interface Props extends Notification{}
function NewTweetNotification(props: Props) {

    const {baseUrl, setNotificationsCount, allNotifications} = useContext(AppContext)

    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
    const [disableLink, setDisableLink] = useState(false)
    const [isRead, setIsRead] = useState();

    // let is_read: string | null;

    useEffect(() => {
        const is_read = localStorage.getItem(`isRead_${props.tweet_id}`)

        setIsRead(() => is_read ? JSON.parse(is_read) : props.is_read)

    }, [allNotifications]);



    const popUpWindow = useRef<HTMLDivElement>(null)
    useEffect( () => {
        const handleOutside = (e: MouseEvent) => {
            if(!popUpWindow.current?.contains(e.target as Node)){
                setNotificationMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutside)
        return () => {
            document.removeEventListener('mousedown', handleOutside)
        }
    }, [] )

    const notificationInfo = {
        'user_id': props.follower_id,
        'tweet_id': props.tweet_id,
    }
    const markNotificationAsRead = () => {
        if(!isRead) {
            ApiClient().put('/mark-as-read', notificationInfo)
                .then(res => {
                    setIsRead(res.data.data.notification.is_read)
                    setNotificationsCount(res.data.data.notifications_count)
                    localStorage.setItem(`isRead_${props.tweet_id}`, JSON.stringify(res.data.data.notification.is_read));

                    allNotifications.map((notification: Notification) => {
                        notification.tweet_id === notificationInfo.tweet_id ? notification.is_read = true : ''
                    })
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setNotificationMenuOpen(false))
        } else {
            setNotificationMenuOpen(false)
        }
    }

    const notificationCommonContent =
        <div className={`flex mt-4 items-center justify-between ${!disableLink ? 'hover:bg-sky-300/20' : ''} ${!isRead ? 'bg-sky-300/10' : ''} p-4 border-y border-zinc-700 relative transition`}>
            <div className={`flex items-center gap-x-3`}>
                <img
                    src={`${baseUrl}/storage/${props.user.avatar}`}
                    alt=""
                    className={`size-12 object-cover rounded-full`}
                />
                <div>
                    <Link
                        onMouseEnter={() => setDisableLink(true)}
                        onMouseLeave={() => setDisableLink(false)}
                        to={`/users/${props.user.username}`}
                        className={`text-sky-500 font-semibold hover:text-sky-600 transition`}>
                        {props.user.username + ' '}
                    </Link>
                    {props.type === 'tweet' ? 'posted a new tweet, check it out' : `followed you!`}
                </div>
            </div>
            <div className={`flex items-center gap-x-1`}>
                <div>{props.created_at}</div>
                <div
                    onClick={() => setNotificationMenuOpen(true)}
                    className={`hover:bg-sky-600/20 hover:text-sky-500 cursor-pointer flex justify-center items-center p-2 rounded-full transition`}
                    onMouseEnter={() => setDisableLink(true)}
                    onMouseLeave={() => setDisableLink(false)}
                >
                    <HiOutlineDotsHorizontal/>
                </div>
            </div>

            {/* Popup windows */}
            {notificationMenuOpen &&
                <div
                    ref={popUpWindow}
                    onMouseEnter={() => setDisableLink(true)}
                    onMouseLeave={() => setDisableLink(false)}
                    className={`shadow-[0_0_5px_-1px_white] z-[300] bg-black flex flex-col gap-y-3 justify-self-end border border-neutral-700/70 py-4 px-4 rounded-lg absolute w-[21rem] right-2 top-2 shadow-[-2px_2px_12px_#4f4e4e]ooo`}>
                    <div
                        onClick={() => setNotificationMenuOpen(false)}
                        className="absolute -right-4 -top-4 cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                        <HiMiniXMark/>
                    </div>

                    <button
                        onClick={markNotificationAsRead}
                        disabled={!notificationMenuOpen}
                        className={`flex gap-x-4 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition ${!notificationMenuOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                        <span>Mark as read</span>
                        <IoCheckmarkDoneOutline className={`size-6`}/>
                    </button>
                </div>
            }
        </div>


    return (
        <>
            {!disableLink ? (
                <div onClick={markNotificationAsRead}>
                    <Link to={props.type === 'tweet' ? `/tweets/${props.tweet_id}` : `/users/${props.user.username}`}>
                        {notificationCommonContent}
                    </Link>
                </div>

            ) : (
                <div>
                    {notificationCommonContent}
                </div>
            ) }
        </>

    )
}

export default NewTweetNotification
