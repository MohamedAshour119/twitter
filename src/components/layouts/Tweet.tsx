import {FaHeart, FaRegComment, FaRegHeart} from "react-icons/fa";
import {BsRepeat} from "react-icons/bs";
import {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {toast, Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Link, useParams} from "react-router-dom";
import {TweetInfo, UserInfo} from "../../Interfaces.tsx";
import TweetTextAreaAndPreview from "./TweetTextAreaAndPreview.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import {HiMiniXMark} from "react-icons/hi2";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {FaRegFaceAngry} from "react-icons/fa6";
import {MdDelete} from "react-icons/md";
import {TbPinnedFilled} from "react-icons/tb";

interface Props extends  TweetInfo {
    allProfileUserTweets?: TweetInfo[]
    setAllProfileUserTweets?: Dispatch<SetStateAction<TweetInfo[]>>
    userInfo?: UserInfo
}
function Tweet(props: Props) {

    const {
        user,
        location,
        baseUrl,
        isCommentOpen,
        setIsCommentOpen,
        clickedTweet,
        setClickedTweet,
    } = useContext(AppContext);

    const {randomTweets ,setRandomTweets} = useContext(TweetContext)

    const {commentsCount} = useContext(TweetContext)

    const {username} = useParams();

    const [isReacted, setIsReacted] = useState(!props.main_tweet ? props.is_reacted : props.main_tweet.is_reacted)
    const [isRetweeted, setIsRetweeted] = useState(!props.main_tweet ? props.is_retweeted : props.main_tweet.is_retweeted)
    const [retweetsCount, setRetweetsCount] = useState(!props.main_tweet ? props.retweets_count : props.main_tweet.retweets_count)
    const [reactionsCount, setReactionssCount] = useState(!props.main_tweet ? props.reactions_count : props.main_tweet.reactions_count)
    const [tweetMenuOpen, setTweetMenuOpen] = useState(false)
    const [disableLink, setDisableLink] = useState(false)

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

                    if(tweetMenuOpen) {
                        setTweetMenuOpen(false)
                    }

                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (isRetweeted && (props.main_tweet ? props.main_tweet?.user_id !== user?.id : props.user_id !== user?.id) )  {
            ApiClient().post(`/removeRetweet`, {id: tweetId})
                .then((res) => {
                    setIsRetweeted(res.data.data.is_retweeted)
                    setRetweetsCount(res.data.data.retweets)

                    if(tweetMenuOpen) {
                        setTweetMenuOpen(false)
                    }

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

    // Hide Tweet from feed
    const hideTweet = () => {
        ApiClient().post(`/uninterested-tweet/${tweetId}`)
            .then(() => {
                const filteredTweets = randomTweets.filter(tweet => (tweet.id || tweet.main_tweet.id) !== tweetId)
                setRandomTweets(filteredTweets)
            })
            .catch()
            .finally(() => setTweetMenuOpen(false))
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
    }


    // Handle click open comments
    const handleOpenComments = () => {
        addTweetInfo()
        setIsCommentOpen(!isCommentOpen)
    }

    // Handle click outside the Tweet menu window
    const tweetMenuRef = useRef<HTMLDivElement>(null)
    useEffect( () => {
        const handleOutside = (e: MouseEvent) => {
            if(tweetMenuRef.current && !tweetMenuRef.current?.contains(e.target as Node)){
                tweetMenuRef.current.classList.add('animate-fade-out')
                setTimeout(() => {
                    setTweetMenuOpen(false)
                }, 300)
            }
        }
        document.addEventListener('mousedown', handleOutside)
        return () => {
            document.removeEventListener('mousedown', handleOutside)
        }
    }, [] )

    // Delete tweet
    const deleteTweet = () => {

        const hashtags = tweetText?.match(/#[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z0-9_]*[^\s]/g);

        ApiClient().post(`/delete-tweet/${props.id}`, hashtags)
            .then(() => {
                const filteredUserTweets = props.allProfileUserTweets?.filter(singleTweet => singleTweet.id !== props.id)
                props.setAllProfileUserTweets && filteredUserTweets && props.setAllProfileUserTweets(filteredUserTweets)
                toast.success("Tweet deleted successfully", {
                    className: 'custom-toast',
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Zoom,
                });
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setTweetMenuOpen(false))
    }

    const tweetText = props.main_tweet ? props.main_tweet.title : props.title;

    const detectHashtag = () => {
        const hashtags = tweetText?.match(/#[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z0-9_]*[^\s]/g);

        const renderHashtags = hashtags?.map((hashtag, index) => {
            return (
                <Link to={'/'} key={index} className={`text-sky-600`}>{hashtag} <br/> </Link>
            )
        })

        let fullText: string | undefined | null = tweetText;

        if (hashtags && hashtags.length > 0) {
            hashtags.forEach(hashtag => {
                fullText = fullText?.replace(hashtag, '');
            });
        }


        return (
            <div>
                <div>
                    {renderHashtags}
                </div>
                <div>
                    {fullText}
                </div>
            </div>
        )
    }

    // Pin tweet
    const pinTweet = () => {

        const data = {
            'username': username,
            'tweet_id': clickedTweet.tweet.id
        }

        if(clickedTweet.user.id === user?.id) {
            ApiClient().post(`/pin-tweet`, data)
                .then(res => {

                    console.log(res)
                })
                .catch()
                .finally(() => {
                    tweetMenuRef.current?.classList.add('animate-fade-out')
                    setTimeout(() => {
                        setTweetMenuOpen(false)
                    }, 200)
                })
        }
    }

    const tweetCommonContent =
        <div onClick={addTweetInfo} className={`grid py-3 sm:px-6 px-2 gap-x-2`}>
            <div className={`flex gap-x-2`}>
                <Link to={`/users/${props.user?.username}`} className={`md:w-[10%] w-[14%]`}>
                    <img
                        className={`size-11 object-cover rounded-full select-none`}
                        src={`${baseUrl}/storage/${props.user?.avatar}`}
                        alt=""
                    />
                </Link>
                <div className={`flex gap-x-2 justify-between items-start w-full`}>
                    <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                        <Link to={`/users/${props.user?.username}`} className={`xs:flex gap-x-2 ${location?.pathname === `/tweets/${clickedTweet.tweet.id}` && !props.comment_to ? 'flex-col' : 'flex-row'}`}>
                            <h1 className={`font-semibold cursor-pointer`}>{props.user?.display_name ? props.user?.display_name : props.user?.username}</h1>
                            <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{props.user?.username}</h1>
                        </Link>
                        {(location?.pathname === `/home` || !props.comment_to) &&
                            <span className={`font-light text-[#71767b] cursor-pointer`}>
                                {!props.main_tweet ? props.created_at : props.main_tweet.created_at}
                            </span>
                        }
                    </div>
                    <div
                        onTouchStart={() => setDisableLink(true)}
                        onTouchEnd={() => setDisableLink(true)}
                        onClick={() => setTweetMenuOpen(!tweetMenuOpen)}
                        onMouseEnter={() => setDisableLink(true)}
                        onMouseLeave={() => setDisableLink(false)}
                        className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}>
                        <HiOutlineDotsHorizontal/>
                    </div>
                </div>
            </div>

            <div className={`md:w-[90%] w-[86%] justify-self-end`}>
                <div className={`grid grid-cols-1`}>
                    <p className={`w-fit break-all`}>{ tweetText && tweetText?.length <= 1 ? tweetText : detectHashtag()}</p>
                    <div>
                        {(props.image || props.main_tweet?.image) &&
                            <img
                                className={`rounded-2xl max-h-[40rem] w-full ${props.image || props.main_tweet?.image ? 'mt-4' : ''}`}
                                src={`${baseUrl}/storage/${!props.main_tweet ? props.image : props.main_tweet?.image}`}
                                alt="post_image"
                            />}

                        {(props.video || props.main_tweet?.video) &&
                            <video
                                className={`max-h-[40rem] w-full rounded-2xl ${props.video || props.main_tweet?.video ? 'mt-4' : ''}`}
                                controls
                                src={`${baseUrl}/storage/${!props.main_tweet ? props.video : props.main_tweet?.video}`}
                            />}

                        {(location?.pathname !== `/home` && props.comment_to) &&
                            <div className={`font-light text-[#71767b] cursor-pointer mt-3`}>
                                {!props.main_tweet ? props.show_tweet_created_at : props.main_tweet.show_tweet_created_at}
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>


    return (
        <>
            <div
                className={`border-b border-zinc-700/70 gap-x-2 grid ${isRetweeted ? 'grid-cols-1' : ''} relative group`}>

                {((props.main_tweet && props.main_tweet?.is_pinned) || (!props.main_tweet && props.is_pinned) && location?.pathname === `/users/${username}`) &&
                    <div className={` group-hover:bg-zinc-800/20 transition`}>
                        <div className={`text-sm w-fit flex items-center gap-x-1 text-zinc-400/70 px-2 sm:px-6 pt-2`}>
                            <TbPinnedFilled className={`text-xl`}/>
                            Pinned
                        </div>
                    </div>
                }

                {((isRetweeted || props.main_tweet) && username !== props.user?.username && location?.pathname === `/users/${username}` ) &&
                    <div className={` group-hover:bg-zinc-800/20 transition`}>
                        <Link to={`/users/${username}`} className={`w-fit flex items-center gap-x-2 text-zinc-400/70 px-2 sm:px-6 pt-2`}>
                            <BsRepeat/>
                            <span
                                className={`text-sm`}>{(username === user?.username) ? 'You retweeted' : `"${props.userInfo?.display_name ? props.userInfo.display_name : username}" retweeted`}</span>
                        </Link>
                    </div>
                }

                {/* Popup windows */}
                {tweetMenuOpen &&
                    <div
                        ref={tweetMenuRef}
                        onMouseEnter={() => setDisableLink(true)}
                        onMouseLeave={() => setDisableLink(false)}
                        className={`${tweetMenuOpen ? 'animate-fade-in' : ''} shadow-[0_0_5px_-1px_white] z-[300] bg-black flex flex-col gap-y-3 justify-self-end border border-neutral-700/70 py-4 px-4 rounded-lg absolute w-[21rem] right-2 top-2 shadow-[-2px_2px_12px_#4f4e4e]ooo`}>
                        <div
                            onClick={() => {
                                tweetMenuRef.current?.classList.add('animate-fade-out')
                                setTimeout(() => {
                                    setTweetMenuOpen(false)
                                }, 300)
                            }}
                            className="absolute -right-4 -top-4 cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                            <HiMiniXMark/>
                        </div>
                        {props.user_id === user?.id &&
                            <>
                                <button
                                    onClick={deleteTweet}
                                    disabled={!tweetMenuOpen}
                                    className={`flex text-red-700 font-semibold items-center gap-x-3 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition cursor-pointer`}>
                                    <MdDelete className={`size-5`}/>
                                    Delete
                                </button>
                                {!props.comment_to &&
                                    <button
                                    onClick={pinTweet}
                                    disabled={!tweetMenuOpen}
                                    className={`flex items-center gap-x-3 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition cursor-pointer`}>
                                    <TbPinnedFilled className={`size-5`}/>
                                    Pin to your profile
                                    </button>
                                }
                            </>
                        }
                        {props.user_id !== user?.id &&
                            <>
                                <button
                                    onClick={handleRetweet}
                                    disabled={!tweetMenuOpen}
                                    className={`flex items-center gap-x-3 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition ${!tweetMenuOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                                    <BsRepeat className={`size-5`}/>
                                    Retweet
                                </button>
                                <button
                                    onClick={hideTweet}
                                    disabled={!tweetMenuOpen}
                                    className={`flex items-center gap-x-3 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition ${!tweetMenuOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                                    <FaRegFaceAngry className={`size-5`}/>
                                    Not interested in this post
                                </button>
                            </>
                        }
                    </div>
                }

                <div className={`${!disableLink ? 'group-hover:bg-zinc-800/20' : ''} transition`}>
                    {!disableLink ? (
                        <Link to={`/tweets/${props.main_tweet ? props.main_tweet.id : props.id}`}>
                            {tweetCommonContent}
                        </Link>
                    ) : (
                        <div>
                            {tweetCommonContent}
                        </div>
                    ) }
                    <div className={`flex sm:mx-20 xs:mx-16 xxs:mx-14 mx-12 pb-2 xxs:gap-x-10 xs:gap-x-14 sm:gap-x-6 md:gap-x-16 gap-x-8 text-zinc-400/70`}>
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
                                className={`group-hover/icon:text-rose-500 transition ${isReacted ? 'text-rose-500' : ''}`}>{reactionsCount}</span>
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
