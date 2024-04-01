import {Link} from "react-router-dom";
import {RiArrowLeftLine} from "react-icons/ri";
import {LuArrowBigUp} from "react-icons/lu";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import TweetModel from "../layouts/TweetModel.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import NewTweetNotification from "../layouts/NewTweetNotification.tsx";

function Notifications() {

    const {
        isModelOpen,
        isCommentOpen,
        location,
        tweetNotifications,
    } = useContext(AppContext)

    const [isActive, setIsActive] = useState({
        all: true,
        mentioned: false,
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
                    mentioned: false,
                }))
            }
            if(mentionedNotificationsRef.current?.contains(e.target as Node)){
                setIsActive(prevIsActive => ({
                    ...prevIsActive,
                    all: false,
                    mentioned: true,
                }))
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [location?.pathname])

    const notifications = tweetNotifications?.map(notification => {
        return (
            <NewTweetNotification
                avatar={notification.tweet_user.user.avatar}
                username={notification.tweet_user.user.username}
                created_at={notification.tweet_user.user.created_at}
            />
        )
    })

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
                            className={`relative hover:bg-neutral-700/30 w-1/2 flex justify-center sm:px-8 px-6 pt-3 cursor-pointer transition ${isActive.all ? 'text-neutral-200 font-semibold ' : ''}`}
                        >
                            <div className={`${isActive.all ? 'border-b-2 border-sky-500 w-fit' : ''}  pb-4 px-3`}>All</div>
                        </li>
                        <li
                            ref={mentionedNotificationsRef}
                            className={`relative hover:bg-neutral-700/30 w-1/2 flex justify-center sm:px-8 px-6 pt-3 cursor-pointer transition ${isActive.mentioned ? 'text-neutral-200 font-semibold ' : ''}`}
                        >
                            <div className={`${isActive.mentioned ? 'border-b-2 border-sky-500 w-fit' : ''} pb-4 px-3`}>Mentioned</div>
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
                        {notifications}
                    </div>

                </div>

                <TrendingSidebar/>
            </div>
            <TweetModel />
        </div>
    )
}

export default Notifications
