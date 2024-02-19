import {Link} from "react-router-dom";
import {MdHomeFilled} from "react-icons/md";
import {FaFeatherPointed, FaRegCircleUser, FaXTwitter} from "react-icons/fa6";
import {HiMiniMagnifyingGlass} from "react-icons/hi2";
import {BsBell} from "react-icons/bs";
import {LuUser} from "react-icons/lu";
import {HiOutlineDotsHorizontal} from "react-icons/hi";

function Sidebar() {
    return (
        <div className={`text-neutral-100 xl:px-16 px-4 pb-5 pt-1 h-dvh flex flex-col justify-between container fixed max-w-fit`}>
            <ul className={`flex flex-col gap-y-5`}>
                <li className={`flex items-center`}>
                    <Link to={`/home`}>
                        <div className={`hover:bg-neutral-600/30 rounded-full p-3`}>
                            <FaXTwitter className={`size-8`}/>
                        </div>
                    </Link>
                </li>
                <li className={``}>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit pr-7 pl-3 py-3 transition`} to={`/home`}>
                        <MdHomeFilled className={`size-8`}/>
                        <span className={`hidden xl:block`}>Home</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit pr-7 pl-3 py-3 transition`} to={`/explore`}>
                        <HiMiniMagnifyingGlass className={`size-8`}/>
                        <span className={`hidden xl:block`}>Explore</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit pr-7 pl-3 py-3 transition`} to={`/notifications`}>
                        <BsBell className={`size-8`}/>
                        <span className={`hidden xl:block`}>Notifications</span>
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit pr-7 pl-3 py-3 transition`} to={`/profile`}>
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
            <div className={`flex items-center gap-x-9 hover:bg-neutral-600/30 rounded-full px-4 py-2 transition cursor-pointer`}>
                <div className={`flex items-center gap-x-4`}>

                    <FaRegCircleUser className={`size-10`}/>

                    <div className={`hidden xl:block`}>
                        <div className={`font-semibold`}>Mohamed Ashour</div>
                        <div className={`text-neutral-500`}>@MohamedAsh119</div>
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
