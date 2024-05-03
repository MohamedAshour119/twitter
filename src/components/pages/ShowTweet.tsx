import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import {FaXTwitter} from "react-icons/fa6";
import {IoSettingsOutline} from "react-icons/io5";
import Model from "../layouts/Model.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {useParams} from "react-router-dom";
import ApiClient from "../services/ApiClient.tsx";
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
    } = useContext(AppContext)
    const {
        comments,
        setComments
    } = useContext(TweetContext)
    const {id} = useParams();

    const [displayTweet, setDisplayTweet] = useState<TweetInfo>()
    const [pageURL, setPageURL] = useState('')

    useEffect( () => {
        ApiClient().get(`/tweets/${id}`)
            .then(res => {
                setDisplayTweet(res.data.data.tweet)
                setComments(res.data.data.pagination.data)
                setPageURL(res.data.data.pagination.next_page_url)
            })
            .catch(err => {
                console.log(err)
            })

    }, [id])

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


    const displayComments = comments?.slice(0, comments.length - 1).map(comment => {
        return (
            <Tweet {...comment}/>
        )
    })

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

    return (
        <div
            className={`${isModalOpen || isCommentOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-screen flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header
                    className={`w-full grid grid-cols-1 ${isCommentOpen || isModalOpen ? 'opacity-20 pointer-events-none' : ''} border border-zinc-700/70 2xl:max-w-[43rem] xl:max-w-[34rem] lg:max-w-[34rem] md:max-w-[40.34rem] sm:max-w-[32rem] xs:max-w-[31.30rem] xxs:max-w-[28rem] backdrop-blur-sm`}>
                    {/* Header but only on small screens */}
                    <div className={`flex sm:hidden justify-between px-6 py-5 pb-1`}>
                        <img className={`size-11 rounded-full object-cover`}
                             src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>
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
                <div></div>
            </div>

            <div
                className={`${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                {/* Middle content */}
                <div className={`text-neutral-200 sm:mt-14 mt-32 border border-t-0 border-zinc-700/70 w-full relative`}>
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

                <TrendingSidebar/>

            </div>

            {/* Tweet model  */}
            <Model/>
        </div>

    )
}

export default ShowTweet
