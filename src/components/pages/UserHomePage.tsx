import Sidebar from "../partials/Sidebar.tsx";
import {FaXTwitter} from "react-icons/fa6";
import {useContext, useEffect, useRef, useState} from "react";
import Tweet from "../layouts/Tweet.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import * as React from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import Model from "../layouts/Model.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import TweetTextAreaAndPreview from "../layouts/TweetTextAreaAndPreview.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {CgSmileSad} from "react-icons/cg";
import {Link} from "react-router-dom";

interface Tweet {
    title: string
    image: string | File | null | undefined
    video: string | File | null | undefined
}

function UserHomePage() {
    const {
        user,
        baseUrl,
        isModalOpen,
        isCommentOpen,
    } = useContext(AppContext);

    const {
        randomTweets,
        setRandomTweets,
    } = useContext(TweetContext)

    const [pageURL, setPageURL] = useState('')
    const [displayNotFoundMsg, setDisplayNotFoundMsg] = useState(false);
    const [isActive, setIsActive] = useState({
        forYou: true,
        following: false,
    })

    // const parentRef = useRef<HTMLDivElement>(null)
    // Fetch random tweets

    const getHomeTweets = (pageURL: string) => {
        ApiClient().get(pageURL)
            .then(res => {
                setPageURL(res.data.data.pagination.next_page_url)
                setRandomTweets(prevRandomTweets => ([
                    ...prevRandomTweets,
                    ...res.data.data.tweets,
                ]))
                res.data.data.tweets.length === 0 ? setDisplayNotFoundMsg(true) : ''
                // parentRef.current && parentRef.current?.classList.remove('h-svh')
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        setRandomTweets([])
        getHomeTweets('home-tweets')
    }, [])


    // Detect when scroll to last element
    const lastTweetRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isActive.following) {
                getHomeTweets(pageURL)
            }
            if (entries[0].isIntersecting && isActive.following) {
                followUsersTweets(pageURL)
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        if (lastTweetRef.current) {
            observer.observe(lastTweetRef.current)
        }

        // Cleanup
        return () => {
            if (lastTweetRef.current) {
                observer.unobserve(lastTweetRef.current);
            }
        };
    }, [pageURL])

    // Display random tweets
    const displayRandomTweets: React.ReactNode = randomTweets?.slice(0, randomTweets.length - 1).map(tweetInfo => (
        <Tweet
            key={tweetInfo.id}
            {...tweetInfo}
        />
    ));

    const followUsersTweets = (pageUrl: string) => {
        setPageURL('')
        ApiClient().post(pageUrl)
            .then(res => {
                setRandomTweets(prevFollowedUsersTweets => ([
                    ...prevFollowedUsersTweets,
                    ...res.data.data.followed_users_tweets
                ]))
                setPageURL(res.data.data.pagination)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleFollowingBtnClick = () => {
        setIsActive({
            forYou: false,
            following: true,
        })
    }

    const handleForYouBtnClick = () => {
        setIsActive({
            forYou: true,
            following: false,
        })
    }

    if(isModalOpen || isCommentOpen) {
        document.body.style.backgroundColor = '#1d252d'
    } else {
        document.body.style.backgroundColor = 'black'
    }

    useEffect(() => {
        const bodyEl = document.body;
        if (isModalOpen || isCommentOpen) {
            bodyEl.style.overflow = 'hidden';
        } else {
            bodyEl.style.overflow = 'auto';
        }
    }, [isModalOpen, isCommentOpen]);

    return (
        <div
            // ref={parentRef}
            className={`${(isModalOpen || isCommentOpen) ? 'bg-[#1d252d]' : 'bg-black'} h-svh w-screen flex justify-center`}>

            <div className={`z-[200] container fixed 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr] grid-cols-1`}>
                <div></div>
                <header
                    className={`w-full grid grid-cols-1 border ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none ' : 'backdrop-blur-sm'} border-zinc-700/70 2xl:max-w-[43rem] xl:max-w-[34rem] lg:max-w-[34rem] md:max-w-[40.34rem] sm:max-w-[32rem] xs:max-w-[31.30rem] xxs:max-w-[28rem] `}>
                    {/* Header but only on small screens */}
                    <div className={`flex sm:hidden justify-between px-6 py-5 pb-1 text-neutral-200`}>
                        <Link to={`/users/${user?.username}`}>
                            <img className={`size-11 rounded-full object-cover`} src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>
                        </Link>
                        <Link to={`/home`}>
                            <FaXTwitter className={`size-9`}/>

                        </Link>
                        <IoSettingsOutline className={`size-9`}/>
                    </div>
                    {/* Header for the rest of screens */}
                    <div className={`w-full text-neutral-200`}>
                        <button
                            onClick={() => {
                                handleForYouBtnClick()
                                setRandomTweets([])
                                setPageURL('')
                                getHomeTweets('home-tweets')
                            }}
                            className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>
                            <span className={`${isActive.forYou && 'border-b-2 px-4 border-sky-500 pb-4'}`}>For you</span>
                        </button>
                        <button
                            onClick={() => {
                                handleFollowingBtnClick()
                                setRandomTweets([])
                                followUsersTweets('/followed-users-tweets')
                            }}
                            className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>
                            <span className={`${isActive.following && 'border-b-2 px-4 border-sky-500 pb-4'}`}>Following</span>
                        </button>
                    </div>
                </header>
                <div></div>
            </div>

            <div
                className={`${(isModalOpen || isCommentOpen) ? 'opacity-20 pointer-events-none mt-16' : ''} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                {/* Middle content */}
                <div
                    className={`text-neutral-200 border border-t-0 border-zinc-700/70 w-full relative`}>

                    {randomTweets.length > 0 ||
                        <div role="status" className={`mt-24 flex justify-center`}>
                            <svg aria-hidden="true"
                                 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-sky-500"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    }

                    {randomTweets.length > 0 && <TweetTextAreaAndPreview/>}

                    {/*  All Tweets  */}
                    <div className={`pb-[4.5rem]`}>
                        {displayRandomTweets}
                        <div ref={lastTweetRef}>
                            {randomTweets.length > 0 && (
                                <Tweet {...randomTweets[randomTweets.length - 1]} />
                            )}
                        </div>

                        {displayNotFoundMsg &&
                            <div className={`px-10 py-5 pt-40 flex flex-col gap-y-3 items-center text-3xl `}>
                                No tweets!, come back later
                                <CgSmileSad  className={`size-20 text-sky-500`}/>
                            </div>
                        }

                    </div>

                </div>

                <TrendingSidebar setDisplayNotFoundMsg={setDisplayNotFoundMsg} setPageUrl={setPageURL} />
            </div>
            {/* Tweet model  */}
            <Model/>
        </div>
    )
}

export default UserHomePage
