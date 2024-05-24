import {FaXTwitter} from "react-icons/fa6";
import {useContext, useEffect, useRef, useState} from "react";
import Tweet from "../layouts/Tweet.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import * as React from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import Model from "../layouts/Model.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import TweetTextAreaAndPreview from "../layouts/TweetTextAreaAndPreview.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {CgSmileSad} from "react-icons/cg";
import {Link} from "react-router-dom";
import SpinLoader from "../helper/SpinLoader.tsx";

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
        <div className={`${(isModalOpen || isCommentOpen) ? 'bg-[#1d252d]' : 'bg-black'} border border-t-0 border-zinc-700/70 min-h-svh`}>
         <header className={`w-full fixed z-[200] grid grid-cols-1 border ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none ' : 'backdrop-blur-sm'} border-zinc-700/70 3xl:max-w-[42.9rem] 2xl:max-w-[38.54rem] xl:max-w-[31.65rem] lg:max-w-[31.58rem] md:max-w-[37.64rem] sm:max-w-[29.95rem] xs:max-w-[31.16rem] xxs:max-w-[27.77rem] `}>
                {/* Header but only on small screens */}
                <div className={`flex sm:hidden justify-between px-6 py-5 pb-1 text-neutral-200`}>
                    <Link to={`/users/${user?.user_info?.username}`}>
                        <img className={`size-11 rounded-full object-cover`} src={`${baseUrl}/storage/${user?.user_info?.avatar}`} alt=""/>
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

            <div
                className={`${(isModalOpen || isCommentOpen) ? 'opacity-20 pointer-events-none mt-16' : ''} `}>
                {/* Middle content */}
                <div
                    className={`text-neutral-200 w-full relative`}>

                    {randomTweets.length > 0 ||
                        <SpinLoader/>
                    }

                    {randomTweets.length > 0 && <TweetTextAreaAndPreview/>}

                    {/*  All Tweets  */}
                    <div className={`${randomTweets.length > 0 ? 'pb-[4.5rem]' : ''} `}>
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
            </div>
            {/* Tweet model  */}
            <Model/>
        </div>
    )
}

export default UserHomePage
