import {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {Link} from "react-router-dom";

interface SuggestedUsersToFollow {
    avatar: string | null
    ban_status: number | null
    birth_date: string
    email: string
    gender: string
    id: number | null
    username: string
    is_followed: boolean
}
interface Prop {
    suggestedUsersToFollow: SuggestedUsersToFollow
}
function FollowUser({suggestedUsersToFollow}: Prop) {

    const {baseUrl} = useContext(AppContext)

    const [isFollowed, setIsFollowed] = useState(false)
    const [isFollowedBtnDisabled, setIsFollowedBtnDisabled] = useState(false)

    const handleFollow = () => {
        setIsFollowedBtnDisabled(true)

        if(!isFollowed){
            ApiClient().post(`/${suggestedUsersToFollow.id}/follow`)
                .then(() => {
                    setIsFollowed(true)
                    setIsFollowedBtnDisabled(false);
                })
                .catch(error => {
                    console.error('Follow request failed:', error);
                    setIsFollowedBtnDisabled(false);
                });
        } else {

            ApiClient().post(`/${suggestedUsersToFollow.id}/unfollow`)
                .then(() => {
                    setIsFollowed(false)
                    setIsFollowedBtnDisabled(false);
                })
                .catch(error => {
                    console.error('Follow request failed:', error);
                    setIsFollowedBtnDisabled(false);
                });
        }

    };

    useEffect( () => {
        setIsFollowed(suggestedUsersToFollow.is_followed)
    }, [] )

    return (
        <div className={`flex justify-between hover:bg-[#25323f30] px-4 py-3`}>
            <Link to={`/users/${suggestedUsersToFollow.username}`} className={`flex gap-x-2 cursor-pointer`}>

                <img className={`size-11 rounded-full object-cover`}
                     src={`${baseUrl}/storage/${suggestedUsersToFollow?.avatar}`} alt=""
                />

                <div className={`flex flex-col`}>
                    <span>{suggestedUsersToFollow?.username}</span>
                    <span className={`text-[#71767b]`}>@{suggestedUsersToFollow?.username}</span>
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
