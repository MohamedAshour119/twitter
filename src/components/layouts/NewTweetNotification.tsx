import {useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {Link} from "react-router-dom";

interface Props {
    avatar: string,
    username: string,
    created_at: string,
}
function NewTweetNotification(props: Props) {

    const {baseUrl} = useContext(AppContext)

    return (
        <div className={'flex mt-4 items-center justify-between bg-sky-300/10 p-4 border-y border-zinc-700'}>
            <div className={`flex items-center gap-x-3`}>
                <img
                    src={`${baseUrl}/storage/${props.avatar}`}
                    alt=""
                    className={`size-12 object-cover rounded-full`}
                />
                <div>
                    <Link
                        to={`/users/${props.username}`}
                        className={`text-sky-500 font-semibold hover:text-sky-600 transition`}>
                        {props.username + ' '}
                    </Link>
                    posted a new tweet, check it out
                </div>
            </div>
            <div className={`flex items-center gap-x-1`}>
                <div>{props.created_at}</div>
                <div className={`hover:bg-sky-600/20 hover:text-sky-500 cursor-pointer flex justify-center items-center p-2 rounded-full transition`}>
                    <HiOutlineDotsHorizontal/>
                </div>
            </div>
        </div>
    )
}

export default NewTweetNotification
