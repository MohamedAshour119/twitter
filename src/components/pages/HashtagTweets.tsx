import {FaXTwitter} from "react-icons/fa6";
import {IoSettingsOutline} from "react-icons/io5";
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
        isModalOpen,
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
            className={`border border-t-0 border-zinc-700/70 min-h-svh`}>

            <header
                className={`w-full grid grid-cols-1 border ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70 3xl:max-w-[42.9rem] 2xl:max-w-[38.54rem] xl:max-w-[31.65rem] lg:max-w-[31.58rem] md:max-w-[37.64rem] sm:max-w-[29.95rem] xs:max-w-[31.16rem] xxs:max-w-[27.77rem]`}>
                {/* Header but only on small screens */}
                <div className={`flex sm:hidden justify-between px-6 py-5 pb-1 text-neutral-200`}>
                    <img className={`size-11 rounded-full object-cover`}
                         src={`${baseUrl}/storage/${user?.user_info.avatar}`} alt=""/>
                    <FaXTwitter className={`size-9`}/>
                    <IoSettingsOutline className={`size-9`}/>
                </div>
                {/* Header for the rest of screens */}
                <div className={`w-full text-neutral-200`}>
                    <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>For you</button>
                    <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>Following</button>
                </div>
            </header>

            <div className={`${(isModalOpen || isCommentOpen) ? 'opacity-20 pointer-events-none mt-16' : ''}`}>

                {/* Middle content */}
                <div
                    className={`text-neutral-200 border border-t-0 border-zinc-700/70 w-full relative`}>

                    {/*  All Hashtags  */}
                    <div>
                        {displayHashtagsTweets}
                    </div>

                </div>
            </div>

            {/* Tweet model  */}
            <Model/>
        </div>
    )
}

export default HashtagTweets
