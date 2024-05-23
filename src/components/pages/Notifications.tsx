import {Link} from "react-router-dom";
import {RiArrowLeftLine} from "react-icons/ri";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import Model from "../layouts/Model.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import NewNotification from "../layouts/NewNotification.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {IoCheckmarkDoneOutline} from "react-icons/io5";

type NotificationsInfo = {
    users_id: number[],
}
function Notifications() {
    const {
        isModalOpen,
        isCommentOpen,
        user,
        setUser,
    } = useContext(AppContext)

    const [isActive, setIsActive] = useState({
        all: true,
        verified: false,
    })
    const [notificationsInfo, setNotificationsInfo] = useState<NotificationsInfo>({
        'users_id': [],
    })

    // Handle active buttons
    const allNotificationsRef = useRef<HTMLLIElement>(null);
    const followNotificationsRef = useRef<HTMLLIElement>(null);



    useEffect( () => {
        const handleClick = (e: MouseEvent) => {
            if(allNotificationsRef.current?.contains(e.target as Node)){
                setIsActive(prevIsActive => ({
                    ...prevIsActive,
                    all: true,
                    verified: false,
                }))
            }
            if(followNotificationsRef.current?.contains(e.target as Node)){
                setIsActive(prevIsActive => ({
                    ...prevIsActive,
                    all: false,
                    verified: true,
                }))
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [location?.pathname])

    const notifications = user?.allNotifications?.notifications_info?.map(notification => (
        <NewNotification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            follower_id={notification.follower_id}
            followed_id={notification.followed_id}
            created_at={notification.created_at}
            tweet_id={notification.tweet_id}
            is_read={notification.is_read}
            user={notification.user}
            allNotifications={user?.allNotifications.notifications_info}
        />
    ));

    // Mark all notifications as read
    useEffect( () => {
        const notificationsInfoDiff: NotificationsInfo = {'users_id': []}
        const filteredNotifications = user?.allNotifications.notifications_info.filter(notification => !notification.is_read)
        filteredNotifications?.map(notification => {
            if(notification.tweet_id && user){
                notificationsInfoDiff.users_id?.push(user?.user_info?.id)
            }
        })
        setNotificationsInfo(notificationsInfoDiff)
    }, [])


    const markAllNotificationsAsRead = () => {

        let numberOfUnreadNotifications = 0;
        user?.allNotifications.notifications_info.map(notification => !notification.is_read ? numberOfUnreadNotifications++ : numberOfUnreadNotifications)

        if(numberOfUnreadNotifications > 0) {
            ApiClient().put(`/mark-all`, notificationsInfo)
                .then(() => {
                    const updatedNotifications = user?.allNotifications.notifications_info.map(notification => {
                        return {
                            ...notification,
                            is_read: true,
                        }
                    })
                    if (updatedNotifications) {
                        setUser(prevState => ({
                            ...prevState,
                            allNotifications: {
                                ...prevState.allNotifications,
                                notifications_info: [...updatedNotifications],
                                notifications_count: null
                            },
                            originalNotifications: [...updatedNotifications]
                        }))
                    }

                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const filteredVerifiedNotifications = () => {
        const filteredNotifications = user?.allNotifications.notifications_info.filter(notification => notification.type === 'follow')
        if (filteredNotifications) {
            setUser(prevState => ({
                ...prevState,
                allNotifications: {
                    ...prevState.allNotifications,
                    notifications_info: [...filteredNotifications]
                }
            }))
        }
    }

    const allNotificationsReset = () => {
        setUser(prevState => ({
            ...prevState,
            allNotifications: {
                ...prevState.allNotifications,
                notifications_info: prevState.originalNotifications
            }
        }))    }

    useEffect(() => {
        isActive.all ? allNotificationsReset() : filteredVerifiedNotifications()
    }, [isActive]);

    return (
        <div className={`${isModalOpen || isCommentOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-svh flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header className={`flex flex-col border ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70 gap-x-8 pt-1 text-neutral-200 bg-black/50 backdrop-blur-sm`}>
                    <div className={`flex items-center gap-x-3 font-semibold text-xl px-4`}>
                        <Link to={'/home'} className={`hover:bg-neutral-600/30 flex justify-center items-center p-2 rounded-full transition cursor-pointer`}>
                            <RiArrowLeftLine className={`size-5`}/>
                        </Link>
                        <div className={`w-full`}>Notifications</div>
                    </div>

                    {/* Buttons section */}
                    <ul className={`w-full flex text-[#71767b] mt-1`}>
                        <li
                            ref={allNotificationsRef}
                            onClick={allNotificationsReset}
                            className={`relative hover:bg-neutral-700/30 w-1/2 flex justify-center sm:px-8 px-6 pt-3 cursor-pointer transition ${isActive.all ? 'text-neutral-200 font-semibold ' : ''}`}
                        >
                            <div
                                className={`${isActive.all ? 'border-b-2 border-sky-500 w-fit' : ''}  pb-4 px-3`}>All</div>
                        </li>
                        <li
                            ref={followNotificationsRef}
                            onClick={filteredVerifiedNotifications}
                            className={`relative hover:bg-neutral-700/30 w-1/2 flex justify-center sm:px-8 px-6 pt-3 cursor-pointer transition ${isActive.verified ? 'text-neutral-200 font-semibold ' : ''}`}
                        >
                            <div
                                className={`${isActive.verified ? 'border-b-2 border-sky-500 w-fit' : ''} pb-4 px-3`}>Verified</div>
                        </li>
                    </ul>
                </header>
                <div></div>
            </div>

            <div className={`${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr] grid-cols-1`}>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>
                {/* Middle section */}
                <div className={`text-neutral-200 border-r border-l border-zinc-700/70`}>
                    {/* All user notifications */}
                    <div className={`mt-28 pb-5`}>
                        {(user?.allNotifications.notifications_count && user?.allNotifications.notifications_count > 1) ?
                            (
                                <div
                                    onClick={markAllNotificationsAsRead}
                                    className={`flex gap-x-3 bg-sky-500 w-fit px-6 py-2 relative left-1/2 -translate-x-1/2 cursor-pointer hover:bg-sky-600 transition rounded-md`}>
                                    <span>Mark all as read</span>
                                    <IoCheckmarkDoneOutline className={`size-6`}/>
                                </div>
                            ) : ('')
                        }
                        {notifications}
                    </div>


                </div>

                <TrendingSidebar/>
            </div>
            <Model />
        </div>
    )
}

export default Notifications
