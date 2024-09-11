import {FaXTwitter} from "react-icons/fa6";
import {IoSettingsOutline} from "react-icons/io5";
import Model from "../layouts/Model.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../ApiClient.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {TweetInfo} from "../../Interfaces.tsx";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";

function HashtagTweets() {

    const {
        isModalOpen,
        isCommentOpen,
        user,
    } = useContext(AppContext)
    const navigate = useNavigate()
    const { hashtag } = useParams()

    const hashtagTWeetsPageRef = useRef<HTMLDivElement>(null)
    const [hashtagsTweets, setHashtagsTweets] = useState<TweetInfo[]>([])
    const [headerWidth, setHeaderWidth] = useState(hashtagTWeetsPageRef.current?.getBoundingClientRect().width);

    useEffect(() => {
        ApiClient().get(`/${hashtag}`)
            .then(res => {
                setHashtagsTweets(res.data.data)
                navigate('/home')
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

    useEffect(() => {
        const updateWidth = () => {
            if (hashtagTWeetsPageRef.current) {
                const newWidth = hashtagTWeetsPageRef.current.getBoundingClientRect().width;
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
        <div
            ref={hashtagTWeetsPageRef}
            className={`border border-t-0 border-zinc-700/70 min-h-svh`}>
            <header
                style={{ width: `${headerWidth && headerWidth - 2.1}px` }}
                className={`w-full grid grid-cols-1 border ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70`}>
                {/* Header but only on small screens */}
                <div className={`flex sm:hidden justify-between px-6 py-5 pb-1 text-neutral-200`}>
                    <img className={`size-11 rounded-full object-cover`}
                         src={user?.user_info.avatar}
                         alt="avatar"
                    />
                    <FaXTwitter className={`size-9`}/>
                    <IoSettingsOutline className={`size-9`}/>
                </div>
                {/* Header for the rest of screens */}
                <div className={`w-full text-neutral-200`}>
                    <button className={`hover:bg-[#0a0c0e] py-4 w-1/2 transition`}>For you</button>
                    <button className={`hover:bg-[#0a0c0e] py-4 w-1/2 transition`}>Following</button>
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
