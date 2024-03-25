import Sidebar from "../partials/Sidebar.tsx";
import {FaXTwitter} from "react-icons/fa6";
import {useContext, useEffect, useRef, useState} from "react";
import Tweet from "../layouts/Tweet.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import {LuArrowBigUp} from "react-icons/lu";
import * as React from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import TweetModel from "../layouts/TweetModel.tsx";
import apiClient from "../services/ApiClient.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import TweetTextAreaAndPreview from "../layouts/TweetTextAreaAndPreview.tsx";

interface Tweet {
    title: string
    image: string | File | null | undefined
    video: string | File | null | undefined
}

function UserHomePage() {
    const {
        user,
        baseUrl,
        isModelOpen,
        isCommentOpen,
    } = useContext(AppContext);

    const {
        randomTweets,
        setRandomTweets,
    } = useContext(TweetContext)


    const [pageURL, setPageURL] = useState('')


    // Fetch random tweets
    const getHomeTweets = (pageURL: string) => {
        apiClient().get(pageURL)
            .then(res => {
                setPageURL(res.data.data.pagination.next_page_url)
                setRandomTweets(prevRandomTweets => ([
                    ...prevRandomTweets,
                    ...res.data.data.tweets,
                ]))
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getHomeTweets('home-tweets')
    }, [])


    // Detect when scroll to last element
    const lastTweetRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                getHomeTweets(pageURL)
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


    return (
        <div
            className={`${(isModelOpen || isCommentOpen) ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-screen flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header
                    className={`w-full grid grid-cols-1 border ${isModelOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70 2xl:max-w-[39rem] xl:max-w-[34rem] lg:max-w-[34rem] md:max-w-[40.34rem] sm:max-w-[32rem] xs:max-w-[31.30rem] xxs:max-w-[28rem] backdrop-blur-sm`}>
                    {/* Header but only on small screens */}
                    <div className={`flex sm:hidden justify-between px-6 py-5 pb-1 text-neutral-200`}>
                        <img className={`size-11 rounded-full object-cover`}
                             src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>
                        <FaXTwitter className={`size-9`}/>
                        <IoSettingsOutline className={`size-9`}/>
                    </div>
                    {/* Header for the rest of screens */}
                    <div className={`w-full text-neutral-200 z-[100]`}>
                        <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>For you</button>
                        <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>Following</button>
                    </div>
                </header>
                <div></div>
            </div>

            <div
                className={`${(isModelOpen || isCommentOpen) ? 'opacity-20 pointer-events-none' : 'z-[150]'} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Scroll to top button */}
                <div
                    className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                {/* Middle content */}
                <div
                    className={`z-[200] text-neutral-200 border border-t-0 border-zinc-700/70 w-full relative`}>
                    <TweetTextAreaAndPreview/>

                    {/*  All Tweets  */}
                    <div>
                        {displayRandomTweets}
                        <div ref={lastTweetRef}>
                            {randomTweets.length > 0 && (
                                <Tweet {...randomTweets[randomTweets.length - 1]} />
                            )}
                        </div>
                    </div>

                </div>

                <TrendingSidebar/>

            </div>

            {/* Tweet model  */}
            <TweetModel/>
        </div>
    )
}

export default UserHomePage
