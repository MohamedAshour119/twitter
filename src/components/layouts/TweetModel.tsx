import {HiMiniXMark} from "react-icons/hi2";
import {MdOutlinePermMedia} from "react-icons/md";
import {CiFaceSmile} from "react-icons/ci";
import EmojiPicker, {EmojiData} from "emoji-picker-react";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {Link} from "react-router-dom";
import {TweetContext} from "../appContext/TweetContext.tsx";
import * as React from "react";


function TweetModel() {

    const {
        user ,
        baseUrl,
        isModelOpen,
        setIsModelOpen,
        setRandomTweets,
        handleModelOpen,
        isCommentOpen,
        setIsCommentOpen,
        clickedTweet,
    } = useContext(AppContext);

    const {
        tweet,
        setTweet,
        videoURL,
        setVideoURL,
        showEmojiElInModel,
        setShowEmojiElInModel,
        handleTextAreaChange,
        onEmojiClick,
        displayModelEmojiPicker,
    } = useContext(TweetContext)

    const [isBtnDisabled, setIsBtnDisabled] = useState(true)

    // Handle input file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image') && !tweet.video) {
                setTweet(prevTweetInModel => ({
                    ...prevTweetInModel,
                    image: file,
                    video: null
                }))

            } else if (file.type.startsWith('video') && !tweet.image) {
                setTweet(prevTweetInModel => ({
                    ...prevTweetInModel,
                    image: null,
                    video: file
                }))
                setVideoURL(URL.createObjectURL(file))
            }
        }
    };

    // Set input to empty when he successfully post
    const makeInputEmpty = () => {
        setTweet(prevTweetInModel => ({
            ...prevTweetInModel,
            title: "",
            image: null,
            video: null,
        }))
    }

    const inputElementInModel = document.getElementById('uploadInputInModel') as HTMLInputElement;

    // Send Request with data
    const sendRequest = () => {
        const formData = new FormData();
        formData.append('title', tweet.title);

        if(tweet.image){
            formData.append('image', tweet.image as Blob);
        }
        if(tweet.video){
            formData.append('video', tweet.video as Blob)
        }

        if(isCommentOpen) {
            formData.append('id', String(clickedTweet.tweet.id))
        }

        const endPoint = isModelOpen ? '/create-tweet' : '/addComment';

        ApiClient().post(endPoint, formData)
            .then(res => {
                setIsModelOpen(false)
                setIsCommentOpen(false)

                // Concatenate the new tweet with existing tweets and sort them based on created_at
                setRandomTweets(prevRandomTweets => (
                    [res.data.data, ...prevRandomTweets]
                ));
                makeInputEmpty()

                if (inputElementInModel) {
                    inputElementInModel.value = '';
                }

            })
            .catch(err => {
                console.log(err)
            })
    }

    // Change the disabled post btn if the tweetModel.title not empty
    useEffect( () => {
        if(tweet.title.length > 0 || tweet.image || tweet.video){
            setIsBtnDisabled(false)
        }else {
            setIsBtnDisabled(true)
        }

    }, [tweet.title, tweet.image, tweet.video] )


    // Dynamic change textarea height based on the text long
    const textAreaModelRef = useRef<HTMLTextAreaElement>(null)

    useEffect( () => {

        if (textAreaModelRef.current) {
            textAreaModelRef.current.style.height = 'auto';
            textAreaModelRef.current.style.height = textAreaModelRef.current.scrollHeight + 1 + 'px';
        }

    }, [tweet.title] )

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

    // Remove uploaded image
    const removeUploadedFile = () => {

        setTweet(prevTweetInModel => ({
            ...prevTweetInModel,
            image: null,
            video: null,
        }))

        if (inputElementInModel) {
            inputElementInModel.value = ''; // Reset the value to empty string
        }
    }

    // Handle close model emoji picker when clicked
    const modelEmojiPickerRef = useRef<HTMLDivElement>(null); // Specify the type as HTMLDivElement
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!modelEmojiPickerRef.current?.contains(e.target as Node)) {
                setShowEmojiElInModel(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    return (
        <div ref={model} className={`absolute bg-black text-neutral-200 top-16 xs:w-[37rem] p-3 rounded-2xl flex flex-col gap-y-3 ${(isModelOpen || isCommentOpen) ? 'animate-slide-down z-[150]' : 'close-slide-down'} `}>
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

            <div className={`flex gap-x-3 ${(tweet.image || tweet.video) ? 'border-0' : 'border-b'} border-zinc-700/70 text-neutral-200`}>
                <img className={`size-11 object-cover rounded-full`} src={`${baseUrl}/storage/${user?.avatar}`}
                     alt=""/>
                <textarea
                    ref={textAreaModelRef}
                    maxLength={255}
                    onChange={handleTextAreaChange}
                    placeholder={isModelOpen ? `What is happening?!` : 'Post your reply'}
                    name={`title`}
                    value={tweet.title}
                    className={`bg-transparent overflow-x-auto resize-none text-xl w-full pt-1 pb-16 placeholder:font-light placeholder:text-zinc-500 focus:outline-0`}
                />
            </div>

            {/* Preview uploaded image */}
            {(tweet.image && !tweet.video) &&
                <div className={`${!tweet.image ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                    <div onClick={removeUploadedFile} className="absolute right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                        <HiMiniXMark className={`size-6`}/>
                    </div>
                    <img className={`w-full max-h-[35rem] rounded-2xl transition`}
                         src={tweet?.image ? URL.createObjectURL(tweet?.image as File) : ''} alt=""/>
                </div>
            }

            {/* Preview uploaded video */}
            {(tweet.video && !tweet.image) &&
                <div className={`${!tweet.video ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                    <div onClick={removeUploadedFile} className="absolute z-50 right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                        <HiMiniXMark className={`size-6`}/>
                    </div>
                    <video
                        src={videoURL}
                        className={`w-full max-h-[40rem] rounded-2xl`}
                        controls
                    />
                </div>
            }

            <div className={`flex justify-between w-full ${tweet.image ? 'mt-2' : 'mt-0'}`}>
                <div className={`flex text-2xl text-sky-600`}>
                    <label htmlFor="uploadInputInModel">
                        <div className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                            <input id={`uploadInputInModel`} type="file" className={`hidden`}
                                   onChange={(e) => handleFileChange(e, 'image', setTweet)}/>
                            <MdOutlinePermMedia/>
                        </div>
                    </label>

                    <div className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                        <CiFaceSmile onClick={displayModelEmojiPicker}/>
                    </div>
                    {showEmojiElInModel &&
                        <div ref={modelEmojiPickerRef}>
                            <EmojiPicker
                                theme={'dark'}
                                emojiStyle={'twitter'}
                                autoFocusSearch
                                lazyLoadEmojis={false}
                                suggestedEmojisMode={'recent'}
                                searchDisabled
                                width={320}
                                height={400}
                                onEmojiClick={onEmojiClick}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'black',
                                    boxShadow: '0 3px 12px #ffffff73',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    zIndex: '200'
                                }}
                                previewConfig={{showPreview: false}}
                                categories={[
                                    {category: 'smileys_people'},
                                    {category: 'animals_nature'},
                                    {category: 'food_drink'},
                                ]}
                            />
                        </div>

                    }
                </div>

                <button
                    onClick={sendRequest}
                    disabled={isBtnDisabled}
                    className={`bg-sky-600 px-6 font-semibold flex justify-center items-center rounded-full ${isBtnDisabled ? 'bg-sky-800 text-neutral-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                    {isModelOpen ? 'Post' : 'Reply'}
                </button>
            </div>
        </div>
    )
}

export default TweetModel

