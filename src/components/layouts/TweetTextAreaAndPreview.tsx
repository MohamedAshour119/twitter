import {useContext, useEffect, useRef, useState} from 'react'
import {HiMiniXMark} from "react-icons/hi2";
import {TweetContext} from "../appContext/TweetContext.tsx";
import {AppContext} from "../appContext/AppContext.tsx";
import {MdOutlinePermMedia} from "react-icons/md";
import {CiFaceSmile} from "react-icons/ci";
import EmojiPicker, {Categories, EmojiStyle, SuggestionMode, Theme} from "emoji-picker-react";

function TweetTextAreaAndPreview() {

    const {
        user,
        isModalOpen,
        isCommentOpen,
    } = useContext(AppContext)

    const {
        tweet,
        setTweet,
        videoURL,
        showEmojiEl,
        handleTextAreaChange,
        onEmojiClick,
        displayMainEmojiPicker,
        displayModelEmojiPicker,
        handleFileChange,
        sendRequest,
        setShowEmojiEl,
    } = useContext(TweetContext)

    const [isPostBtnDisabled, setIsPostBtnDisabled] = useState(true)

    const inputElement = document.getElementById('uploadInput') as HTMLInputElement;

    // Dynamic change textarea height based on the text long
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 1 + 'px';
        }

    }, [tweet.title])

    // Remove uploaded image
    const removeUploadedFile = () => {
        setTweet(prevTweet => ({
            ...prevTweet,
            image: null,
            video: null,
        }))

        if (inputElement) {
            inputElement.value = ''; // Reset the value to empty string
        }
    }

    // Change the disabled post btn if the tweet.title not empty
    useEffect(() => {
        if (tweet.title.length > 0 || tweet.image || tweet.video) {
            setIsPostBtnDisabled(false)
        } else {
            setIsPostBtnDisabled(true)
        }

    }, [tweet.title, tweet.image, tweet.video])

    const emojipickerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const emojiPicker = document.querySelector('.emoji-picker-react');
            if (
                !emojipickerRef.current?.contains(e.target as Node) &&
                (!emojiPicker || !emojiPicker.contains(e.target as Node))
            ) {
                setShowEmojiEl(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.classList.add('!h-auto')
        }
    }, [isModalOpen, isCommentOpen]);

    return (
        <div className={`${location?.pathname !== `/home` && !isModalOpen && !isCommentOpen ? 'border-t border-zinc-700/70' : ''} `}>
            <div className={`flex flex-col relative py-3 sm:px-6 px-2 ${location?.pathname !== `/home` || isModalOpen || isCommentOpen ? 'mt-0' : 'sm:mt-14 mt-[7.9rem] border-b'} border-zinc-700/70 z-10`}>
                <div className={`absolute sm:right-6 right-2 top-1 text-xs ${tweet.title.length === 1200 ? 'text-red-600' : 'text-sky-500'}`}>{tweet.title.length}/1200</div>
                <div className={`flex gap-x-3`}>
                        <img className={`size-11 object-cover rounded-full`}
                             src={user?.user_info?.avatar}
                             alt="avatar"
                        />

                    <div className={`flex flex-wrap w-full ${!tweet.image || !tweet.video ? 'gap-y-3' : ''}`}>
                                <textarea
                                    ref={textAreaRef}
                                    maxLength={1200}
                                    onChange={handleTextAreaChange}
                                    placeholder={ (isModalOpen || !isCommentOpen) && location?.pathname === '/home' || isModalOpen ? 'What is happening?!' : 'Post your reply'}
                                    name={`title`}
                                    value={tweet.title}
                                    className={`${isModalOpen || isCommentOpen ? 'min-h-32' : ''} bg-transparent overflow-x-auto resize-none ${!tweet.image || !tweet.video ? 'border-b pb-3' : ''}  border-zinc-700/70 text-xl w-full pt-1 placeholder:font-light placeholder:text-neutral-500 focus:outline-0`}
                                />

                        {/* Preview uploaded image */}
                        {(tweet.image && !tweet.video) &&
                            <div
                                className={`${!tweet.image ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                                <div onClick={removeUploadedFile}
                                     className="absolute right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                                    <HiMiniXMark className={`size-6`}/>
                                </div>
                                <img className={`w-full max-h-[30rem] rounded-2xl transition`}
                                     src={tweet?.image ? URL.createObjectURL(tweet?.image as File) : ''}
                                     alt=""/>
                            </div>
                        }

                        {/* Preview uploaded video */}
                        {(tweet.video && !tweet.image) &&
                            <div
                                className={`${!tweet.video ? 'invisible' : 'visible border-b w-full pb-3  relative'}`}>
                                <div onClick={removeUploadedFile}
                                     className="absolute z-50 right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                                    <HiMiniXMark className={`size-6`}/>
                                </div>
                                <video
                                    src={videoURL}
                                    className={`w-full max-h-[30rem]`}
                                    controls
                                />
                            </div>
                        }

                        <div className={`flex justify-between w-full ${tweet.image || !tweet.video ? 'mt-2' : 'mt-0'}`}>
                            <div className={`flex text-2xl text-sky-600`}>
                                <label htmlFor="uploadInput">
                                    <div
                                        className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                        <input name={'image'}
                                               id={`uploadInput`}
                                               type="file"
                                               className={`hidden`}
                                               onChange={(e) => handleFileChange(e, 'image', setTweet)}/>
                                        <MdOutlinePermMedia/>
                                    </div>
                                </label>

                                <div >
                                    <div
                                        onClick={!(isModalOpen || isCommentOpen) ? displayMainEmojiPicker : displayModelEmojiPicker}
                                        className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                        <CiFaceSmile/>
                                    </div>
                                    {showEmojiEl && !(isModalOpen || isCommentOpen) &&
                                        <div ref={emojipickerRef}>
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
                                                className={`${tweet.image || tweet.video ? 'top-[24rem]' : ''} emoji-picker-react left-4`}
                                                style={{
                                                    position: 'absolute',
                                                    backgroundColor: 'black',
                                                    boxShadow: '0 3px 12px #ffffff73',
                                                    borderRadius: '8px',
                                                    padding: '10px',
                                                    zIndex: '260',
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

                            <button
                                onClick={sendRequest}
                                 disabled={isPostBtnDisabled}
                                 className={`bg-sky-600 px-6 font-semibold flex justify-center items-center rounded-full ${isPostBtnDisabled ? 'bg-sky-800 text-neutral-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                                {!isModalOpen && (isCommentOpen || location?.pathname !== '/home') ? 'Reply' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TweetTextAreaAndPreview
