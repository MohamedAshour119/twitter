import {HiMiniXMark} from "react-icons/hi2";
import {useContext, useEffect, useRef} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {Link} from "react-router-dom";
import {TweetContext} from "../appContext/TweetContext.tsx";
import TweetTextAreaAndPreview from "./TweetTextAreaAndPreview.tsx";
import EmojiPicker, {Categories, EmojiStyle, SuggestionMode, Theme} from "emoji-picker-react";


function Model() {

    const {
        baseUrl,
        isModalOpen,
        setIsModalOpen,
        handleModalOpen,
        isCommentOpen,
        setIsCommentOpen,
        clickedTweet,
    } = useContext(AppContext);

    const {
        setTweet,
        setShowEmojiElInModel,
        showEmojiElInModel,
        onEmojiClick,
        tweet,
    } = useContext(TweetContext)

    const closeModel = () => {
        handleModalOpen()
        addAnimation()
    }

    // Handle start animation when page loaded
    const model = useRef<HTMLDivElement>(null);

    const addAnimation = () => {
        model.current?.classList.contains('animate-slide-down')
            ? model.current?.classList.add('close-slide-down')
            :  model.current?.classList.add('animate-slide-down')
        setTimeout(() => {
            setIsModalOpen(false)
            setIsCommentOpen(false)
            setShowEmojiElInModel(false)

            setTweet(() => ({
                id: null,
                title: "",
                image: null,
                video: null,
            }))
        }, 200)
    }

    // Close model post when clicked outside it
    useEffect( () => {
        const handleClickOutside = (e: MouseEvent) => {
            if(!model.current?.contains(e.target as Node) && (isModalOpen || isCommentOpen) && !showEmojiElInModel){
                addAnimation()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [isModalOpen, isCommentOpen] )

    const emojiModelpickerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(!emojiModelpickerRef.current?.contains(e.target as Node)) {
                setShowEmojiElInModel(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);


    return (
        <div ref={model} className={`z-[500] fixed bg-black text-neutral-200 sm:top-16 top-36 sm:w-[38rem] left-6 md:left-auto w-[95%] p-3 rounded-2xl flex-col gap-y-3  ${isModalOpen || isCommentOpen ? 'animate-slide-down' : 'close-slide-down hidden'} `}>
            <div
                onClick={closeModel}
                className="w-fit p-1 cursor-pointer hover:bg-neutral-800 text-neutral-300 flex justify-center items-center rounded-full transition">
                <HiMiniXMark className={`size-6`}/>
            </div>

            { isCommentOpen &&
                <>
                    <div className={`flex gap-x-3 border-zinc-700/70 text-neutral-200`}>
                        <img className={`size-11 object-cover rounded-full`} src={`${baseUrl}/storage/${clickedTweet.user.user_info.avatar}`}
                             alt=""/>
                        <div className={``}>
                            <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                                <Link to={`/users/${clickedTweet.user.user_info.username}`} className={`xs:flex gap-x-2`}>
                                    <h1 className={`font-semibold cursor-pointer`}>{clickedTweet.user.user_info.username}</h1>
                                    <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{clickedTweet.user.user_info.username}</h1>
                                </Link>
                                <span
                                    className={`font-light text-[#71767b] cursor-pointer`}>{clickedTweet.created_at}
                            </span>
                            </div>

                            <div>
                                {clickedTweet.title}
                            </div>

                        </div>
                    </div>

                    <div className={`ml-14`}>
                        <p className={`text-sky-600`}> <span className={`text-zinc-500`}>Replying to </span>@{clickedTweet.user.user_info.username}</p>
                    </div>
                </>
            }
            <TweetTextAreaAndPreview/>
            <div >
                {showEmojiElInModel && (isModalOpen || isCommentOpen) &&
                    <div ref={emojiModelpickerRef}>
                        <EmojiPicker
                            theme={Theme.DARK}
                            emojiStyle={EmojiStyle.TWITTER}
                            autoFocusSearch
                            lazyLoadEmojis={false}
                            suggestedEmojisMode={SuggestionMode.RECENT}
                            searchDisabled
                            width={320}
                            height={400}
                            onEmojiClick={onEmojiClick}
                            className={`${tweet.image || tweet.video ? 'top-[18rem]' : ''}`}
                            style={{
                                position: 'absolute',
                                backgroundColor: 'black',
                                boxShadow: '0 3px 12px #ffffff73',
                                borderRadius: '8px',
                                padding: '10px',
                                zIndex: '260',
                                left: '7rem'
                            }}
                            previewConfig={{showPreview: false}}
                            categories={[
                                { name: 'Smileys & People', category: Categories.SMILEYS_PEOPLE },
                                { name: 'Animals & Nature', category: Categories.ANIMALS_NATURE },
                                { name: 'Food & Drink', category: Categories.FOOD_DRINK },
                            ]}
                        />
                    </div>
                }

            </div>
        </div>
    )
}

export default Model

