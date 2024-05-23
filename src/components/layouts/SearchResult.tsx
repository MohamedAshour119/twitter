import {Dispatch, SetStateAction, useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {UserInfo} from "../../Interfaces.tsx";
import {Link} from "react-router-dom";

interface Props extends UserInfo{
    setIsOpen: Dispatch<SetStateAction<boolean>>
    isOpen: boolean
}
function SearchResult(props: Props) {

    const {baseUrl} = useContext(AppContext)

    return (
        <Link
            onClick={() => props.setIsOpen(false)}
            to={`/users/${props.user_info.username}`}
            className={`text-white flex items-center gap-x-3 hover:bg-[#1c1e2182] transition p-4`}
        >
            <img
                src={`${baseUrl}/storage/${props.user_info.avatar}`}
                alt=""
                className={`size-12 rounded-full object-cover`}
            />
            <div>
                <div className={`font-semibold`}>{props.user_info.username}</div>
                <div className={`text-[#71767b]`}>@{props.user_info.username}</div>
            </div>
        </Link>
    )
}

export default SearchResult
