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

function Sidebar() {

    const {user,setUser, baseUrl} = useContext(AppContext)

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

    const disableClick = useRef<HTMLDivElement>(null)


    return (
        <div className={`text-neutral-100 xl:px-16 px-4 pb-5 pt-1 h-dvh flex flex-col justify-between container z-50 fixed max-w-fit animate-slide-right`}>
            <ul className={`flex flex-col gap-y-5`}>
                <li className={`flex items-center`}>
                    <Link to={`/home`}>
                        <div className={`hover:bg-neutral-600/30 rounded-full p-3 `}>
                            <FaXTwitter className={`size-8`}/>
                        </div>
                    </Link>
                </li>
                <li className={``}>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3 transition`} to={`/home`}>
                        <MdHomeFilled className={`size-8`}/>
                        <span className={`hidden xl:block`}>Home</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3  transition`} to={`/explore`}>
                        <HiMiniMagnifyingGlass className={`size-8`}/>
                        <span className={`hidden xl:block`}>Explore</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3  transition`} to={`/notifications`}>
                        <BsBell className={`size-8`}/>
                        <span className={`hidden xl:block`}>Notifications</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit xl:pr-7 xl:pl-3 xl:py-3 p-3  transition`} to={`/profile`}>
                        <LuUser className={`size-8`}/>
                        <span className={`hidden xl:block`}>Profile</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end justify-center w-fit px-4 py-4 xl:py-3 xl:px-0 xl:w-auto rounded-full gap-x-4 font-semibold bg-sky-500 text-xl hover:bg-sky-600 transition`} to={`/create-post`}>
                        <span className={`hidden xl:block`}>Post</span>
                        <FaFeatherPointed className={`block xl:hidden`}/>
                    </Link>
                </li>
            </ul>

            {/*Logout window*/}
            <div ref={disableClick} className={`bg-black flex flex-col gap-y-3 border border-neutral-700/70 py-4 px-4 rounded-lg absolute w-[21rem] bottom-24 shadow-[-2px_2px_12px_#4f4e4e] ${logoutWindowOpen ? 'appear' : 'disappear'}`}>
                <button disabled={!logoutWindowOpen} className={`bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition ${!logoutWindowOpen ? 'cursor-default' : 'cursor-pointer'}`}>Settings</button>
                <button disabled={!logoutWindowOpen} onClick={logout} className={`bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition ${!logoutWindowOpen ? 'cursor-default' : 'cursor-pointer'}`}>Logout @{user?.username}</button>
            </div>


            <div ref={logoutRef} onClick={handleClick} className={`flex items-center gap-x-9 xl:hover:bg-neutral-600/30 rounded-full px-4 py-2 transition cursor-pointer`}>
                <div className={`flex items-center gap-x-4`}>

                    <img className={`size-11 rounded-full object-cover`} src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>

                    <div className={`hidden xl:block`}>
                        <div className={`font-semibold`}>{user?.username}</div>
                        <div className={`text-neutral-500`}>@{user?.username}</div>
                    </div>
                </div>

                <div className={`hidden xl:block`}>
                    <HiOutlineDotsHorizontal />
                </div>
            </div>
        </div>
    )
}

export default Sidebar
