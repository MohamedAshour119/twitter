import { Dispatch, forwardRef, SetStateAction } from "react";
import { UserInfo } from "../../Interfaces.tsx";
import { Link } from "react-router-dom";

interface Props extends UserInfo {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}

const SearchResult = forwardRef<HTMLAnchorElement, Props>((props, ref) => {

    return (
        <Link
            onClick={() => props.setIsOpen(false)}
            to={`/users/${props.user_info.username}`}
            className="text-white flex items-center gap-x-3 hover:bg-[#1c1e2182] transition p-4"
            ref={ref}
        >
            {props.user_info.avatar &&
                <img
                    src={props.user_info.avatar}
                    alt="avatar"
                    className="size-12 rounded-full object-cover"
                />
            }
            {!props.user_info.avatar &&
                <img
                    src={`/profile-default-svgrepo-com.svg`}
                    alt="avatar"
                    className="size-12 rounded-full object-cover"
                />
            }
            <div>
                <div className="font-semibold">{props.user_info.username}</div>
                <div className="text-[#71767b]">@{props.user_info.username}</div>
            </div>
        </Link>
    );
});

export default SearchResult;
