import {Link, useNavigate} from "react-router-dom";
import {MdHomeFilled} from "react-icons/md";
import {FaFeatherPointed, FaXTwitter} from "react-icons/fa6";
import {HiMiniMagnifyingGlass} from "react-icons/hi2";
import {BsBell} from "react-icons/bs";
import {LuUser} from "react-icons/lu";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../ApiClient.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import {TbLogout} from "react-icons/tb";
import {UserDefaultValues} from "../../Interfaces.tsx";
import * as React from "react";
import Skeleton from "../partials/Skeleton.tsx";

function Sidebar() {

    const {
        user,
        setUser,
        baseUrl,
        setIsModalOpen,
        isModalOpen,
        isCommentOpen,
        isShowEditInfoModal,
    } = useContext(AppContext)

    const {setTweets, setTweet} = useContext(TweetContext)

    const [logoutWindowOpen, setLogoutWindowOpen] = useState(false)
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        setLogoutWindowOpen(!logoutWindowOpen)
    }

    const navigate = useNavigate()

    // Logout function
    const logout = () => {
        if(localStorage.getItem('token')){
            ApiClient().get('/logout')
                .then( () => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('expires_at')
                    setUser(UserDefaultValues)
                    setTweets([])
                    navigate('/')
                })
                .catch(() => {})
        }
    }

    // Handle click outside the logout window
    const logoutRef = useRef<HTMLDivElement>(null)
    useEffect( () => {
        const handleOutside = (e: MouseEvent) => {
            if(!logoutRef.current?.contains(e.target as Node)){
                setLogoutWindowOpen(false)
            }
        }
        document.addEventListener('click', handleOutside)
        return () => {
            document.removeEventListener('click', handleOutside)
        }

    }, [] )


    // Clear the tweet when click on post btn in sidebar
    const openTweetModel = () => {
        setIsModalOpen(prev => !prev)
        setTweet(() => ({
            title: "",
            image: null,
            video: null,
            id: null,
        }))
    }

    return (
        <div className={`${isModalOpen || isCommentOpen || isShowEditInfoModal ? 'opacity-20 pointer-events-none' : ''} text-neutral-100 lg:px-0 px-2 pb-5 pt-1 h-svh grid justify-center container fixed xl:max-w-[15.65rem] lg:max-w-[1rem] md:max-w-[15rem] sm:max-w-[4.2rem] z-[300]`}>
            <ul className={`flex flex-col gap-y-5 justify-self-end w-full select-none`}>
                <li className={`flex items-center`}>
                    <Link to={`/home`}>
                        <div className={`hover:bg-[#0a0c0e] rounded-full p-3 `}>
                            <FaXTwitter className={`size-8`}/>
                        </div>
                    </Link>
                </li>
                <li className={``}>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-[#0a0c0e] rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3 transition`}
                          to={`/home`}>
                        <MdHomeFilled className={`size-8`}/>
                        <span className={`hidden md:block lg:hidden xl:block`}>Home</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className={`flex items-end gap-x-4 text-xl hover:bg-[#0a0c0e] rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3 transition`}
                        to={`/explore`}>
                        <HiMiniMagnifyingGlass className={`size-8`}/>
                        <span className={`hidden md:block lg:hidden xl:block`}>Explore</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to={`/notifications`}
                        className={`flex items-end gap-x-4 text-xl hover:bg-[#0a0c0e] rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3 transition`}>
                        <div className={`relative`}>
                            <BsBell className={`size-8`}/>
                            {(user?.allNotifications?.notifications_count && user.allNotifications.notifications_count > 0) ?
                                (
                                    <div
                                        className={`absolute -top-3 left-4 text-sm bg-sky-500 rounded-full min-w-[1.5rem] min-h-[1.5rem] flex justify-center items-center`}>
                                        {user?.allNotifications.notifications_count && user.allNotifications.notifications_count}
                                    </div>
                                ) : ('')

                            }
                        </div>
                        <span className={`hidden md:block lg:hidden xl:block`}>Notifications</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-[#0a0c0e] rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3 transition`}
                          to={`/users/${user?.user_info?.username}`}>
                        <LuUser className={`size-8`}/>
                        <span className={`hidden md:block lg:hidden xl:block`}>Profile</span>
                    </Link>
                </li>
                <li>
                    <div onClick={() => {
                        openTweetModel()
                    }} className={`w-full flex items-end justify-center cursor-pointer px-4 py-4 xl:py-3 xl:px-0 rounded-full gap-x-4 font-semibold bg-sky-500 text-xl hover:bg-sky-600 transition`}>
                        <span className={`hidden md:block lg:hidden xl:block`}>Post</span>
                        <FaFeatherPointed className={`block xl:hidden`}/>
                    </div>
                </li>
            </ul>

            {/*Logout window*/}
            <div className={`sidebar-drop-down-clip-path bg-[#0a0c0e] flex flex-col gap-y-3 justify-self-end py-4 px-4 absolute w-[21rem] -right-64 bottom-20 2xl:-right-10 2xl:bottom-24 shadow-[-2px_2px_12px_#4f4e4e] ${logoutWindowOpen ? 'appear' : 'disappear'}`}>
                <button disabled={!logoutWindowOpen} onClick={logout} className={`flex items-center gap-x-3 bg-[#111315] py-3 px-6 text-left rounded-lg hover:bg-[#1a1d20] transition ${!logoutWindowOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                    <TbLogout className={`size-5`}/>
                    Logout @{user?.user_info?.username}
                </button>
            </div>


            <div
                ref={logoutRef}
                onClick={handleClick}
                className={`self-end flex justify-center md:justify-between lg:justify-center justify-self-end w-full items-center gap-x-9 xl:hover:bg-[#0a0c0e] rounded-full sm:px-0 px-4 py-2 transition cursor-pointer`}
            >
                <div className={`flex items-center gap-x-4`}>

                    {user?.user_info.avatar && <img className={`size-11 rounded-full object-cover`} src={`${baseUrl}/storage/${user?.user_info?.avatar}`} alt="avatar"/>}
                    {!user?.user_info.avatar && <img className={`size-11 object-cover`} src={`/profile-default-svgrepo-com.svg`} alt={`default avatar`}/> }

                    <div className={`hidden md:flex lg:hidden xl:flex xl:flex-col md:flex-col lg:flex-row ${!user?.user_info.id ? 'gap-y-1' : ''} `}>

                        <div className={`font-semibold`}>
                            {user?.user_info?.display_name ? user?.user_info?.display_name : user?.user_info?.username}
                        </div>

                        {!user?.user_info.display_name && !user?.user_info.username &&
                            <Skeleton styles={`h-[20px] w-40`}/>
                        }

                        <div className={`text-neutral-500`}>{user?.user_info.username && '@'}{user?.user_info?.username}</div>
                        {!user?.user_info.username &&
                            <Skeleton styles={`h-[20px] w-52`}/>
                        }
                    </div>
                </div>

                <div className={`hidden md:block lg:hidden xl:block`}>
                    {user?.user_info.username && <HiOutlineDotsHorizontal/>}
                    {!user?.user_info.username && <Skeleton styles={`h-4 w-10`}/>}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
