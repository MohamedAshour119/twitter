import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {FaHeart, FaRegComment, FaRegHeart} from "react-icons/fa";
import {BsRepeat} from "react-icons/bs";
import {useContext, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {toast, Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Link, useParams} from "react-router-dom";
import {TweetInfo} from "../../Interfaces.tsx";
import TweetTextAreaAndPreview from "./TweetTextAreaAndPreview.tsx";

function Tweet(props: TweetInfo) {

    const {
        baseUrl,
        user,
        location,
        isCommentOpen,
        setIsCommentOpen,
        setClickedTweet,
        clickedTweet,
    } = useContext(AppContext);

    const {username} = useParams();

    const [isReacted, setIsReacted] = useState(!props.main_tweet ? props.is_reacted : props.main_tweet.is_reacted)
    const [isRetweeted, setIsRetweeted] = useState(!props.main_tweet ? props.is_retweeted : props.main_tweet.is_retweeted)

    const tweetId: number = props.retweet_to ? props.retweet_to : props.id;


    // Handle tweet reaction
    const handleReaction = () => {

        ApiClient().post(`/reaction`, {id: tweetId})
            .then((res) => {
                setIsReacted(res.data.data.is_reacted)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Handle tweet retweet
    const handleRetweet = () => {
        if (!isRetweeted && props.main_tweet && props.main_tweet?.user_id !== user?.id) {
            ApiClient().post(`/retweet`, {id: tweetId})
                .then((res) => {
                    setIsRetweeted(res.data.data.is_retweeted)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (isRetweeted && props.main_tweet && props.main_tweet?.user_id !== user?.id) {
            ApiClient().post(`/removeRetweet`, {id: tweetId})
                .then((res) => {
                    setIsRetweeted(res.data.data.is_retweeted)
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


    // Add tweet info which user clicked
    const addTweetInfo = () => {
        const tweet = {
            user: {
                id: props.user_id,
                username: props.user.username,
                avatar: props.user.avatar,
            },
            tweet: {
                id: props.id,
                title: props.title,
                created_at: props.created_at,
                comments_count: props.comments_count,
            }
        }
        setClickedTweet(tweet)
        localStorage.setItem('tweet', JSON.stringify(tweet))
    }


    // Handle click open comments
    const handleOpenComments = () => {
        addTweetInfo()
        setIsCommentOpen(!isCommentOpen)
    }


    return (
        <>
            <div
                className={`border-b border-zinc-700/70 gap-x-2 grid ${isRetweeted ? 'grid-cols-1' : ''} border-b-1 border-zinc-700/70 relative`}>
                {((isRetweeted || props.main_tweet) && username !== props.user.username && location?.pathname === `/users/${username}` ) &&
                    <Link to={`/users/${username}`} className={`flex items-center gap-x-2 text-zinc-400/70 px-2 sm:px-6 pt-2`}>
                        <BsRepeat/>
                        <span
                            className={`text-sm`}>{(username === user?.username) ? 'You retweeted' : `${username} retweeted`}</span>
                    </Link>
                }

                <div className={`hover:bg-zinc-800/20 transition`}>
                    <Link to={`/tweets/${props.id}`}>
                        <div onClick={addTweetInfo} className={`grid py-3 sm:px-6 px-2 gap-x-2`}>
                            <div className={`flex gap-x-2`}>
                                <Link to={`/users/${props.user?.username}`} className={`md:w-[10%] w-[14%]`}>
                                    <img
                                        className={`size-11 object-cover rounded-full`}
                                        src={`${baseUrl}/storage/${props.user?.avatar}`}
                                        alt=""
                                    />
                                </Link>
                                <div className={`flex gap-x-2 justify-between items-start w-full`}>
                                    <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                                        <Link to={`/users/${props.user?.username}`} className={`xs:flex gap-x-2 ${location?.pathname === `/tweets/${clickedTweet.tweet.id}` && !props.comment_to ? 'flex-col' : 'flex-row'}`}>
                                            <h1 className={`font-semibold cursor-pointer`}>{props.user?.username}</h1>
                                            <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{props.user?.username}</h1>
                                        </Link>
                                        {(location?.pathname === `/home` || props.comment_to) &&
                                            <span className={`font-light text-[#71767b] cursor-pointer`}>
                                                {!props.main_tweet ? props.created_at : props.main_tweet.created_at}
                                            </span>
                                        }
                                    </div>

                                    <div
                                        className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}>
                                        <HiOutlineDotsHorizontal/>
                                    </div>
                                </div>
                            </div>

                            <div className={`w-[90%] justify-self-end`}>
                                <div className={`grid grid-cols-1`}>
                                    <p className={`w-fit break-all`}>{!props.main_tweet ? props.title : props.main_tweet.title}</p>
                                    <div className={`${props.title?.length ?? 0 ? '' : 'mt-4'}`}>
                                        {(props.image || props.main_tweet?.image) &&
                                            <img
                                                className={`rounded-2xl max-h-[40rem] w-full `}
                                                src={`${baseUrl}/storage/${!props.main_tweet ? props.image : props.main_tweet?.image}`}
                                                alt="post_image"
                                        />}

                                        {(props.video || props.main_tweet?.video) &&
                                            <video
                                                className="mt-2 max-h-[40rem] w-full"
                                                controls
                                                src={`${baseUrl}/storage/${!props.main_tweet ? props.video : props.main_tweet?.video}`}
                                        />}

                                        {(location?.pathname !== `/home` && !props.comment_to) &&
                                            <div className={`font-light text-[#71767b] cursor-pointer mt-3`}>
                                                {!props.main_tweet ? props.show_tweet_created_at : props.main_tweet.show_tweet_created_at}
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                    </Link>
                    <div className={`flex ml-20 pb-2 xxs:gap-x-10 xs:gap-x-14 sm:gap-x-6 md:gap-x-16 gap-x-4 text-zinc-400/70`}>
                        <div className={`flex items-center cursor-pointer group`}>
                            <div
                                onClick={handleOpenComments}
                                className={`text-xl flex justify-center items-center group-hover:text-sky-500 transition group-hover:bg-sky-500/20 rounded-full p-2`}>
                                <FaRegComment/>
                            </div>
                            <span
                                className={`group-hover:text-sky-500 transition`}>{!props.main_tweet ? props.comments_count : props.main_tweet.comments_count}</span>
                        </div>

                        <div onClick={handleRetweet} className={`flex items-center cursor-pointer group`}>
                            <div
                                className={`text-xl flex justify-center items-center group-hover:text-emerald-400 transition group-hover:bg-emerald-400/20 rounded-full p-2`}>
                                <BsRepeat
                                    className={`group-hover:text-emerald-400 transition ${isRetweeted ? 'text-emerald-400' : 'text-zinc-400/70'}`}/>
                            </div>
                            <span
                                className={`group-hover:text-emerald-400 transition ${isRetweeted ? 'text-emerald-400' : 'text-zinc-400/70'}`}>{!props.main_tweet ? props.retweets_count : props.main_tweet.retweets_count}</span>
                        </div>

                        <div onClick={handleReaction} className={`flex items-center cursor-pointer group`}>
                            <div
                                className={`text-xl flex justify-center items-center group-hover:text-rose-500 transition group-hover:bg-rose-500/20 rounded-full p-2`}>
                                <FaRegHeart className={`${isReacted ? 'invisible absolute' : 'visible'}`}/>
                                <FaHeart
                                    className={`${isReacted ? 'visible text-rose-500' : 'invisible absolute'}`}/>
                            </div>
                            <span
                                className={`group-hover:text-rose-500 transition ${isReacted ? 'text-rose-500' : ''}`}>{!props.main_tweet ? props.reactions_count : props.main_tweet.reactions_count}</span>
                        </div>
                    </div>
                </div>


                {/*  Comments  */}
                { location?.pathname === `/tweets/${props.id}` &&
                    <TweetTextAreaAndPreview/>
                }

            </div>
        </>

    )
}

export default Tweet
