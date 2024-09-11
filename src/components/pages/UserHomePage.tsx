import {FaXTwitter} from "react-icons/fa6";
import {useContext, useEffect, useRef, useState} from "react";
import Tweet from "../layouts/Tweet.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import * as React from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import Model from "../layouts/Model.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import TweetTextAreaAndPreview from "../layouts/TweetTextAreaAndPreview.tsx";
import ApiClient from "../ApiClient.tsx";
import {CgSmileSad} from "react-icons/cg";
import {Link} from "react-router-dom";
import SpinLoader from "../helper/SpinLoader.tsx";

interface Props {
    pageUrl: string
    notFoundMsg: boolean
    is_loading: boolean
}

function UserHomePage({pageUrl, notFoundMsg, is_loading}: Props) {
    const {
        user,
        isModalOpen,
        isCommentOpen,
    } = useContext(AppContext);

    const {
        tweets,
        setTweets,
    } = useContext(TweetContext)

    const [pageURL, setPageURL] = useState(pageUrl)
    const [displayNotFoundMsg, setDisplayNotFoundMsg] = useState(notFoundMsg);
    const [isActive, setIsActive] = useState({
        forYou: true,
        following: false,
    })

    const userHomePageRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(is_loading)
    const [isFetching, setIsFetching] = useState(false);
    const [headerWidth, setHeaderWidth] = useState(userHomePageRef.current?.getBoundingClientRect().width);


    useEffect(() => {
        setDisplayNotFoundMsg(notFoundMsg);
    }, [notFoundMsg]);

    useEffect(() => {
        setIsLoading(is_loading)
    }, [is_loading]);

    useEffect(() => {
        setPageURL(pageUrl)
    }, [pageUrl]);

    // Fetch random tweets
    const getHomeTweets = (pageURL: string) => {
        setIsLoading(true)
        setIsFetching(true)
        ApiClient().get(pageURL)
            .then(res => {
                setPageURL(res.data.data.pagination.next_page_url)
                setTweets(prevRandomTweets => ([
                    ...prevRandomTweets,
                    ...res.data.data.tweets,
                ]))
                res.data.data.tweets.length === 0 ? setDisplayNotFoundMsg(true) : ''
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
                setIsFetching(false)
            })
    }

    // Detect when scroll to last element
    const lastTweetRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!lastTweetRef.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && isActive.forYou && !isFetching && tweets.length > 0 && pageURL) {
                getHomeTweets(pageURL);
            }
            if (entries[0].isIntersecting && isActive.following) {
                followUsersTweets(pageURL);
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        observer.observe(lastTweetRef.current);

        // Cleanup
        return () => {
            if (lastTweetRef.current) {
                observer.unobserve(lastTweetRef.current);
            }
        };
    }, [pageURL, isFetching, isActive.forYou, isActive.following, tweets]);



    // Display random tweets
    const displayRandomTweets: React.ReactNode = tweets?.map((tweetInfo, index) => (
        <Tweet
            key={tweetInfo.id}
            {...tweetInfo}
            ref={index === tweets.length - 1 ? lastTweetRef : null}
        />
    ));

    const followUsersTweets = (pageUrl: string) => {
        setIsLoading(true)
        setPageURL('')
        ApiClient().post(pageUrl)
            .then(res => {
                setTweets(prevFollowedUsersTweets => ([
                    ...prevFollowedUsersTweets,
                    ...res.data.data.followed_users_tweets
                ]))
                setPageURL(res.data.data.pagination)
                res.data.data.followed_users_tweets.length === 0 ? setDisplayNotFoundMsg(true) : ''
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setIsLoading(false))
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
        const updateWidth = () => {
            if (userHomePageRef.current) {
                const newWidth = userHomePageRef.current.getBoundingClientRect().width;
                setHeaderWidth(newWidth)
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);


    return (
        <div ref={userHomePageRef} className={`border border-t-0 border-zinc-700/70 min-h-svh`}>
         <header
             style={{ width: `${headerWidth && headerWidth - 2.1}px` }}
             className={`fixed z-[200] grid grid-cols-1 ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none ' : 'backdrop-blur-sm'} border border-x-0 border-zinc-700/70`}>
                {/* Header but only on small screens */}
                <div className={`flex sm:hidden justify-between px-2 py-5 pb-1 text-neutral-200`}>
                    <Link to={`/users/${user?.user_info?.username}`}>
                        <img className={`size-11 rounded-full object-cover`}
                             src={user?.user_info?.avatar}
                             alt="avatar"
                        />
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
                            setPageURL('')
                            if (!isActive.forYou) {
                                setTweets([])
                                getHomeTweets('home-tweets')
                            }

                        }}
                        className={`hover:bg-[#0a0c0e] py-4 w-1/2 transition`}>
                        <span className={`${isActive.forYou && 'border-b-2 px-4 border-sky-500 pb-4'}`}>For you</span>
                    </button>
                    <button
                        onClick={() => {
                            handleFollowingBtnClick()
                            if (!isActive.following) {
                                setTweets([])
                                followUsersTweets('/followed-users-tweets')
                            }

                        }}
                        className={`hover:bg-[#0a0c0e] py-4 w-1/2 transition`}>
                        <span className={`${isActive.following && 'border-b-2 px-4 border-sky-500 pb-4'}`}>Following</span>
                    </button>
                </div>
            </header>

            <div
                className={`${(isModalOpen || isCommentOpen) ? 'opacity-20 pointer-events-none mt-16' : ''} `}>
                {/* Middle content */}
                <div
                    className={`text-neutral-200 w-full relative`}>

                    {isLoading &&
                        <SpinLoader styles={`translate-y-40 sm:translate-y-32`}/>
                    }

                    {!isLoading && <TweetTextAreaAndPreview/>}

                    {/*  All Tweets  */}
                    <div className={`${tweets.length > 0 ? 'pb-[4.5rem]' : ''} `}>
                        {displayRandomTweets}

                        {displayNotFoundMsg && tweets.length === 0 && !isLoading &&
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
