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

function ShowTweet() {
    const {
        isModalOpen,
        baseUrl,
        user,
        isCommentOpen,
        goBack,
        setClickedTweet,
    } = useContext(AppContext)
    const {
        comments,
        setComments,
        randomTweets
    } = useContext(TweetContext)
    const {slug} = useParams();

    console.log(slug)

    const [displayTweet, setDisplayTweet] = useState<TweetInfo>()
    const [pageURL, setPageURL] = useState('')


    const displayTweetFn = () => {
        ApiClient().get(`/tweets/${slug}`)
            .then(res => {
                setClickedTweet(res.data.data.tweet)
                setDisplayTweet(res.data.data.tweet)
                setComments(res.data.data.pagination.data)
                setPageURL(res.data.data.pagination.next_page_url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect( () => {
        displayTweetFn()
    }, [slug, randomTweets])

    const getComments = (pageURL: string) => {
        ApiClient().get(pageURL)
            .then(res => {
                setComments(prevComments => ([
                    ...prevComments,
                    ...res.data.data.pagination.data,
                ]))
                setPageURL(res.data.data.pagination.next_page_url)
            })
    }

    // Detect when scroll to last element
    const lastCommentRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
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
    }, [pageURL])

    // Delete comment
    const displayComments = comments?.slice(0, comments.length - 1).map(comment => {
        return (
            <Tweet {...comment}/>
        )
    })

    return (
        <div className={`min-h-svh border border-y-0 border-zinc-700/70 ${isCommentOpen || isModalOpen ? 'overflow-y-hidden' : ''} `}>

            <header
                className={`w-full grid grid-cols-1 ${isCommentOpen || isModalOpen ? 'opacity-20 pointer-events-none' : ''} gap-x-3 px-4 border border-zinc-700/70 3xl:max-w-[42.98rem] 2xl:max-w-[38.58rem] xl:max-w-[31.75rem] lg:max-w-[31.68rem] md:max-w-[37.74rem] sm:max-w-[30rem] xs:max-w-[31.26rem] xxs:max-w-[27.87rem]`}>
                {/* Header but only on small screens */}
                <div className={`flex sm:hidden justify-between px-6 py-5 pb-1`}>
                    <img className={`size-11 rounded-full object-cover`}
                         src={`${baseUrl}/storage/${user?.user_info.avatar}`} alt=""/>
                    <FaXTwitter className={`size-9`}/>
                    <IoSettingsOutline className={`size-9`}/>
                </div>
                {/* Header for the rest of screens */}
                <div className={`flex items-center gap-x-7 px-4 w-full text-neutral-200 z-[100] cursor-pointer`}>
                    <div onClick={goBack} className={`hover:bg-neutral-600/30 flex justify-center items-center p-2 rounded-full transition cursor-pointer`}>
                        <RiArrowLeftLine className={`size-5`}/>
                    </div>
                    <div className={`py-4 text-xl font-semibold`}>Post</div>
                </div>
            </header>
                {/* Middle content */}
                <div className={`${isCommentOpen || isModalOpen ? 'opacity-20 pointer-events-none' : ''} text-neutral-200 w-full relative`}>
                    {
                        displayTweet &&
                        <Tweet {...displayTweet!}/>
                    }
                    {displayComments}
                    <div ref={lastCommentRef}>
                        {comments.length > 0 && (
                            <Tweet {...comments[comments.length - 1]} />
                        )}
                    </div>
                </div>

            {/* Tweet model  */}
            <Model/>
        </div>

    )
}

export default ShowTweet
