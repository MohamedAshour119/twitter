import {HiMiniXMark} from "react-icons/hi2";
import {useContext, useEffect, useRef} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {Link} from "react-router-dom";
import {TweetContext} from "../appContext/TweetContext.tsx";
import TweetTextAreaAndPreview from "./TweetTextAreaAndPreview.tsx";


function Model() {

    const {
        baseUrl,
        isModelOpen,
        setIsModelOpen,
        handleModelOpen,
        isCommentOpen,
        setIsCommentOpen,
        clickedTweet,
    } = useContext(AppContext);

    const {setTweet,} = useContext(TweetContext)


    // Handle start animation when page loaded
    const model = useRef<HTMLDivElement>(null);
    useEffect( () => {
        setTimeout(() => {
            model.current?.classList.add('hidden');
        }, 0);
    }, [] )

    // Close model post when clicked outside it
    useEffect( () => {
        const handleClickOutside = (e: MouseEvent) => {
            if(!model.current?.contains(e.target as Node) && (isModelOpen || isCommentOpen)){
                setIsModelOpen(false)
                setIsCommentOpen(false)

                setTweet(() => ({
                    id: null,
                    title: "",
                    image: null,
                    video: null,
                }))
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [isModelOpen, isCommentOpen] )


    return (
        <div ref={model} className={`absolute overflow-y-hidden bg-black text-neutral-200 sm:top-16 top-36 sm:w-[40rem] w-[95%] p-3 rounded-2xl flex flex-col gap-y-3 ${(isModelOpen || isCommentOpen) ? 'animate-slide-down z-[250]' : 'close-slide-down'} `}>
            <div
                onClick={handleModelOpen}
                className="w-fit p-1 cursor-pointer hover:bg-neutral-800 text-neutral-300 flex justify-center items-center rounded-full transition">
                <HiMiniXMark className={`size-6`}/>
            </div>

            { isCommentOpen &&
                <>
                    <div className={`flex gap-x-3 border-zinc-700/70 text-neutral-200`}>
                        <img className={`size-11 object-cover rounded-full`} src={`${baseUrl}/storage/${clickedTweet.user.avatar}`}
                             alt=""/>
                        <div className={``}>
                            <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                                <Link to={`/users/${clickedTweet.user.username}`} className={`xs:flex gap-x-2`}>
                                    <h1 className={`font-semibold cursor-pointer`}>{clickedTweet.user.username}</h1>
                                    <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{clickedTweet.user.username}</h1>
                                </Link>
                                <span
                                    className={`font-light text-[#71767b] cursor-pointer`}>{clickedTweet.tweet.created_at}
                            </span>
                            </div>

                            <div>
                                {clickedTweet.tweet.title}
                            </div>

                        </div>
                    </div>

                    <div className={`ml-14`}>
                        <p className={`text-sky-600`}> <span className={`text-zinc-500`}>Replying to </span>@{clickedTweet.user.username}</p>
                    </div>
                </>
            }
            <TweetTextAreaAndPreview/>
        </div>
    )
}

export default Model

