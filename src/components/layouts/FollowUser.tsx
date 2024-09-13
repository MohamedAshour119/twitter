import {useState} from "react";
import ApiClient from "../ApiClient.tsx";
import {Link} from "react-router-dom";
import {UserInfo} from "../../Interfaces.tsx";
import {toast} from "react-toastify";
import {toastStyle} from "../helper/ToastifyStyle.tsx";

interface Prop {
    suggestedUsersToFollow: UserInfo
    styles?: string
}
function FollowUser({suggestedUsersToFollow, styles}: Prop) {

    const [isFollowed, setIsFollowed] = useState(suggestedUsersToFollow.user_info.is_followed)
    const [isFollowedBtnDisabled, setIsFollowedBtnDisabled] = useState(false)

    const checkDisplayName = suggestedUsersToFollow.user_info.display_name ? suggestedUsersToFollow.user_info.display_name : suggestedUsersToFollow.user_info.username
    const handleFollow = () => {
        setIsFollowedBtnDisabled(true)

        if(!isFollowed){
            ApiClient().post(`/${suggestedUsersToFollow.user_info.id}/follow`)
                .then(() => {
                    toast.success(`You are following ${checkDisplayName}`, toastStyle)
                    setIsFollowed(true)
                    setIsFollowedBtnDisabled(false);
                })
                .catch(error => {
                    toast.error(error.response.data.message, toastStyle)
                    setIsFollowedBtnDisabled(false);
                });
        } else {

            ApiClient().post(`/${suggestedUsersToFollow.user_info.id}/unfollow`)
                .then(() => {
                    toast.error(`You are not following ${checkDisplayName} anymore!`, toastStyle)
                    setIsFollowed(false)
                    setIsFollowedBtnDisabled(false);
                })
                .catch(error => {
                    toast.error(`Error occurs!, try again`, toastStyle)
                    console.log(error)
                    setIsFollowedBtnDisabled(false);
                });
        }

    };


    return (
        <div className={`flex justify-between hover:bg-[#161a1e] px-4 py-3 ${styles}`}>
            <Link to={`/users/${suggestedUsersToFollow.user_info.username}`} className={`flex gap-x-2 cursor-pointer`}>

                {suggestedUsersToFollow.user_info.avatar &&
                    <img
                        className={`size-11 rounded-full object-cover`}
                        src={suggestedUsersToFollow?.user_info.avatar}
                        alt="avatar"
                    />
                }
                {!suggestedUsersToFollow.user_info.avatar &&
                    <img
                        className={`size-11 rounded-full object-cover`}
                        src={`/profile-default-svgrepo-com.svg`}
                        alt="avatar"
                    />
                }

                <div className={`flex flex-col`}>
                    <span>{checkDisplayName}</span>
                    <span className={`text-[#71767b]`}>@{suggestedUsersToFollow?.user_info.username}</span>
                </div>
            </Link>

            <button
                disabled={isFollowedBtnDisabled}
                onClick={handleFollow}
                className={`${isFollowed ? 'bg-[#2a3139] text-neutral-200 hover:bg-[#323b45]' : 'bg-neutral-100 hover:bg-gray-200'} z-50 text-black px-6 max-h-10 transition font-semibold flex justify-center items-center rounded-full cursor-pointer`}>{isFollowed ? 'Following' : 'Follow'}
            </button>

        </div>
    )
}

export default FollowUser
