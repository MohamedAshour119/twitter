import {Link} from "react-router-dom";
import {MdHomeFilled} from "react-icons/md";
import {HiMiniMagnifyingGlass} from "react-icons/hi2";
import {BsBell} from "react-icons/bs";
import {useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";

function NavbarSmScreens() {

    const {notificationsCount, isModalOpen, isCommentOpen} = useContext(AppContext)

    return (
        <ul className={`xs:hidden fixed bottom-0 bg-black flex w-full justify-center py-2 gap-x-16 text-neutral-200 border-t border-zinc-700/70 ${isModalOpen || isCommentOpen ? 'opacity-20' : ''}`}>
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
        </ul>
    )
}

export default NavbarSmScreens
