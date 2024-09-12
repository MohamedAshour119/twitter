import Model from "../layouts/Model.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../ApiClient.tsx";
import {useParams} from "react-router-dom";
import {TweetInfo} from "../../Interfaces.tsx";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";
import {RiArrowLeftLine} from "react-icons/ri";
import SpinLoader from "../helper/SpinLoader.tsx";

function HashtagTweets() {

    const {
        isModalOpen,
        isCommentOpen,
        goBack,
    } = useContext(AppContext)
    const { hashtag } = useParams()

    const hashtagTweetsPageRef = useRef<HTMLDivElement>(null)
    const [hashtagsTweets, setHashtagsTweets] = useState<TweetInfo[]>([])
    const [hashtagsTweetsNextPageUrl, setHashtagsTweetsNextPageUrl] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [headerWidth, setHeaderWidth] = useState(hashtagTweetsPageRef.current?.getBoundingClientRect().width);

    const getHashtagTweets = (pageUrl: string) => {
        setIsLoading(true)
        setIsFetching(true)
        ApiClient().get(`${pageUrl}`)
            .then(res => {
                setHashtagsTweets(prevState => ([
                    ...prevState,
                    ...res.data.data.tweets
                ]))
                setHashtagsTweetsNextPageUrl(res.data.data.next_page_url)
            })
            .catch(() => {

            })
            .finally(() => {
                setIsFetching(false)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        setHashtagsTweets([])
        if (hashtag) {
            getHashtagTweets(hashtag)
        }
    }, [hashtag]);

    const lastTweetRef = useRef(null)
    useEffect(() => {
        if (!lastTweetRef.current) return;  // Exit if the ref is null

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isFetching && hashtagsTweetsNextPageUrl) {
                getHashtagTweets(hashtagsTweetsNextPageUrl);
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
    }, [hashtagsTweetsNextPageUrl, isFetching]);

    const displayHashtagsTweets: React.ReactNode = hashtagsTweets?.map((tweetInfo, index) => (
        <Tweet
            key={index}
            {...tweetInfo}
            setHashtagsTweets={setHashtagsTweets}
            hashtagsTweets={hashtagsTweets}
            ref={index === hashtagsTweets.length - 1 ? lastTweetRef : null}
        />
    ));

    useEffect(() => {
        const updateWidth = () => {
            if (hashtagTweetsPageRef.current) {
                const newWidth = hashtagTweetsPageRef.current.getBoundingClientRect().width;
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
            ref={hashtagTweetsPageRef}
            className={`border border-t-0 border-zinc-700/70 min-h-svh`}>
            <header
                style={{ width: `${headerWidth && headerWidth - 2.1}px` }}
                className={`fixed z-[200] grid grid-cols-1 ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none ' : 'backdrop-blur-sm'} border border-x-0 border-zinc-700/70`}>
                <div className={`flex items-center gap-x-3 font-semibold text-xl px-4 py-2 text-white`}>
                    <div onClick={goBack} className={`hover:bg-[#0a0c0e] flex justify-center items-center p-2 rounded-full transition cursor-pointer`}>
                        <RiArrowLeftLine className={`size-5`}/>
                    </div>
                    <div className={`w-full`}>Tweets</div>
                </div>
            </header>

            <div className={`${(isModalOpen || isCommentOpen) ? 'opacity-20 pointer-events-none ' : ''} mt-14`}>

                {/* Middle content */}
                <div
                    className={`text-neutral-200 w-full relative`}>

                    {/*  All Hashtags  */}
                    <div className={`pb-4`}>
                        {displayHashtagsTweets}
                        {isLoading && <SpinLoader styles={`${!hashtagsTweetsNextPageUrl ? 'translate-y-20' : 'mt-4'}`}/>}
                    </div>

                </div>
            </div>

            {/* Tweet model  */}
            <Model/>
        </div>
    )
}

export default HashtagTweets
