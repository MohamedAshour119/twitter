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
import {TweetContext} from "../appContext/TweetContext.tsx";
import TweetCommonContent from "./TweetCommonContent.tsx";

function Tweet(props: TweetInfo) {

    const {
        user,
        location,
        isCommentOpen,
        setIsCommentOpen,
        setClickedTweet,
    } = useContext(AppContext);

    const {commentsCount} = useContext(TweetContext)

    const {username} = useParams();

    const [disableLink, setDisableLink] = useState(false)
    const [isReacted, setIsReacted] = useState(!props.main_tweet ? props.is_reacted : props.main_tweet.is_reacted)
    const [isRetweeted, setIsRetweeted] = useState(!props.main_tweet ? props.is_retweeted : props.main_tweet.is_retweeted)
    const [retweetsCount, setRetweetsCount] = useState(!props.main_tweet ? props.retweets_count : props.main_tweet.retweets_count)
    const [reactionssCount, setReactionssCount] = useState(!props.main_tweet ? props.reactions_count : props.main_tweet.reactions_count)

    const tweetId: number = props.retweet_to ? props.retweet_to : props.id;


    // Handle tweet reaction
    const handleReaction = () => {
        ApiClient().post(`/reaction`, {id: tweetId})
            .then((res) => {
                setIsReacted(res.data.data.is_reacted)
                setReactionssCount(res.data.data.reactions)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Handle tweet retweet
    const handleRetweet = () => {
        if (!isRetweeted && (props.main_tweet ? props.main_tweet?.user_id !== user?.id : props.user_id !== user?.id) ) {
            ApiClient().post(`/retweet`, {id: tweetId})
                .then((res) => {
                    setIsRetweeted(res.data.data.is_retweeted)
                    setRetweetsCount(res.data.data.retweets)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (isRetweeted && (props.main_tweet ? props.main_tweet?.user_id !== user?.id : props.user_id !== user?.id) )  {
            ApiClient().post(`/removeRetweet`, {id: tweetId})
                .then((res) => {
                    setIsRetweeted(res.data.data.is_retweeted)
                    setRetweetsCount(res.data.data.retweets)
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
                title: !props.main_tweet ? props.title : props.main_tweet.title,
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
                className={`border-b border-zinc-700/70 gap-x-2 grid ${isRetweeted ? 'grid-cols-1' : ''} border-b-1 border-zinc-700/70 relative group`}>
                {((isRetweeted || props.main_tweet) && username !== props.user?.username && location?.pathname === `/users/${username}` ) &&
                    <div className={` group-hover:bg-zinc-800/20 transition`}>
                        <Link to={`/users/${username}`} className={`w-fit flex items-center gap-x-2 text-zinc-400/70 px-2 sm:px-6 pt-2`}>
                            <BsRepeat/>
                            <span
                                className={`text-sm`}>{(username === user?.username) ? 'You retweeted' : `${username} retweeted`}</span>
                        </Link>
                    </div>
                }

                <div className={`group-hover:bg-zinc-800/20 transition`}>
                    {!disableLink ? (
                        <Link to={`/tweets/${props.main_tweet ? props.main_tweet.id : props.id}`}>
                            <TweetCommonContent
                                addTweetInfo={addTweetInfo}
                                username={props.user.username}
                                avatar={props.user.avatar}
                                comment_to={props.comment_to}
                                main_tweet={props.main_tweet}
                                created_at={props.created_at}
                                main_tweet_created_at={props.main_tweet?.created_at}
                                setDisableLink={setDisableLink}
                                title={props?.title}
                                main_tweet_title={props?.main_tweet?.title}
                                image={props?.image}
                                main_tweet_image={props?.main_tweet?.image}
                                video={props?.video}
                                main_tweet_video={props?.main_tweet?.video}
                                show_tweet_created_at={props?.show_tweet_created_at}
                                main_tweet_show_tweet_created_at={props?.main_tweet?.show_tweet_created_at}
                            />
                        </Link>
                    ) : (
                        <div>
                            <TweetCommonContent
                                addTweetInfo={addTweetInfo}
                                username={props.user.username}
                                avatar={props.user.avatar}
                                comment_to={props.comment_to}
                                main_tweet={props.main_tweet}
                                created_at={props.created_at}
                                main_tweet_created_at={props.main_tweet?.created_at}
                                setDisableLink={setDisableLink}
                                title={props?.title}
                                main_tweet_title={props?.main_tweet?.title}
                                image={props?.image}
                                main_tweet_image={props?.main_tweet?.image}
                                video={props?.video}
                                main_tweet_video={props?.main_tweet?.video}
                                show_tweet_created_at={props?.show_tweet_created_at}
                                main_tweet_show_tweet_created_at={props?.main_tweet?.show_tweet_created_at}
                            />
                        </div>
                    ) }
                    <div className={`flex ml-20 pb-2 xxs:gap-x-10 xs:gap-x-14 sm:gap-x-6 md:gap-x-16 gap-x-4 text-zinc-400/70`}>
                        <div onClick={handleOpenComments} className={`flex items-center cursor-pointer group/icon`}>
                            <div
                                className={`text-xl flex justify-center items-center group-hover/icon:text-sky-500 transition group-hover/icon:bg-sky-500/20 rounded-full p-2`}>
                                <FaRegComment/>
                            </div>
                            <span
                                className={`group-hover/icon:text-sky-500 transition`}>{props.id === commentsCount.id ? commentsCount.comments_counts : props.comments_count}</span>
                        </div>

                        <div onClick={handleRetweet} className={`flex items-center cursor-pointer group/icon`}>
                            <div
                                className={`text-xl flex justify-center items-center group-hover/icon:text-emerald-400 transition group-hover/icon:bg-emerald-400/20 rounded-full p-2`}>
                                <BsRepeat
                                    className={`group-hover/icon:text-emerald-400 transition ${isRetweeted ? 'text-emerald-400' : 'text-zinc-400/70'}`}/>
                            </div>
                            <span
                                className={`group-hover/icon:text-emerald-400 transition ${isRetweeted ? 'text-emerald-400' : 'text-zinc-400/70'}`}>{retweetsCount}</span>
                        </div>

                        <div onClick={handleReaction} className={`flex items-center cursor-pointer group/icon`}>
                            <div
                                className={`text-xl flex justify-center items-center group-hover/icon:text-rose-500 transition group-hover/icon:bg-rose-500/20 rounded-full p-2`}>
                                <FaRegHeart className={`${isReacted ? 'invisible absolute' : 'visible'}`}/>
                                <FaHeart
                                    className={`${isReacted ? 'visible text-rose-500' : 'invisible absolute'}`}/>
                            </div>
                            <span
                                className={`group-hover/icon:text-rose-500 transition ${isReacted ? 'text-rose-500' : ''}`}>{reactionssCount}</span>
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
