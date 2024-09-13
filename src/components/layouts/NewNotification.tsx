import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {Link} from "react-router-dom";
import {IoCheckmarkDoneOutline} from "react-icons/io5";
import ApiClient from "../ApiClient.tsx";
import {Notification} from "../../Interfaces.tsx";

interface Props extends Notification {
    allNotifications: Notification[]
}
function NewNotification(props: Props) {

    const {setUser} = useContext(AppContext)

    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
    const [disableLink, setDisableLink] = useState(false)

    const popUpWindow = useRef<HTMLDivElement>(null)
    useEffect( () => {
        const handleOutside = (e: MouseEvent) => {
            if(popUpWindow.current && !popUpWindow.current?.contains(e.target as Node)){
                popUpWindow.current.classList.add('animate-fade-out')
                setTimeout(() => {
                    setNotificationMenuOpen(false)
                }, 300)
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
        'type': props.type,
    }
    const markNotificationAsRead = () => {
        if(!props.is_read) {
            ApiClient().put('/mark-as-read', notificationInfo)
                .then(res => {
                    setUser(prevState => ({
                        ...prevState,
                        allNotifications: {
                            ...prevState.allNotifications,
                            notifications_count: res.data.data.notifications_count
                        }
                    }))

                    props.allNotifications.map((notification: Notification) => {
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


    return (
        <div onClick={markNotificationAsRead}>
            <Link to={props.type === 'tweet' ? `/tweets/${props.tweet_id}` : `/users/${props.user?.username}`}>
                <div className={`flex gap-x-4 ${props.id === props.allNotifications[0].id && props.allNotifications.length == 1 ? 'border-t-0' : 'mt-4 border-t'} items-center justify-between ${!props.is_read ? 'bg-sky-300/10' : ''} p-4 px-1 xxs:px-4 border-y border-zinc-700 relative transition`}>
                    <div className={`flex items-center gap-x-3 w-[75%] xxs:w-auto`}>
                        {props.user.avatar &&
                            <img
                                src={props.user?.avatar}
                                alt="avatar"
                                className={`size-12 object-cover rounded-full`}
                            />
                        }
                        {!props.user.avatar &&
                            <img
                                src={`/profile-default-svgrepo-com.svg`}
                                alt="avatar"
                                className={`size-12 object-cover rounded-full`}
                            />
                        }
                        <div>
                            <Link
                                to={`/users/${props.user?.username}`}
                                className={`text-sky-500 font-semibold hover:text-sky-600 transition`}>
                                {props.user?.display_name ? props.user?.display_name + ' ' :  props.user?.username + ' '}
                            </Link>
                            {props.type === 'tweet' ? 'posted a new tweet, check it out' : `followed you!`}
                        </div>
                    </div>
                    <div className={`flex items-center gap-x-1 w-[15%] xxs:w-auto`}>
                        <div>{props.created_at}</div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setNotificationMenuOpen(true);
                            }}
                            className={`hover:bg-sky-600/20 hover:text-sky-500 cursor-pointer flex justify-center items-center p-2 rounded-full transition`}
                        >
                            <HiOutlineDotsHorizontal/>
                        </div>
                    </div>

                    {/* Popup windows */}
                    {notificationMenuOpen &&
                        <div
                            ref={popUpWindow}
                            className={`${notificationMenuOpen ? 'animate-fade-in' : ''} tweet-drop-down-clip-path z-50 bg-[#0a0c0e] flex flex-col gap-y-3 justify-self-end py-4 px-4 pr-8 absolute w-[21rem] right-16 top-4`}
                        >

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    markNotificationAsRead()
                                }}
                                disabled={!notificationMenuOpen}
                                className={`flex font-semibold items-center gap-x-3 bg-[#111315] py-3 px-6 text-left rounded-lg hover:bg-[#1a1d20] transition cursor-pointer`}>
                                <span>Mark as read</span>
                                <IoCheckmarkDoneOutline className={`size-6`}/>
                            </button>
                        </div>
                    }
                </div>
            </Link>
        </div>
    )
}

export default NewNotification
