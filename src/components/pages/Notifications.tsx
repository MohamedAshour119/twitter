import {Link} from "react-router-dom";
import {RiArrowLeftLine} from "react-icons/ri";
import {LuArrowBigUp} from "react-icons/lu";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import TweetModel from "../layouts/TweetModel.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import NewTweetNotification from "../layouts/NewTweetNotification.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {IoCheckmarkDoneOutline} from "react-icons/io5";

type NotificationsInfo = {
    users_id: number[],
}
function Notifications() {
    const {
        isModelOpen,
        isCommentOpen,
        location,
        allNotifications,
        notificationsPageURL,
        getAllNotifications,
        setAllNotifications,
        setNotificationsCount,
        user,
        originalNotifications,
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
    const mentionedNotificationsRef = useRef<HTMLLIElement>(null);

    useEffect( () => {
        const handleClick = (e: MouseEvent) => {
            if(allNotificationsRef.current?.contains(e.target as Node)){
                setIsActive(prevIsActive => ({
                    ...prevIsActive,
                    all: true,
                    verified: false,
                }))
            }
            if(mentionedNotificationsRef.current?.contains(e.target as Node)){
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

    const notifications = allNotifications.slice(0, allNotifications.length - 1).map(notification => (
        <NewTweetNotification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            follower_id={notification.follower_id}
            followed_id={notification.followed_id}
            created_at={notification.created_at}
            tweet_id={notification.tweet_id}
            is_read={notification.is_read}
            user={notification.user}
        />
    ));

    // Detect when scroll to last element
    const lastNotificationRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                getAllNotifications(notificationsPageURL)
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        if (lastNotificationRef.current) {
            observer.observe(lastNotificationRef.current)
        }

        // Cleanup
        return () => {
            if (lastNotificationRef.current) {
                observer.unobserve(lastNotificationRef.current);
            }
        };
    }, [notificationsPageURL])

    // Mark all notifications as read

    useEffect( () => {
        const notificationsInfoDiff: NotificationsInfo = {'users_id': []}
        const filteredNotifications = allNotifications.filter(notification => !notification.is_read)
        filteredNotifications.map(notification => {
            if(notification.tweet_id && user){
                notificationsInfoDiff.users_id?.push(user?.id)
            }
        })
        setNotificationsInfo(notificationsInfoDiff)
    }, [getAllNotifications])


    const markAllNotificationsAsRead = () => {

        let numberOfUnreadNotifications = 0;
        allNotifications.map(notification => !notification.is_read ? numberOfUnreadNotifications++ : numberOfUnreadNotifications)

        if(numberOfUnreadNotifications > 0) {
            ApiClient().put(`/mark-all`, notificationsInfo)
                .then(() => {
                    const updatedNotifications = allNotifications.map(notification => {
                        return {
                            ...notification,
                            is_read: true,
                        }
                    })
                    setAllNotifications(updatedNotifications)
                    setNotificationsCount(0)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const filteredVerifiedNotifications = () => {
        const filteredNotifications = allNotifications.filter(notification => notification.type === 'follow')
        setAllNotifications(() => ([...filteredNotifications]))
    }

    const allNotificationsReset = () => {
        setAllNotifications(() => ([...originalNotifications]))
    }

    return (
        <div className={`${isModelOpen || isCommentOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-svh flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header className={`flex flex-col border ${isModelOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70 gap-x-8 pt-1 text-neutral-200 bg-black/50 backdrop-blur-sm`}>
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
                            ref={mentionedNotificationsRef}
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

            <div className={`${isModelOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr] grid-cols-1`}>

                {/* Scroll to top button */}
                <div className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>
                {/* Middle section */}
                <div className={`text-neutral-200 border-r border-l border-zinc-700/70`}>
                    {/* All user notifications */}
                    <div className={`mt-28 pb-5`}>
                        {allNotifications.length > 1 &&
                            <div
                                onClick={markAllNotificationsAsRead}
                                className={`flex gap-x-3 bg-sky-500 w-fit px-6 py-2 relative left-1/2 -translate-x-1/2 cursor-pointer hover:bg-sky-600 transition rounded-md`}>
                                <span>Mark all as read</span>
                                <IoCheckmarkDoneOutline className={`size-6`}/>
                            </div>
                        }

                        {notifications}
                        <div ref={lastNotificationRef}>
                            {allNotifications.length > 0 && (
                                <NewTweetNotification {...allNotifications[allNotifications.length - 1]} />
                            )}
                        </div>
                    </div>


                </div>

                <TrendingSidebar/>
            </div>
            <TweetModel />
        </div>
    )
}

export default Notifications
