import {FaXTwitter} from "react-icons/fa6";
import {IoSettingsOutline} from "react-icons/io5";
import {LuArrowBigUp} from "react-icons/lu";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import Model from "../layouts/Model.tsx";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {useParams} from "react-router-dom";
import {TweetInfo} from "../../Interfaces.tsx";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";

function HashtagTweets() {

    const {
        isModelOpen,
        isCommentOpen,
        baseUrl,
        user,
    } = useContext(AppContext)

    const { hashtag } = useParams()

    const [hashtagsTweets, setHashtagsTweets] = useState<TweetInfo[]>([])

    useEffect(() => {
        ApiClient().get(`/${hashtag}`)
            .then(res => {
                setHashtagsTweets(res.data.data)
            })
            .catch(() => {

            })
    }, [hashtag]);

    const displayHashtagsTweets: React.ReactNode = hashtagsTweets?.map(tweetInfo => (
        <Tweet
            key={tweetInfo.id}
            {...tweetInfo}
        />
    ));

    return (
        <div
            className={`${(isModelOpen || isCommentOpen) ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-screen flex justify-center overflow-x-hidden`}>

            <div className={`z-[200] container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header
                    className={`w-full grid grid-cols-1 border ${isModelOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70 2xl:max-w-[43rem] xl:max-w-[34rem] lg:max-w-[34rem] md:max-w-[40.34rem] sm:max-w-[32rem] xs:max-w-[31.30rem] xxs:max-w-[28rem] backdrop-blur-sm`}>
                    {/* Header but only on small screens */}
                    <div className={`flex sm:hidden justify-between px-6 py-5 pb-1 text-neutral-200`}>
                        <img className={`size-11 rounded-full object-cover`}
                             src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>
                        <FaXTwitter className={`size-9`}/>
                        <IoSettingsOutline className={`size-9`}/>
                    </div>
                    {/* Header for the rest of screens */}
                    <div className={`w-full text-neutral-200`}>
                        <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>For you</button>
                        <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>Following</button>
                    </div>
                </header>
                <div></div>
            </div>

            <div
                className={`${(isModelOpen || isCommentOpen) ? 'opacity-20 pointer-events-none mt-16' : ''} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Scroll to top button */}
                <div
                    className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                {/* Middle content */}
                <div
                    className={`text-neutral-200 mt-14 border border-t-0 border-zinc-700/70 w-full relative`}>

                    {/*  All Tweets  */}
                    <div>
                        {displayHashtagsTweets}
                        {/*<div ref={lastTweetRef}>*/}
                        {/*    {randomTweets.length > 0 && (*/}
                        {/*        <Tweet {...randomTweets[randomTweets.length - 1]} />*/}
                        {/*    )}*/}
                        {/*</div>*/}
                    </div>

                </div>

                <TrendingSidebar/>

            </div>

            {/* Tweet model  */}
            <Model/>
        </div>
    )
}

export default HashtagTweets
