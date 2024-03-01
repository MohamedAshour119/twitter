import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {FaHeart, FaRegComment, FaRegHeart} from "react-icons/fa";
import {BsRepeat} from "react-icons/bs";
import {TbBrandGoogleAnalytics} from "react-icons/tb";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";

interface TweetInfo {
    user: {
        username: string;
        avatar: string,
    }

    tweet: {
        title: string;
        user_id: number;
        image: string;
        video: string;
        updated_at: string;
        created_at: string;
        id: number;
    };
    reactions: {
        likes: number;
    };
    is_reacted: boolean;
}


function Tweet(props: TweetInfo) {

    const {baseUrl} = useContext(AppContext);

    const formatDate = (originalDate:string) => {
        const date = new Date(originalDate)
        const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: 'short'}
        return date.toLocaleDateString('en-US', options)
    }
    const [isReacted, setIsReacted] = useState(props.is_reacted)

    // Handle tweet reaction
    const handleReaction = () => {
        if(!isReacted){
            ApiClient().post(`/reaction`, {id: props.tweet.id})
                .then((res) => {
                    setIsReacted(res.data.data.is_reacted)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    // useEffect( () => {
    //     setIsReacted(props.is_reacted)
    // }, [isReacted])


    return (
        <div className={`py-3 sm:px-6 px-2 flex gap-x-2 border-b border-zinc-700/70`}>
            <img className={`size-11 object-cover rounded-full`} src={`${baseUrl}/storage/${props.user?.avatar}`} alt=""/>

            <div className={`w-full`}>
                <div className={`flex gap-x-2 justify-between`}>
                    <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                        <div className={`xs:flex gap-x-2`}>
                            <h1 className={`font-semibold cursor-pointer`}>{props.user?.username}</h1>
                            <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{props.user?.username}</h1>
                        </div>
                        <span className={`font-light text-[#71767b] cursor-pointer`}>{formatDate(props.tweet?.created_at)}</span>
                    </div>

                    <div className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}>
                        <HiOutlineDotsHorizontal />
                    </div>
                </div>


                <div className={`mt-4 grid grid-cols-1`}>
                    <p className={`w-fit break-all`}>{props.tweet?.title}</p>
                    <div className={`mt-3`}>
                        {props.tweet?.image && <img
                            className={`rounded-2xl max-h-[40rem] w-full `}
                            src={`${baseUrl}/storage/${props.tweet?.image}`}
                            alt="post_image"
                        />}

                        {props.tweet?.video && <video
                            className="mt-2 max-h-[40rem] w-full"
                            controls
                            src={`${baseUrl}/storage/${props.tweet?.video}`}
                        />}

                    </div>
                </div>

                <div className={`flex xxs:gap-x-10 xs:gap-x-14 sm:gap-x-6 md:gap-x-16 gap-x-4 mt-2 text-zinc-400/70`}>
                    <div className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-sky-500 transition group-hover:bg-sky-500/20 rounded-full p-2`}>
                            <FaRegComment />
                        </div>
                        <span className={`group-hover:text-sky-500 transition`}>314</span>
                    </div>

                    <div className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-emerald-400 transition group-hover:bg-emerald-400/20 rounded-full p-2`}>
                            <BsRepeat />
                        </div>
                        <span className={`group-hover:text-emerald-400 transition`}>47</span>
                    </div>

                    <div onClick={handleReaction} className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-rose-500 transition group-hover:bg-rose-500/20 rounded-full p-2`}>
                            <FaRegHeart className={`${isReacted ? 'invisible absolute' : 'visible'}`}/>
                            <FaHeart className={`${isReacted ? 'visible text-rose-500' : 'invisible absolute'}`}/>
                        </div>
                        <span className={`group-hover:text-rose-500 transition ${isReacted ? 'text-rose-500' : ''}`}>{props.reactions?.likes || 0}</span>
                    </div>

                    <div className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-sky-500 transition group-hover:bg-sky-500/20 rounded-full p-2`}>
                            <TbBrandGoogleAnalytics />
                        </div>
                        <span className={`group-hover:text-sky-500 transition`}>6M</span>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Tweet
