import Model from "../layouts/Model.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {RiArrowLeftLine} from "react-icons/ri";
import {useParams} from "react-router-dom";
import {CgCalendarDates} from "react-icons/cg";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";
import ApiClient from "../services/ApiClient.tsx";
import EditProfileModal from "../layouts/EditProfileModal.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import {toast} from "react-toastify";
import {toastStyle} from "../helper/ToastifyStyle.tsx";
import SpinLoader from "../helper/SpinLoader.tsx";


function Profile() {

    const {username} = useParams();
    const {
        isModalOpen,
        baseUrl,
        isCommentOpen,
        isShowEditInfoModal,
        setIsShowEditInfoModal,
        goBack,
        user,
    } = useContext(AppContext)
    const {
        allProfileUserTweets,
        setAllProfileUserTweets,
        userInfo,
        setUserInfo
    } = useContext(TweetContext)

    const [isFollowed, setIsFollowed] = useState(false)
    const [isFollowedBtnDisabled, setIsFollowedBtnDisabled] = useState(false)
    const [pageURL, setPageURL] = useState('')
    const [isActive, setIsActive] = useState({
        posts: true,
        replies: false,
        likes: false,
    })
    const [isLoading, setIsLoading] = useState(true)

    const toggleModel = () => {
        setIsShowEditInfoModal(!isShowEditInfoModal)
    }

    // Reset allProfileUserTweets state when username changes
    useEffect(() => {
        setAllProfileUserTweets([]);
    }, [location?.pathname, username]);
    
    // Get all user tweets
    const getAllUserTweets = (pageURL: string) => {
        ApiClient().get(pageURL)
            .then(res => {
                setUserInfo(res.data.data.user)
                const tweets = res.data.data.pagination.data
                if(tweets){
                    setAllProfileUserTweets(prevTweets => ([...prevTweets, ...tweets]))
                }
                setPageURL(res.data.data.pagination.next_page_url)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        setPageURL('');
        setAllProfileUserTweets([])
        getAllUserTweets(`users/${username}`)
    }, [userInfo?.user_info.avatar, userInfo?.user_info.display_name, username]);


    // Get the tweets which is suitable to the button which is clicked
    const getSuitableTweets = (pageURL: string) => {
        setPageURL('')
        ApiClient().get(pageURL)
            .then(res => {
                setAllProfileUserTweets(prevState => ([
                    ...prevState,
                    ...res.data.data.pagination.data
                ]))
                setPageURL(res.data.data.pagination.next_page_url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // All User Tweets
    const tweets: React.ReactNode = allProfileUserTweets?.map(tweetInfo => {
        if (!(tweetInfo.retweet_to && !tweetInfo.main_tweet)) {
            return (
                <Tweet
                    key={tweetInfo.id}
                    allProfileUserTweets={allProfileUserTweets}
                    setAllProfileUserTweets={setAllProfileUserTweets}
                    {...tweetInfo}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                />
            )
        }
    });


    // Handle active buttons
    const postsRef = useRef<HTMLLIElement>(null);
    const repliesRef = useRef<HTMLLIElement>(null);
    const likesRef = useRef<HTMLLIElement>(null);

    useEffect( () => {
        const handleClick = (e: MouseEvent) => {
            if(postsRef.current?.contains(e.target as Node)){
                setIsActive(prevIsActive => ({
                    ...prevIsActive,
                    posts: true,
                    replies: false,
                    likes: false,
                }))
            }
            if(repliesRef.current?.contains(e.target as Node)){
                setIsActive(prevIsActive => ({
                    ...prevIsActive,
                    posts: false,
                    replies: true,
                    likes: false,
                }))
            }
            if(likesRef.current?.contains(e.target as Node)){
                setIsActive(prevIsActive => ({
                    ...prevIsActive,
                    posts: false,
                    replies: false,
                    likes: true,
                }))
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }

    }, [location?.pathname])


    // Reset posts category active when the slug change
    useEffect( () => {
        setIsActive(prevIsActive => ({
            ...prevIsActive,
            posts: true,
            replies: false,
            likes: false
        }))
    }, [username])

    // Handle following user
    const checkDisplayName = userInfo?.user_info.display_name ? userInfo.user_info.display_name : userInfo?.user_info.username
    const handleFollow = () => {
        setIsFollowedBtnDisabled(true)

        if(!isFollowed){
            ApiClient().post(`/${userInfo?.user_info.id}/follow`)
                .then(() => {
                    toast.success(`You are following "${checkDisplayName}"`, toastStyle)
                    setIsFollowed(true)
                    setIsFollowedBtnDisabled(false);
                })
                .catch(error => {
                    toast.error(`Error occurs!, try again`, toastStyle)
                    console.error('Follow request failed:', error);
                    setIsFollowedBtnDisabled(false);
                })
        } else {

            ApiClient().post(`/${userInfo?.user_info.id}/unfollow`)
                .then(() => {
                    toast.error(`You are not following "${checkDisplayName}" anymore`, toastStyle)
                    setIsFollowed(false)
                    setIsFollowedBtnDisabled(false);
                })
                .catch(error => {
                    toast.error(`Error occurs!, try again`, toastStyle)
                    console.error('Follow request failed:', error);
                    setIsFollowedBtnDisabled(false);
                });
        }

    };

    useEffect( () => {
        if (userInfo?.user_info.is_followed != null) {
            setIsFollowed(userInfo.user_info.is_followed)
        }
    }, [userInfo] )

    // Detect when scroll to last element
    const lastTweetRef = useRef<HTMLDivElement>(null)
    useEffect( () => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && isActive.posts) {
                getAllUserTweets(pageURL)
            } else if (entries[0].isIntersecting && (isActive.likes || isActive.replies)) {
                getSuitableTweets(pageURL)
            }
        }, {
            threshold: 0.5  // Trigger when 50% of the last tweet is visible
        })

    // Watch the last tweet
        if(lastTweetRef.current) {
            observer.observe(lastTweetRef.current)
        }

    // cleanup
        return () => {
            if(observer) {
                observer.disconnect(); // Disconnect the observer to prevent further observations
            }
        };

    }, [pageURL])

    if(isModalOpen || isCommentOpen || isShowEditInfoModal) {
        document.body.style.backgroundColor = '#1d252d'
    } else {
        document.body.style.backgroundColor = 'black'
    }

    useEffect(() => {
        const bodyEl = document.body;
        if (isModalOpen || isCommentOpen || isShowEditInfoModal) {
            bodyEl.style.overflow = 'hidden';
        } else {
            bodyEl.style.overflow = 'auto';
        }
    }, [isModalOpen, isCommentOpen, isShowEditInfoModal]);

    return (
        <div className={`${isModalOpen || isCommentOpen || isShowEditInfoModal ? '' : 'bg-black'} text-neutral-200`}>

            {/* Edit user info model */}
            {isShowEditInfoModal &&
                <EditProfileModal
                    isShowEditInfoModal={isShowEditInfoModal}
                    setIsShowEditInfoModal={setIsShowEditInfoModal}
                    setUserInfo={setUserInfo}
                />
            }

            <header className={`flex border ${isModalOpen || isCommentOpen || isShowEditInfoModal ? 'opacity-20 pointer-events-none' : ''} py-2 gap-x-3 px-4 border-zinc-700/70 3xl:max-w-[42.98rem] 2xl:max-w-[38.58rem] xl:max-w-[31.75rem] lg:max-w-[31.68rem] md:max-w-[37.74rem] sm:max-w-[30rem] xs:max-w-[31.26rem] xxs:max-w-[27.87rem]`}>
                <div onClick={goBack} className={`hover:bg-neutral-600/30 flex justify-center items-center p-4 rounded-full transition cursor-pointer`}>
                    <RiArrowLeftLine className={`size-5`}/>
                </div>
                <div className={`w-full`}>
                    <h1 className={`font-semibold text-xl`}>
                        {!isLoading && userInfo?.user_info.username}
                        {isLoading &&
                            <div className="h-[25px] bg-[#2a2d32b3] animate-pulse rounded-full w-48"></div>
                        }
                    </h1>
                    {(!isLoading && userInfo?.user_info.tweets_count) && <div
                        className={`text-[#71767b] text-sm`}>{userInfo?.user_info.tweets_count && userInfo.user_info.tweets_count <= 1 ? `${userInfo.user_info.tweets_count} post` : `${userInfo?.user_info.tweets_count} posts`}</div>
                    }
                    {isLoading &&
                        <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-28 mt-1"></div>
                    }
                </div>
            </header>

            <div className={`${isModalOpen || isCommentOpen || isShowEditInfoModal ? 'opacity-20 pointer-events-none' : ''} `}>

                {/* Middle section */}
                <div className={`text-neutral-200 border-r border-l border-zinc-700/70 ${isLoading ? 'max-h-[35.95rem]' : ''} `}>
                    {/* Cover image */}
                    <div className={`h-[14rem] w-full relative`}>
                        {
                            (!isLoading && userInfo?.user_info.cover) &&
                                <img
                                    src={`${baseUrl}/storage/${userInfo?.user_info.cover}`}
                                    alt="cover"
                                    className={`w-full object-cover max-h-[14rem]`}
                                />
                        }
                        {
                            (!isLoading && !userInfo?.user_info.cover) &&
                            <div className={`w-full h-full bg-[#333639]`}></div>
                        }
                        {isLoading &&
                            <div
                                className="absolute animate-pulse flex items-center justify-center w-full h-full  bg-[#333639]">
                                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path
                                        d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                                </svg>
                            </div>}
                    </div>
                    {/* Personal Info */}
                    <div className={`relative`}>
                        <div className={`px-4 h-[16rem]`}>
                            <div className={`flex justify-between`}>
                                <div className={`relative -translate-y-1/2 w-[9rem] h-[9rem] rounded-full border-4 border-black`}>
                                    <img src={`${baseUrl}/storage/${userInfo?.user_info.avatar}`} alt=""
                                         className={`object-cover w-full h-full rounded-full ${isLoading ? 'invisible' : ''}`}/>
                                    {(isLoading || !userInfo?.user_info.avatar) &&
                                        <div
                                            className={`absolute animate-pulse top-0 flex items-center justify-center w-full h-full rounded-full bg-[#2a2d32b3]`}>
                                            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path
                                                    d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                                            </svg>
                                        </div>}
                                </div>

                                {(username === user?.user_info?.username && !isLoading) &&
                                    <button
                                        onClick={toggleModel}
                                        className={` px-6 py-2 border border-gray-600 rounded-full h-fit mt-4 hover:bg-neutral-700/30 font-semibold`}>Edit profile
                                    </button>
                                }
                                {(username !== user?.user_info?.username && !isLoading) &&
                                    <button
                                        disabled={isFollowedBtnDisabled}
                                        onClick={handleFollow}
                                        className={`${isFollowed ? 'bg-[#2a3139] text-neutral-200 hover:bg-[#323b45]' : 'bg-neutral-100 hover:bg-gray-200'} z-50 text-black mt-4 px-6 max-h-10 transition font-semibold flex justify-center items-center rounded-full cursor-pointer`}>{isFollowed ? 'Following' : 'Follow'}
                                    </button>
                                }
                                {isLoading &&
                                    <div className="h-[50px] mt-4 bg-[#2a2d32b3] animate-pulse rounded-full w-40"></div>
                                }
                            </div>
                            <div className={`-translate-y-12`}>
                                <h1 className={`font-semibold text-xl`}>
                                    {userInfo?.user_info.display_name && !isLoading ? userInfo.user_info.display_name : !isLoading && userInfo?.user_info.username ? userInfo.user_info.username : ''}
                                    {isLoading &&
                                        <div className="h-[25px] bg-[#2a2d32b3] animate-pulse rounded-full w-48"></div>
                                    }
                                </h1>
                                {!isLoading && <h1 className={`text-[#71767b]`}>@{userInfo?.user_info.username}</h1>}
                                {isLoading && <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-40 mt-1"></div>}

                                {(!isLoading && userInfo?.user_info.bio) && <div className={`font-semibold mt-3`}>{userInfo.user_info.bio}</div>}
                                {isLoading && <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-96 mt-4"></div>}

                                {!isLoading && <div className={`text-[#71767b] flex gap-x-2 items-center mt-4`}>
                                    <CgCalendarDates/>
                                    <span>Joined</span>
                                    <div>{userInfo?.user_info.created_at}</div>
                                </div>}
                                {isLoading &&
                                    <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-52 mt-6"></div>
                                }

                                {!isLoading &&
                                    <div className={`text-[#71767b] flex gap-x-6 mt-3`}>
                                        <div className={`flex gap-x-1`}>
                                            <span className={`text-neutral-200`}>{userInfo?.user_info.following_number}</span>
                                            Following
                                        </div>
                                        <div className={`flex gap-x-1`}>
                                            <span className={`text-neutral-200`}>{userInfo?.user_info.followers_number}</span>
                                            Followers
                                        </div>
                                    </div>
                                }
                                {isLoading &&
                                    <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-52 mt-6"></div>
                                }
                            </div>
                        </div>

                        {/* Buttons section */}
                        <ul className={`w-full flex border-b border-zinc-700/70 text-[#71767b] mt-10`}>
                            <li
                                onClick={() => {
                                    setAllProfileUserTweets([])
                                    getSuitableTweets(`/users/${username}`)
                                }}
                                ref={postsRef}
                                className={`relative hover:bg-neutral-700/30 sm:px-8 px-6 pt-3 cursor-pointer transition ${isActive.posts ? 'text-neutral-200 font-semibold ' : ''}`}
                            >
                                <div className={`${isActive.posts ? 'border-b-2 border-sky-500' : ''}  pb-4 px-3`}>Posts</div>
                            </li>
                            <li
                                onClick={() => {
                                    setAllProfileUserTweets([])
                                    getSuitableTweets(`/replies/${username}`)
                                }}
                                ref={repliesRef}
                                className={`relative hover:bg-neutral-700/30 sm:px-8 px-6 pt-3 cursor-pointer transition ${isActive.replies ? 'text-neutral-200 font-semibold ' : ''}`}
                            >
                                <div className={`${isActive.replies ? 'border-b-2 border-sky-500' : ''} pb-4 px-3`}>Replies</div>
                            </li>

                            <li
                                onClick={() => {
                                    setAllProfileUserTweets([])
                                    getSuitableTweets(`/likes/${username}`)
                                }}
                                ref={likesRef}
                                className={`relative hover:bg-neutral-700/30 sm:px-8 px-6 pt-3 cursor-pointer transition ${isActive.likes ? 'text-neutral-200 font-semibold ' : ''}`}
                            >
                                <div className={`${isActive.likes ? 'border-b-2 border-sky-500' : ''} pb-4 px-3`}>Likes</div>
                            </li>
                        </ul>
                    </div>

                    {/* All user tweets */}
                    {isLoading && <SpinLoader/>}
                    {!isLoading && tweets}
                    <div className={`invisible opacity-0 pointer-events-none`} ref={lastTweetRef}>
                        {allProfileUserTweets.length > 0 && (
                            <Tweet
                                {...allProfileUserTweets[allProfileUserTweets.length]}
                                setAllProfileUserTweets={setAllProfileUserTweets}
                                allProfileUserTweets={allProfileUserTweets}
                            />
                        )}
                    </div>

                </div>

            </div>
            <Model />
        </div>
    )
}

export default Profile
