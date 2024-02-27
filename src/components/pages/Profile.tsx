import {LuArrowBigUp} from "react-icons/lu";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import TweetModel from "../layouts/TweetModel.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {RiArrowLeftLine} from "react-icons/ri";
import {Link, useParams} from "react-router-dom";
import {CgCalendarDates} from "react-icons/cg";
import FollowUser from "../layouts/FollowUser.tsx";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";
import ApiClient from "../services/ApiClient.tsx";


interface TweetInfo {
    user: {
        id: number;
        username: string;
        email: string,
        gender: string,
        avatar: string,
        birth_date: string,
        ban_status: number,
        created_at: string,
        updated_at: string,
    };
    new_tweet: {
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
}

interface UserInfo {
    id: number;
    username: string;
    email: string,
    gender: string,
    avatar: string,
    birth_date: string,
    ban_status: number,
    created_at: string,
    updated_at: string,
}

function Profile() {

    const {username} = useParams();
    const {isModelOpen,baseUrl, suggestedUsersToFollow, location} = useContext(AppContext)

    const [isActive, setIsActive] = useState({
        posts: true,
        replies: false,
        likes: false,
    })
    const [allProfileUserTweets, setAllProfileUserTweets] = useState<TweetInfo[]>([])
    const [userInfo, setUserInfo] = useState<UserInfo>()
    // Get all user tweets
    useEffect( () => {
        ApiClient().get(`users/${username}`)
            .then(res => {
                console.log(res.data.data)
                setAllProfileUserTweets(res.data.data.All_user_tweets)
                setUserInfo(res.data.data.user)
            })
            .catch(err => {
                console.log(err)
            })
    }, [username] )

    // Covert created_at to this format: October 2023
    const date = new Date(`${userInfo?.created_at}`);
    const options: Intl.DateTimeFormatOptions = {month: 'long', year: 'numeric'}
    const formatedDate = date.toLocaleDateString('en-US', options);

    // All User Tweets
    const tweets: React.ReactNode = allProfileUserTweets?.map((tweet) => (
        <Tweet key={tweet.new_tweet?.id} {...tweet} />
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

    // Reset posts btn active when the slug change
    useEffect( () => {
        setIsActive(prevIsActive => ({
            ...prevIsActive,
            posts: true,
            replies: false,
            likes: false
        }))
    }, [username])

    return (
        <div className={`${isModelOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-svh flex justify-center overflow-x-hidden`}>
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
                    <header className={`flex gap-x-8 py-1 px-4 items-center`}>
                        <Link to={'/home'} className={`w-[7%] hover:bg-neutral-600/30 flex justify-center items-center py-2 rounded-full transition cursor-pointer`}>
                            <RiArrowLeftLine className={`size-5`}/>
                        </Link>
                        <div className={`w-full`}>
                            <h1 className={`font-semibold text-xl`}>{userInfo?.username}</h1>
                            <div className={`text-[#71767b] text-sm`}>{allProfileUserTweets.length <= 1 ? `${allProfileUserTweets.length} post` : `${allProfileUserTweets.length} posts`}</div>
                        </div>
                    </header>
                    {/* Cover image */}
                    <div className={`h-[14rem] w-full bg-[#333639]`}></div>
                    {/* Personal Info */}
                    <div className={`relative`}>
                        <div className={`px-4`}>
                            <div className={`flex justify-between`}>
                                <img src={`${baseUrl}/storage/${userInfo?.avatar}`} alt="prfile img" className={`-translate-y-1/2 w-[9rem] h-[9rem] rounded-full border-4 border-black object-cover`}/>
                                <Link to={'/home'} className={` px-6 py-2 border border-gray-600 rounded-full h-fit mt-4 hover:bg-neutral-700/30 font-semibold`}>Edit profile</Link>
                            </div>
                            <div className={`-translate-y-12`}>
                                <h1 className={`font-semibold text-xl`}>{userInfo?.username}</h1>
                                <h1 className={`text-[#71767b]`}>@{userInfo?.username}</h1>

                                <div className={`text-[#71767b] flex gap-x-2 items-center mt-4`}>
                                    <CgCalendarDates />
                                    <span>Joined</span>
                                    <div>{formatedDate}</div>
                                </div>

                                <div className={`text-[#71767b] flex gap-x-6 mt-3`}>
                                    <div className={`flex gap-x-1`}>
                                        <span className={`text-neutral-200`}>3</span>
                                        Following
                                    </div>
                                    <div className={`flex gap-x-1`}>
                                        <span className={`text-neutral-200`}>10</span>
                                        Followers
                                    </div>
                                </div>
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

                    {/* Suggested users to follow */}
                    <div className={`border-b border-zinc-700/70`}>
                        {suggestedUsersToFollow?.map(user => (
                            <FollowUser key={user.id} suggestedUsersToFollow={user}/>
                        ))}
                    </div>

                </div>

                <TrendingSidebar/>
            </div>
            <TweetModel />
        </div>
    )
}

export default Profile
