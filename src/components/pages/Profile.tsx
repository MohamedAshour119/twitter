import {LuArrowBigUp} from "react-icons/lu";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import TweetModel from "../layouts/TweetModel.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {RiArrowLeftLine} from "react-icons/ri";
import {Link, useParams} from "react-router-dom";
import {CgCalendarDates} from "react-icons/cg";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {TweetInfo, UserInfo} from "../../Interfaces.tsx";


function Profile() {

    const {username} = useParams();
    const {user, isModelOpen,baseUrl, location} = useContext(AppContext)

    const [isFollowed, setIsFollowed] = useState<boolean>()
    const [isFollowedBtnDisabled, setIsFollowedBtnDisabled] = useState(false)
    const [pageURL, setPageURL] = useState('')
    const [isActive, setIsActive] = useState({
        posts: true,
        replies: false,
        likes: false,
    })
    const [allProfileUserTweets, setAllProfileUserTweets] = useState<TweetInfo[]>([])
    const [userInfo, setUserInfo] = useState<UserInfo>()

    // Reset allProfileUserTweets state when username changes
    useEffect(() => {
        setAllProfileUserTweets([]);
    }, [location?.pathname, username]);
    
    // Get all user tweets
    const getAllUserTweets = (pageURL: string) => {
        ApiClient().get(pageURL)
            .then(res => {
                const tweets = res.data.data.pagination.data
                if(tweets){
                    setAllProfileUserTweets(prevTweets => ([...prevTweets, ...tweets]))
                }
                setUserInfo(res.data.data.user)
                setPageURL(res.data.data.pagination.next_page_url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect( () => {
        // setAllProfileUserTweets([]);
        setPageURL('');
        getAllUserTweets(`users/${username}`)
    }, [username] )

    // All User Tweets
    const tweets: React.ReactNode = allProfileUserTweets?.map((tweetInfo) => (
        <Tweet
            key={tweetInfo.id}
            {...tweetInfo}
        />
    ));


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
    const handleFollow = () => {
        setIsFollowedBtnDisabled(true)

        if(!isFollowed){
            ApiClient().post(`/${userInfo?.id}/follow`)
                .then(() => {
                    setIsFollowed(true)
                    setIsFollowedBtnDisabled(false);
                })
                .catch(error => {
                    console.error('Follow request failed:', error);
                    setIsFollowedBtnDisabled(false);
                });
        } else {

            ApiClient().post(`/${userInfo?.id}/unfollow`)
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
        if (userInfo?.is_followed != null) {
            setIsFollowed(userInfo.is_followed)
        }
    }, [userInfo] )

    // Detect when scroll to last element
    const lastTweetRef = useRef<HTMLDivElement>(null)
    useEffect( () => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting) {
                getAllUserTweets(pageURL)
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

    return (
        <div className={`${isModelOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-svh flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header className={`flex gap-x-8 py-1 px-4 items-center text-neutral-200 bg-black/50 backdrop-blur-sm`}>
                    <Link to={'/home'} className={`w-[7%] hover:bg-neutral-600/30 flex justify-center items-center py-2 rounded-full transition cursor-pointer`}>
                        <RiArrowLeftLine className={`size-5`}/>
                    </Link>
                    <div className={`w-full`}>
                        <h1 className={`font-semibold text-xl`}>
                            {userInfo?.username}
                            {!userInfo &&
                                <div className="h-[25px] bg-[#2a2d32b3] animate-pulse rounded-full w-48"></div>
                            }
                        </h1>
                        {userInfo && <div
                            className={`text-[#71767b] text-sm`}>{userInfo.tweets_count && userInfo.tweets_count <= 1 ? `${userInfo.tweets_count} post` : `${userInfo.tweets_count} posts`}</div>
                        }
                        {!userInfo &&
                            <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-28 mt-1"></div>
                        }
                    </div>
                </header>
                <div></div>
            </div>

            <div className={`${isModelOpen ? 'opacity-20 pointer-events-none' : 'z-50'} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr] grid-cols-1`}>

                {/* Scroll to top button */}
                <div className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>
                {/* Middle section */}
                <div className={`text-neutral-200 border-r border-l border-zinc-700/70 animate-slide-down`}>
                    <div className={`h-14 bg-black z-10`}></div>
                    {/* Cover image */}
                    <div className={`h-[14rem] w-full bg-[#333639]`}></div>
                    {/* Personal Info */}
                    <div className={`relative`}>
                        <div className={`px-4 h-[16rem]`}>
                            <div className={`flex justify-between`}>
                                <div className={`relative -translate-y-1/2 w-[9rem] h-[9rem] rounded-full border-4 border-black ${!userInfo ? 'animate-pulse' : ''}`}>
                                    <img src={`${baseUrl}/storage/${userInfo?.avatar}`} alt=""
                                         className={`object-cover w-full h-full rounded-full ${!userInfo ? 'invisible' : ''}`}/>
                                    {!userInfo &&
                                        <div
                                            className="absolute top-0 flex items-center justify-center w-full h-full rounded-full bg-[#2a2d32b3]">
                                            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path
                                                    d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                                            </svg>
                                        </div>}
                                </div>

                                {(username === user?.username && userInfo) &&
                                    <Link to={'/home'}
                                       className={` px-6 py-2 border border-gray-600 rounded-full h-fit mt-4 hover:bg-neutral-700/30 font-semibold`}>Edit profile</Link>
                                }
                                {(username === user?.username || !userInfo) ||
                                    <button
                                        disabled={isFollowedBtnDisabled}
                                        onClick={handleFollow}
                                        className={`${isFollowed ? 'bg-[#2a3139] text-neutral-200 hover:bg-[#323b45]' : 'bg-neutral-100 hover:bg-gray-200'} z-50 text-black mt-4 px-6 max-h-10 transition font-semibold flex justify-center items-center rounded-full cursor-pointer`}>{isFollowed ? 'Following' : 'Follow'}
                                    </button>
                                }
                                {!userInfo &&
                                    <div className="h-[50px] mt-4 bg-[#2a2d32b3] animate-pulse rounded-full w-40"></div>
                                }
                            </div>
                            <div className={`-translate-y-12`}>
                                <h1 className={`font-semibold text-xl`}>
                                    {userInfo?.username}
                                    {!userInfo &&
                                        <div className="h-[25px] bg-[#2a2d32b3] animate-pulse rounded-full w-48"></div>
                                    }
                                </h1>
                                {userInfo && <h1 className={`text-[#71767b]`}>
                                    @{userInfo?.username}
                                </h1>}
                                {!userInfo &&
                                    <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-40 mt-1"></div>
                                }

                                {userInfo && <div className={`text-[#71767b] flex gap-x-2 items-center mt-4`}>
                                    <CgCalendarDates/>
                                    <span>Joined</span>
                                    <div>{userInfo.created_at}</div>
                                </div>}
                                {!userInfo &&
                                    <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-52 mt-6"></div>
                                }

                                {userInfo && <div className={`text-[#71767b] flex gap-x-6 mt-3`}>
                                    <div className={`flex gap-x-1`}>
                                        <span className={`text-neutral-200`}>{userInfo?.following_number}</span>
                                        Following
                                    </div>
                                    <div className={`flex gap-x-1`}>
                                        <span className={`text-neutral-200`}>{userInfo?.followers_number}</span>
                                        Followers
                                    </div>
                                </div>}
                                {!userInfo &&
                                    <div className="h-[16px] bg-[#2a2d32b3] animate-pulse rounded-full w-52 mt-6"></div>
                                }
                            </div>
                        </div>

                        {/* Buttons section */}
                        <ul className={`w-full flex border-b border-zinc-700/70 text-[#71767b]`}>
                            <li ref={postsRef} className={`hover:bg-neutral-700/30 sm:px-12 px-8 py-4 cursor-pointer transition ${isActive.posts ? 'text-neutral-200 font-semibold' : ''}`}>Posts</li>
                            <li ref={repliesRef} className={`hover:bg-neutral-700/30 sm:px-12 px-8 py-4 cursor-pointer transition ${isActive.replies ? 'text-neutral-200 font-semibold' : ''}`}>Replies</li>
                            <li ref={likesRef} className={`hover:bg-neutral-700/30 sm:px-12 px-8 py-4 cursor-pointer transition ${isActive.likes ? 'text-neutral-200 font-semibold' : ''}`}>Likes</li>
                        </ul>
                    </div>

                    {/* All user tweets */}
                    {tweets}
                    <div className={`invisible opacity-0 pointer-events-none`} ref={lastTweetRef}>
                        {allProfileUserTweets.length > 0 && (
                            <Tweet {...allProfileUserTweets[allProfileUserTweets.length]} />
                        )}
                    </div>

                </div>

                <TrendingSidebar/>
            </div>
            <TweetModel />
        </div>
    )
}

export default Profile
