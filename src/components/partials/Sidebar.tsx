import {Link} from "react-router-dom";
import {MdHomeFilled} from "react-icons/md";
import {FaRegCircleUser, FaXTwitter} from "react-icons/fa6";
import {HiMiniMagnifyingGlass} from "react-icons/hi2";
import {BsBell} from "react-icons/bs";
import {LuUser} from "react-icons/lu";
import {HiOutlineDotsHorizontal} from "react-icons/hi";

function Sidebar() {
    return (
        <div className={`text-neutral-100 px-16 pb-5 pt-1 h-full flex flex-col justify-between container fixed max-w-fit`}>
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
                        Home
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit pr-7 pl-3 py-3 transition`} to={`/explore`}>
                        <HiMiniMagnifyingGlass className={`size-8`}/>
                        Explore
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit pr-7 pl-3 py-3 transition`} to={`/notifications`}>
                        <BsBell className={`size-8`}/>
                        Notifications
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end gap-x-4 text-xl hover:bg-neutral-600/30 rounded-full w-fit pr-7 pl-3 py-3 transition`} to={`/profile`}>
                        <LuUser className={`size-8`}/>
                        Profile
                    </Link>
                </li>
                <li>
                    <Link className={`flex items-end justify-center py-3 rounded-full gap-x-4 font-semibold bg-sky-500 text-xl hover:bg-sky-600 transition`} to={`/create-post`}>
                        Post
                    </Link>
                </li>
            </ul>
            <div className={`flex items-center gap-x-9 hover:bg-neutral-600/30 rounded-full px-4 py-2 transition cursor-pointer`}>
                <div className={`flex items-center gap-x-4`}>
                    <div className={`w-1/3 text-4xl`}>
                        <FaRegCircleUser />
                    </div>
                    <div>
                        <div className={`font-semibold`}>Mohamed Ashour</div>
                        <div className={`text-neutral-500`}>@MohamedAsh119</div>
                    </div>
                </div>

                <div>
                    <HiOutlineDotsHorizontal />
                </div>
            </div>
        </div>
    )
}

export default Sidebar
