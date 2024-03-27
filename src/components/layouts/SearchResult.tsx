import {useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {UserInfo} from "../../Interfaces.tsx";
import {Link} from "react-router-dom";

function SearchResult(props: UserInfo) {

    const {baseUrl} = useContext(AppContext)

    return (
        <Link to={`/users/${props.username}`} className={`text-white flex items-center gap-x-3 hover:bg-[#1c1e2182] p-4`}>
            <img
                src={`${baseUrl}/storage/${props.avatar}`}
                alt=""
                className={`size-12 rounded-full object-cover`}
            />
            <div>
                <div className={`font-semibold`}>{props.username}</div>
                <div className={`text-[#71767b]`}>@{props.username}</div>
            </div>
        </Link>
    )
}

export default SearchResult
