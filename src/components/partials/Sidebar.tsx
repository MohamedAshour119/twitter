import {Link} from "react-router-dom";
import {MdHomeFilled} from "react-icons/md";
import {FaFeatherPointed, FaXTwitter} from "react-icons/fa6";
import {HiMiniMagnifyingGlass} from "react-icons/hi2";
import {BsBell} from "react-icons/bs";
import {LuUser} from "react-icons/lu";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {ToastContainer} from "react-toastify";
import {TweetContext} from "../appContext/TweetContext.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import {TbLogout} from "react-icons/tb";
function Sidebar() {

    const {
        user,
        setUser,
        baseUrl,
        setIsModalOpen,
        notificationsCount,
    } = useContext(AppContext)

    const {setRandomTweets, setTweet} = useContext(TweetContext)

    const [logoutWindowOpen, setLogoutWindowOpen] = useState(false)
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        setLogoutWindowOpen(!logoutWindowOpen)
    }

    // Logout function
    const logout = () => {
        if(localStorage.getItem('token')){
            ApiClient().get('/logout')
                .then( () => {
                    localStorage.removeItem('token')
                    setUser(null)
                    setRandomTweets([])
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
        <>
            <ToastContainer/>
            <div className={`text-neutral-100 lg:px-0 px-4 pb-5 pt-1 h-dvh grid grid-cols-1 justify-center container fixed min-w-fit 2xl:max-w-[22%] z-[300]`}>
                <ul className={`flex flex-col gap-y-5 justify-self-end 2xl:w-[80%] xl:w-[22%] mx-4 select-none`}>
                    <li className={`flex items-center`}>
                        <Link to={`/home`}>
                            <div className={`hover:bg-neutral-600/30 rounded-full p-3 `}>
                                <FaXTwitter className={`size-8`}/>
                            </div>
                        </Link>
                    </li>
                    <li className={``}>
                        <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3 transition`}
                              to={`/home`}>
                            <MdHomeFilled className={`size-8`}/>
                            <span className={`hidden xl:block`}>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3  transition`}
                            to={`/explore`}>
                            <HiMiniMagnifyingGlass className={`size-8`}/>
                            <span className={`hidden xl:block`}>Explore</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/notifications`}
                            className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3  transition`}>
                            <div className={`relative`}>
                                <BsBell className={`size-8`}/>
                                {notificationsCount > 0 &&
                                    <div
                                        className={`absolute -top-3 left-4 text-sm bg-sky-500 rounded-full min-w-[1.5rem] min-h-[1.5rem] flex justify-center items-center`}>
                                        {notificationsCount}
                                    </div>
                                }
                            </div>
                            <span className={`hidden xl:block`}>Notifications</span>
                        </Link>
                    </li>
                    <li>
                        <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3 transition`}
                              to={`/users/${user?.username}`}>
                            <LuUser className={`size-8`}/>
                            <span className={`hidden xl:block`}>Profile</span>
                        </Link>
                    </li>
                    <li>
                        <div onClick={() => {
                            openTweetModel()
                        }} className={`w-fit xl:w-auto 2xl:max-w-[85%] flex items-end justify-center cursor-pointer px-4 py-4 xl:py-3 xl:px-0 rounded-full gap-x-4 font-semibold bg-sky-500 text-xl hover:bg-sky-600 transition`}>
                            <span className={`hidden xl:block`}>Post</span>
                            <FaFeatherPointed className={`block xl:hidden`}/>
                        </div>
                    </li>
                </ul>

                {/*Logout window*/}
                <div className={`bg-black flex flex-col gap-y-3 justify-self-end border border-neutral-700/70 py-4 px-4 rounded-lg absolute w-[21rem] -right-64 bottom-20 2xl:-right-10 2xl:bottom-24 shadow-[-2px_2px_12px_#4f4e4e] ${logoutWindowOpen ? 'appear' : 'disappear'}`}>
                    <button disabled={!logoutWindowOpen} className={`flex items-center gap-x-3 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition ${!logoutWindowOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                        <IoSettingsOutline className={`size-5`}/>
                        Settings
                    </button>
                    <button disabled={!logoutWindowOpen} onClick={logout} className={`flex items-center gap-x-3 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition ${!logoutWindowOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                        <TbLogout className={`size-5`}/>
                        Logout @{user?.username}
                    </button>
                </div>


                <div ref={logoutRef} onClick={handleClick} className={`mx-4 self-end flex justify-between justify-self-end 2xl:w-[80%] xl:w-[18rem] items-center gap-x-9 xl:hover:bg-neutral-600/30 rounded-full px-4 py-2 transition cursor-pointer`}>
                    <div className={`flex items-center gap-x-4`}>

                        <img className={`size-11 rounded-full object-cover`} src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>

                        <div className={`hidden xl:block`}>
                            <div className={`font-semibold`}>{user?.display_name}</div>
                            <div className={`text-neutral-500`}>@{user?.username}</div>
                        </div>
                    </div>

                    <div className={`hidden xl:block`}>
                        <HiOutlineDotsHorizontal />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
