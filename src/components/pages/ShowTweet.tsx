import {FaXTwitter} from "react-icons/fa6";
import {IoSettingsOutline} from "react-icons/io5";
import Model from "../layouts/Model.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {useParams} from "react-router-dom";
import ApiClient from "../ApiClient.tsx";
import {RiArrowLeftLine} from "react-icons/ri";
import {TweetInfo} from "../../Interfaces.tsx";
import Tweet from "../layouts/Tweet.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import SpinLoader from "../helper/SpinLoader.tsx";

function ShowTweet() {
    const {
        isModalOpen,
        user,
        isCommentOpen,
        goBack,
        setClickedTweet,
    } = useContext(AppContext)
    const {
        comments,
        setComments,
        tweets,
        setShowTweet,
        setSlug,
    } = useContext(TweetContext)
    const {slug} = useParams()

    const [displayTweet, setDisplayTweet] = useState<TweetInfo>()
    const [pageURL, setPageURL] = useState('')
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const showTweetPageRef = useRef<HTMLDivElement>(null)
    const [headerWidth, setHeaderWidth] = useState(showTweetPageRef.current?.getBoundingClientRect().width);

    useEffect(() => {
        setComments([])
    }, []);

    const getTweet = () => {
        setIsLoading(true)
        ApiClient().get(`/tweets/${slug}`)
            .then(res => {
                setShowTweet(res.data.data.tweet)
                setClickedTweet(res.data.data.tweet)
                setDisplayTweet(res.data.data.tweet)
                setComments(res.data.data.pagination.data)
                setPageURL(res.data.data.pagination.next_page_url)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    useEffect( () => {
        getTweet()
    }, [slug, tweets])

    useEffect(() => {
        if (slug) {
            setSlug(slug)
        }
    }, [slug]);

    const getComments = (pageURL: string) => {
        setIsFetching(true)
        ApiClient().get(pageURL)
            .then(res => {
                setComments(prevComments => ([
                    ...prevComments,
                    ...res.data.data.pagination.data,
                ]))
                setPageURL(res.data.data.pagination.next_page_url)
            })
            .finally(() => setIsFetching(false))
    }

    // Detect when scroll to last element
    const lastCommentRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isFetching && pageURL) {
                getComments(pageURL)
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        if (lastCommentRef.current) {
            observer.observe(lastCommentRef.current)
        }

        // Cleanup
        return () => {
            if (lastCommentRef.current) {
                observer.unobserve(lastCommentRef.current);
            }
        };
    }, [pageURL, isFetching])

    // Delete comment
    const displayComments = comments?.map((comment, index) => {
        return (
            <Tweet
                key={index}
                {...comment}
                ref={index === comments.length - 1 ? lastCommentRef : null}
            />
        )
    })

    useEffect(() => {
        const updateWidth = () => {
            if (showTweetPageRef.current) {
                const newWidth = showTweetPageRef.current.getBoundingClientRect().width;
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
            ref={showTweetPageRef}
            className={`min-h-svh border border-y-0 border-zinc-700/70 ${isCommentOpen || isModalOpen ? 'overflow-y-hidden' : ''} `}>
            <header
                style={{ width: `${headerWidth && headerWidth - 2.1}px` }}
                className={`fixed z-[200] grid grid-cols-1 ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none ' : 'backdrop-blur-sm'} border border-x-0 border-zinc-700/70`}>
                {/* Header but only on small screens */}
                <div className={`flex sm:hidden justify-between px-6 py-5 pb-1`}>
                    <img className={`size-11 rounded-full object-cover`}
                         src={user?.user_info.avatar}
                         alt="avatar"
                    />
                    <FaXTwitter className={`size-9`}/>
                    <IoSettingsOutline className={`size-9`}/>
                </div>
                {/* Header for the rest of screens */}
                <div className={`flex items-center gap-x-7 px-4 w-full text-neutral-200 z-[100] cursor-pointer`}>
                    <div onClick={goBack} className={`hover:bg-[#0a0c0e] flex justify-center items-center p-2 rounded-full transition cursor-pointer`}>
                        <RiArrowLeftLine className={`size-5`}/>
                    </div>
                    <div className={`py-4 text-xl font-semibold`}>Post</div>
                </div>
            </header>
                {/* Middle content */}
                <div className={`${isCommentOpen || isModalOpen ? 'opacity-20 pointer-events-none' : ''} mt-16 text-neutral-200 w-full relative`}>
                    {displayTweet &&
                        <Tweet {...displayTweet!}/>
                    }
                    {displayComments}
                </div>
                {isLoading &&
                    <SpinLoader styles={`translate-y-40 sm:translate-y-32`}/>
                }

            {/* Tweet model  */}
            <Model/>
        </div>

    )
}

export default ShowTweet
