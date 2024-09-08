import {FaHeart, FaRegComment, FaRegHeart} from "react-icons/fa";
import {BsRepeat} from "react-icons/bs";
import {Dispatch, forwardRef, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../ApiClient.tsx";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Link, useParams} from "react-router-dom";
import {TweetInfo, UserInfo} from "../../Interfaces.tsx";
import TweetTextAreaAndPreview from "./TweetTextAreaAndPreview.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {FaRegFaceAngry} from "react-icons/fa6";
import {MdDelete} from "react-icons/md";
import {TbPinnedFilled} from "react-icons/tb";
import {toastStyle} from "../helper/ToastifyStyle.tsx";

interface Props extends  TweetInfo {
    allProfileUserTweets?: TweetInfo[]
    setAllProfileUserTweets?: Dispatch<SetStateAction<TweetInfo[]>>
    userInfo?: UserInfo
    setUserInfo?: Dispatch<SetStateAction<UserInfo | undefined>>
    deleteComment?: () => void
}
const Tweet = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
    const {
        user,
        baseUrl,
        isCommentOpen,
        isModalOpen,
        setIsCommentOpen,
        clickedTweet,
        setClickedTweet,
    } = useContext(AppContext);

    const {
        tweets ,
        setTweets,
        allProfileUserTweets,
        setAllProfileUserTweets,
        comments,
        setComments,
    } = useContext(TweetContext)


    const {username} = useParams();

    const [isReacted, setIsReacted] = useState(!props.main_tweet ? props.is_reacted : props.main_tweet.is_reacted)
    const [isRetweeted, setIsRetweeted] = useState(!props.main_tweet ? props.is_retweeted : props.main_tweet.is_retweeted)
    const [retweetsCount, setRetweetsCount] = useState(!props.main_tweet ? props.retweets_count : props.main_tweet.retweets_count)
    const [reactionsCount, setReactionsCount] = useState(!props.main_tweet ? props.reactions_count : props.main_tweet.reactions_count)
    const [tweetMenuOpen, setTweetMenuOpen] = useState(false)
    const [disableLink, setDisableLink] = useState(false)

    const tweetId: number = props.retweet_to ? props.retweet_to : props.id;


    // Handle tweet reaction
    const handleReaction = () => {
        ApiClient().post(`/reaction`, {id: tweetId})
            .then((res) => {
                setIsReacted(res.data.data.is_reacted)
                setReactionsCount(res.data.data.reactions)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Handle tweet retweet
    const handleRetweet = () => {
        if (!isRetweeted && (props.main_tweet ? props.main_tweet?.user_id !== user?.user_info.id : props.user_id !== user?.user_info.id) ) {
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
        } else if (isRetweeted && (props.main_tweet ? props.main_tweet?.user_id !== user?.user_info.id : props.user_id !== user?.user_info.id) )  {
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
            toast.error("You can't retweet your tweets!", toastStyle);
        }

    }

    // Hide Tweet from feed
    const hideTweet = () => {
        ApiClient().post(`/uninterested-tweet/${tweetId}`)
            .then(() => {
                const filteredTweets = tweets.filter(tweet => (tweet.id || tweet.main_tweet.id) !== tweetId)
                setTweets(filteredTweets)
            })
            .catch()
            .finally(() => setTweetMenuOpen(false))
    }

    // Add tweet info which user clicked
    const addTweetInfo = () => {
        const tweet = {
            user: {
                user_info: {
                    id: props.user_id,
                    username: props.user.user_info.username,
                    avatar: props.user.user_info.avatar,
                    display_name: props.user.user_info.display_name,
                    is_followed: props.user.user_info.is_followed,
                }
            },

            user_id: props.user_id,
            title: props.title,
            image: props.image,
            video: props.video,
            show_tweet_created_at: props.show_tweet_created_at,
            updated_at: props.updated_at,
            created_at: props.created_at,
            is_pinned: props.is_pinned,
            id: props.id,
            slug: props.slug,
            retweet_to: props.retweet_to,
            comment_to: props.comment_to,
            reactions_count: props.reactions_count,
            retweets_count: props.retweets_count,
            is_reacted: props.is_reacted,
            is_retweeted: props.is_retweeted,
            comments_count: props.comments_count,
            main_tweet: {
                title: props.main_tweet?.title,
                user_id: props.main_tweet?.user_id,
                image: props.main_tweet?.image,
                video: props.main_tweet?.video,
                show_tweet_created_at: props.main_tweet?.show_tweet_created_at,
                updated_at: props.main_tweet?.updated_at,
                created_at: props.main_tweet?.created_at,
                is_pinned: props.main_tweet?.is_pinned,
                id: props.main_tweet?.id,
                slug: props.main_tweet?.slug,
                retweet_to: props.main_tweet?.retweet_to,
                comment_to: props.main_tweet?.comment_to,
                reactions_count: props.main_tweet?.reactions_count,
                retweets_count: props.main_tweet?.retweets_count,
                comments_count: props.main_tweet?.comments_count,
                is_reacted: props.main_tweet?.is_reacted,
                is_retweeted: props.main_tweet?.is_retweeted,
                user: {
                    user_info: {
                        id: props.user_id,
                        username: props.user.user_info.username,
                        avatar: props.user.user_info.avatar,
                        display_name: props.user.user_info.display_name,
                        is_followed: props.user.user_info.is_followed,
                    }
                },
            }
        }
        setClickedTweet(tweet)
    }


    // Handle click open comments
    const handleOpenComments = () => {
        console.log('clicked')
        addTweetInfo()
        setIsCommentOpen(!isCommentOpen)
        console.log('after')
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
    const tweetText = props.main_tweet ? props.main_tweet.title : props.title;
    const deleteTweet = () => {

        const hashtags = tweetText?.match(/#[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z0-9_]*[^\s]/g);
        if(!props.comment_to) {
            ApiClient().post(`/delete-tweet/${props.id}`, hashtags)
                .then(() => {
                    if (props.setUserInfo) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        props.setUserInfo(prevState => ({
                            ...prevState,
                            tweets_count: props.userInfo?.user_info.tweets_count ? props.userInfo?.user_info.tweets_count - 1 : null
                        }))
                    }

                    const filteredUserTweets = props.allProfileUserTweets?.filter(singleTweet => singleTweet.id !== props.id)
                    props.setAllProfileUserTweets && filteredUserTweets && props.setAllProfileUserTweets(filteredUserTweets)
                    toast.success(`Tweet deleted successfully`, toastStyle)

                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setTweetMenuOpen(false))
        } else {
            ApiClient().post(`/delete-tweet/${clickedTweet.id}`, hashtags)
                .then(() => {
                    const filteredTweetComments = comments?.filter(comment => comment.id !== clickedTweet.id)
                    setComments(filteredTweetComments)
                    toast.success(`Comment deleted successfully`, toastStyle)

                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setTweetMenuOpen(false))
        }


    }

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
            'tweet_id': clickedTweet.id
        }

        if(clickedTweet.user.user_info.id === user?.user_info.id) {
            ApiClient().post(`/pin-tweet`, data)
                .finally(() => {
                    tweetMenuRef.current?.classList.add('animate-fade-out')
                    setTimeout(() => {
                        setTweetMenuOpen(false)
                    }, 200)
                })
        }

        updatedTweets()
    }

    // ReArrange User tweets after make tweet pinned
    const updatedTweets = () => {
        const prevPinnedTweetIndex = allProfileUserTweets.findIndex(tweet => tweet.is_pinned);

        const updatedTweetsArr = [...allProfileUserTweets];
        if (prevPinnedTweetIndex !== -1) { // Check if the pinned tweet exists or not
            updatedTweetsArr[prevPinnedTweetIndex] = {
                ...updatedTweetsArr[prevPinnedTweetIndex],
                is_pinned: false
            };
        }

        // Update new pinned tweet 'is_pinned' property
        const newPinnedTweetIndex = updatedTweetsArr.findIndex(tweet => tweet.id === tweetId);
        if (newPinnedTweetIndex !== -1) { // Check if the new pinned tweet exists
            updatedTweetsArr[newPinnedTweetIndex] = {
                ...updatedTweetsArr[newPinnedTweetIndex],
                is_pinned: true
            };

            // Re-arrange tweets with the new pinned tweet at the beginning
            const newUpdatedTweets = [
                updatedTweetsArr[newPinnedTweetIndex],
                ...updatedTweetsArr.slice(0, newPinnedTweetIndex),
                ...updatedTweetsArr.slice(newPinnedTweetIndex + 1)
            ];

            setAllProfileUserTweets(newUpdatedTweets);
        }
    };

    const conditionWithRetweets = location.pathname === `/users/${username}` && props.main_tweet
    const conditionWithoutRetweets = location.pathname !== `/users/${username}`

    const tweetCommonContent =
        <div
            onClick={addTweetInfo}
            className={`grid py-3 sm:px-6 px-2 gap-x-2`}
        >
            <div className={`flex gap-x-2`}>
                <Link to={`/users/${conditionWithoutRetweets ? props.user?.user_info.username : props.userInfo?.user_info.username}`} className={`md:w-[10%] w-[14%]`}>
                    <img
                        className={`size-11 object-cover rounded-full select-none`}
                        src={`${baseUrl}/storage/${conditionWithRetweets ? props.main_tweet.user.user_info.avatar : conditionWithoutRetweets ? props.user?.user_info.avatar : props.userInfo?.user_info.avatar}`}
                        alt=""
                    />
                </Link>
                <div className={`flex gap-x-2 justify-between items-start w-full`}>
                    <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                        <Link to={`/users/${conditionWithRetweets ? props.main_tweet.user.user_info.username : conditionWithoutRetweets ? props.user?.user_info.username : props.userInfo?.user_info.username}`} className={`xs:flex gap-x-2 ${location?.pathname === `/tweets/${clickedTweet.id}` && !props.comment_to ? 'flex-col' : 'flex-row'}`}>
                            <h1 className={`font-semibold cursor-pointer`}>{(conditionWithoutRetweets && props.user?.user_info.display_name) ? props.user?.user_info.display_name : conditionWithRetweets ? props.main_tweet.user.user_info.username : conditionWithoutRetweets ? props.user?.user_info.username : props.userInfo?.user_info.display_name ? props.userInfo.user_info.display_name : props.userInfo?.user_info.username}</h1>
                            <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{props.user?.user_info.username}</h1>
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
        <div
            ref={ref}
            className={`border-b border-zinc-700/70 gap-x-2 grid ${isRetweeted ? 'grid-cols-1' : ''} relative group`}>

            {((props.main_tweet && props.main_tweet?.is_pinned) || (!props.main_tweet && props.is_pinned) && location?.pathname === `/users/${username}`) &&
                <div className={` group-hover:bg-zinc-800/20 transition`}>
                    <div className={`text-sm w-fit flex items-center gap-x-1 text-zinc-400/70 px-2 sm:px-6 pt-2`}>
                        <TbPinnedFilled className={`text-xl`}/>
                        Pinned
                    </div>
                </div>
            }

            {((isRetweeted || props.main_tweet) && username !== props.user?.user_info.username && location?.pathname === `/users/${username}` ) &&
                <div className={` group-hover:bg-zinc-800/20 transition`}>
                    <Link to={`/users/${username}`} className={`w-fit flex items-center gap-x-2 text-zinc-400/70 px-2 sm:px-6 pt-2`}>
                        <BsRepeat/>
                        <span
                            className={`text-sm`}>{(username === user?.user_info.username) ? 'You retweeted' : `"${props.userInfo?.user_info.display_name ? props.userInfo.user_info.display_name : username}" retweeted`}</span>
                    </Link>
                </div>
            }

            {/* Popup windows */}
            {tweetMenuOpen &&
                <div
                    ref={tweetMenuRef}
                    onMouseEnter={() => setDisableLink(true)}
                    onMouseLeave={() => setDisableLink(false)}
                    className={`${tweetMenuOpen ? 'animate-fade-in' : ''} tweet-drop-down-clip-path z-50 bg-[#0a0c0e] flex flex-col gap-y-3 justify-self-end py-4 px-4 pr-8 absolute w-[21rem] right-16 top-4`}>
                    {props.user_id === user?.user_info.id &&
                        <>
                            <button
                                onClick={deleteTweet}
                                disabled={!tweetMenuOpen}
                                className={`flex text-red-700 font-semibold items-center gap-x-3 bg-[#111315] py-3 px-6 text-left rounded-lg hover:bg-[#1a1d20] transition cursor-pointer`}>
                                <MdDelete className={`size-5`}/>
                                Delete
                            </button>
                            {!props.comment_to &&
                                <button
                                onClick={pinTweet}
                                disabled={!tweetMenuOpen}
                                className={`flex items-center gap-x-3 bg-[#111315] py-3 px-6 text-left rounded-lg hover:bg-[#1a1d20] transition cursor-pointer`}>
                                <TbPinnedFilled className={`size-5`}/>
                                Pin to your profile
                                </button>
                            }
                        </>
                    }
                    {props.user_id !== user?.user_info.id &&
                        <>
                            <button
                                onClick={handleRetweet}
                                disabled={!tweetMenuOpen}
                                className={`flex items-center gap-x-3 bg-[#111315] py-3 px-6 text-left rounded-lg hover:bg-[#1a1d20] transition ${!tweetMenuOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                                <BsRepeat className={`size-5`}/>
                                Retweet
                            </button>
                            <button
                                onClick={hideTweet}
                                disabled={!tweetMenuOpen}
                                className={`flex items-center gap-x-3 bg-[#111315] py-3 px-6 text-left rounded-lg hover:bg-[#1a1d20] transition ${!tweetMenuOpen ? 'cursor-default' : 'cursor-pointer'}`}>
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
                            className={`group-hover/icon:text-sky-500 transition`}>{props.main_tweet ? props.main_tweet.comments_count : props.comments_count}</span>
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
                <div className={`${location?.pathname === `/tweets/${props.id}` && (isCommentOpen || isModalOpen) ? 'hidden' : ''}`}>
                    <TweetTextAreaAndPreview/>
                </div>
            }

        </div>

    )
})

export default Tweet
