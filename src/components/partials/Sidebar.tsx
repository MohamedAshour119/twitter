import {Link} from "react-router-dom";
import {MdHomeFilled} from "react-icons/md";
import {FaXTwitter} from "react-icons/fa6";
import {HiMagnifyingGlass} from "react-icons/hi2";
import {BsBell} from "react-icons/bs";
import {LuUser} from "react-icons/lu";

function Sidebar() {
    return (
        <div>
            <ul className={`text-neutral-100 bg-sky-600 px-2 py-3 h-full flex flex-col gap-y-6`}>
                <li>
                    <Link className={``} to={`/home`}>
                        <FaXTwitter className={`size-8`}/>
                    </Link>
                </li>
                <li>
                    <Link className={`flex`} to={`/home`}>
                        <MdHomeFilled className={`size-8`}/>
                        Home
                    </Link>
                </li>
                <li>
                    <Link className={`flex`} to={`/explore`}>
                        <HiMagnifyingGlass className={`size-8`}/>
                        Explore
                    </Link>
                </li>
                <li>
                    <Link className={`flex`} to={`/notifications`}>
                        <BsBell className={`size-8`}/>
                        Notifications
                    </Link>
                </li>
                <li>
                    <Link className={`flex`} to={`/profile`}>
                        <LuUser className={`size-8`}/>
                        Profile
                    </Link>
                </li>
                <li>
                    <Link className={`flex`} to={`/create-post`}>
                        Post
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar
