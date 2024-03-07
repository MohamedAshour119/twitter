import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {FaHeart, FaRegComment, FaRegHeart} from "react-icons/fa";
import {BsRepeat} from "react-icons/bs";
import {useContext, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {toast, Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Link, useParams} from "react-router-dom";


interface TweetInfo {
    user: {
        id: number;
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
        is_retweet: number;
    };
    reactions: {
        likes: number
    };
    retweets: {
        retweets: 0
    },
    is_reacted: boolean;
    is_retweeted: boolean;
}


function Tweet(props: TweetInfo) {

    const {baseUrl, user} = useContext(AppContext);
    const {username} = useParams();

    const formatDate = (originalDate:string) => {
        const date = new Date(originalDate)
        const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: 'short'}
        return date.toLocaleDateString('en-US', options)
    }
    const [isReacted, setIsReacted] = useState(props.is_reacted)
    const [reactionNumber, setReactionNumber] = useState(props.reactions.likes)

    const [retweetNumber, setRetweetNumber] = useState(props.retweets?.retweets)
    const [isRetweeted, setIsRetweeted] = useState(props.is_retweeted)

    // Handle tweet reaction
    const handleReaction = () => {
        ApiClient().post(`/reaction`, {id: props.tweet.id})
            .then((res) => {
                setIsReacted(res.data.data.is_reacted)
                setReactionNumber(res.data.data.reactions.likes)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Handle tweet retweet
    const handleRetweet = () => {
        if(props.tweet.user_id !== user?.id && !isRetweeted) {
            ApiClient().post(`/retweet`, {id: props.tweet.id})
                .then((res) => {
                    console.log(res.data)
                    setIsRetweeted(res.data.data.is_retweeted)
                    setRetweetNumber(res.data.data.retweets)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (props.tweet.user_id !== user?.id && isRetweeted) {
            ApiClient().post(`/removeRetweet`, {id: props.tweet.id})
                .then((res) => {
                    console.log(res.data)
                    setIsRetweeted(res.data.data.is_retweeted)
                    setRetweetNumber(res.data.data.retweets)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            toast.error("You can't retweet your tweets!", {
                className: 'custom-toast',
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Zoom,
            });
        }

    }

    return (
        <>
            <div className={`py-3 sm:px-6 px-2 gap-x-2 grid ${props.tweet.is_retweet > 0 ? 'grid-cols-1 gap-y-2' : ''} border-b border-zinc-700/70 `}>
                {props.tweet.is_retweet > 0 &&
                    <Link to={`/users/${username}`} className={`flex items-center gap-x-2 text-zinc-400/70`}>
                        <BsRepeat/>
                        <span className={`text-sm`}>{username === user?.username && props.tweet.is_retweet ? 'You retweeted' : `${username} retweeted`}</span>
                    </Link>
                }
                <div className={`flex gap-x-2`}>
                    <Link to={`/users/${props.user?.username}`}>
                        <img className={`size-11 object-cover rounded-full`} src={`${baseUrl}/storage/${props.user?.avatar}`} alt=""/>
                    </Link>
                    <div className={`flex gap-x-2 justify-between items-start w-full`}>
                        <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                            <Link to={`/users/${props.user?.username}`} className={`xs:flex gap-x-2`}>
                                <h1 className={`font-semibold cursor-pointer`}>{props.user?.username}</h1>
                                <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{props.user?.username}</h1>
                            </Link>
                            <span className={`font-light text-[#71767b] cursor-pointer`}>{formatDate(props.tweet?.created_at)}</span>
                        </div>

                        <div className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}>
                            <HiOutlineDotsHorizontal />
                        </div>
                    </div>
                </div>

                <div className={`w-[90%] justify-self-end`}>

                    <div className={`${props.tweet?.title?.length > 0 ? 'mt-4' : ''} grid grid-cols-1`}>
                        <p className={`w-fit break-all`}>{props.tweet?.title}</p>
                        <div className={`${props.tweet?.title?.length > 0 ? 'mt-4' : ''}`}>
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

                        <div onClick={handleRetweet} className={`flex items-center cursor-pointer group`}>
                            <div className={`text-xl flex justify-center items-center group-hover:text-emerald-400 transition group-hover:bg-emerald-400/20 rounded-full p-2`}>
                                <BsRepeat className={`group-hover:text-emerald-400 transition ${isRetweeted ? 'text-emerald-400' : 'text-zinc-400/70'}`}/>
                            </div>
                            <span className={`group-hover:text-emerald-400 transition ${isRetweeted ? 'text-emerald-400' : 'text-zinc-400/70'}`}>{retweetNumber ? retweetNumber : 0}</span>
                        </div>

                        <div onClick={handleReaction} className={`flex items-center cursor-pointer group`}>
                            <div className={`text-xl flex justify-center items-center group-hover:text-rose-500 transition group-hover:bg-rose-500/20 rounded-full p-2`}>
                                <FaRegHeart className={`${isReacted ? 'invisible absolute' : 'visible'}`}/>
                                <FaHeart className={`${isReacted ? 'visible text-rose-500' : 'invisible absolute'}`}/>
                            </div>
                            <span className={`group-hover:text-rose-500 transition ${isReacted ? 'text-rose-500' : ''}`}>{reactionNumber}</span>
                        </div>
                    </div>
                </div>



            </div>
        </>

    )
}

export default Tweet
