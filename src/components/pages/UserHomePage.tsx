import Sidebar from "../partials/Sidebar.tsx";
import {FaXTwitter} from "react-icons/fa6";
import {MdOutlinePermMedia} from "react-icons/md";
import {CiFaceSmile} from "react-icons/ci";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import Post from "../layouts/Post.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import {LuArrowBigUp} from "react-icons/lu";
import ApiClient from "../services/ApiClient.tsx";
import * as React from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {HiMiniXMark} from "react-icons/hi2";
import EmojiPicker from 'emoji-picker-react';
import { EmojiData } from 'emoji-picker-react'

interface Tweet {
    title: string
    image: string| File | null | undefined
    video: string| File | null | undefined
}

interface TweetInfo {
    new_tweet: {
        title: string;
        user_id: number;
        image: string;
        video: string;
        updated_at: string;
        created_at: string;
        id: number;
    };
    reactions: {
        likes: number;
    };
}


function UserHomePage() {
    const {user, baseUrl} = useContext(AppContext);

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isPostBtnDisabled, setIsPostBtnDisabled] = useState(true)
    const [tweet, setTweet] = useState<Tweet>({
        title: '',
        image: null,
        video: null
    })
    const [tweetInModel, setTweetInModel] = useState<Tweet>({
        title: '',
        image: null,
        video: null
    })
    const [tweetInfo, setTweetInfo] = useState({})
    const [allUserTweets, setAllUserTweets] = useState<TweetInfo[]>([])
    const [videoURL, setVideoURL] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showModelEmojiPicker, setShowModelEmojiPicker] = useState(false)

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTweet(prevTweet => ({
            ...prevTweet,
            [name]: value
        }));
    };

    // Handle textArea change in post model
    const handleTextAreaChangePostModel = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTweetInModel(prevTweetInModel => ({
            ...prevTweetInModel,
            [name]: value
        }));
    };

    const onEmojiClick = (emojiObject: EmojiData) => {
        setTweet(prevTweet => ({
            ...prevTweet,
            title: prevTweet.title + emojiObject.emoji
        }))
    };

    const handleFileChangeDynamic = (file: File, type: 'image' | 'video', setState: React.Dispatch<React.SetStateAction<Tweet>>) => {
        setState(prevState => ({
            ...prevState,
            [type]: file,
        }));
        setVideoURL(URL.createObjectURL(file));
    };


// Handle input file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, _: 'image' | 'video', setState: React.Dispatch<React.SetStateAction<Tweet>>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image') && !tweet.video) {
                handleFileChangeDynamic(file, 'image', setState);

            } else if (file.type.startsWith('video') && !tweet.image) {
                handleFileChangeDynamic(file, 'video', setState);
            }
        }
    };


    // Change the disabled post btn if the tweet.title not empty
    useEffect( () => {
        if(tweet.title.length > 0 || tweet.image || tweet.video){
            setIsPostBtnDisabled(false)
        }else {
            setIsPostBtnDisabled(true)
        }

    }, [tweet.title, tweet.image, tweet.video] )

    // Change the disabled post btn if the tweet.title not empty
    useEffect( () => {
        if(tweetInModel.title.length > 0 || tweetInModel.image || tweetInModel.video){
            setIsPostBtnDisabled(false)
        }else {
            setIsPostBtnDisabled(true)
        }

    }, [tweetInModel.title, tweetInModel.image, tweetInModel.video] )

    // Set input to empty when he successfully post
    const makeInputEmpty = () => {
        setTweet(prevTweet => ({
            ...prevTweet,
            title: "",
            image: null,
            video: null,
        }))

        setTweetInModel(prevTweetInModel => ({
            ...prevTweetInModel,
            title: "",
            image: null,
            video: null,
        }))
    }

    const inputElement = document.getElementById('uploadInput') as HTMLInputElement;
    const inputElementInModel = document.getElementById('uploadInputInModel') as HTMLInputElement;

    // Send Request with data
    const sendRequest = () => {
        const formData = new FormData();
        formData.append('title', tweet.title || tweetInModel.title);
        if(tweet.image){
            formData.append('image', tweet.image as Blob);
        } else if(tweetInModel.image){
            formData.append('image', tweetInModel.image as Blob);
        }
        if(tweet.video){
            formData.append('video', tweet.video as Blob)
        } else if(tweetInModel.video){
            formData.append('video', tweetInModel.video as Blob)
        }

        ApiClient().post('/create-tweet', formData)
            .then(res => {
                setIsModelOpen(false)
                setTweetInfo(res.data.data)
                // Concatenate the new tweet with existing tweets and sort them based on created_at
                setAllUserTweets(prevAllUserTweets => {
                    const updatedTweets = [...prevAllUserTweets, res.data.data];
                    // Sort tweets based on created_at in descending order
                    updatedTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    return updatedTweets;
                });
                makeInputEmpty()

                if (inputElement || inputElementInModel) {
                    inputElement.value = '';
                    inputElementInModel.value = '';
                }

            })
            .catch(err => {
                console.log(err)
            })
    }

    console.log(allUserTweets)
    const posts: React.ReactNode = allUserTweets.map((tweet) => (
        <Post key={tweet.new_tweet.id} {...tweet} />
    ));


    // Dynamic change textarea height based on the text long
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const textAreaModelRef = useRef<HTMLTextAreaElement>(null)

    useEffect( () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 1 + 'px';
        }
        if (textAreaModelRef.current) {
            textAreaModelRef.current.style.height = 'auto';
            textAreaModelRef.current.style.height = textAreaModelRef.current.scrollHeight + 1 + 'px';
        }

    }, [tweet.title] )

    // Remove uploaded image
    const removeUploadedFile = () => {
        setTweet(prevTweet => ({
            ...prevTweet,
            image: null,
            video: null,
        }))

        setTweetInModel(prevTweetInModel => ({
            ...prevTweetInModel,
            image: null,
            video: null,
        }))

        if (inputElement) {
            inputElement.value = ''; // Reset the value to empty string
        }
        if (inputElementInModel) {
            inputElementInModel.value = ''; // Reset the value to empty string
        }
    }

    // Handle model open state
    const handleModelOpen = () => {
        setIsModelOpen(!isModelOpen)
    }

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
            if(!model.current?.contains(e.target as Node)){
                setIsModelOpen(false)

                setTweetInModel(prevTweetInModel => ({
                    ...prevTweetInModel,
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

    }, [] )

    // Show the emoji picker when click on the smile btn
    const displayMainEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker)
    }

    // Show the emoji picker when click on the smile btn
    const displayModelEmojiPicker = () => {
        setShowModelEmojiPicker(!showModelEmojiPicker)
    }

    // Handle close emoji picker when clicked
    const mainEmojiPickerRef = useRef<HTMLDivElement>(null); // Specify the type as HTMLDivElement
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!mainEmojiPickerRef.current?.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    // Handle close emoji picker when clicked
    const modelEmojiPickerRef = useRef<HTMLDivElement>(null); // Specify the type as HTMLDivElement
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!modelEmojiPickerRef.current?.contains(e.target as Node)) {
                setShowModelEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);



    return (
        <div className={`${isModelOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-screen flex justify-center overflow-x-hidden`}>
            <div className={`${isModelOpen ? 'opacity-20 pointer-events-none' : 'z-50'} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Scroll to top button */}
                <div className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar handleModelOpen={handleModelOpen}/>
                </div>

                {/* Middle content */}
                <div className={`text-neutral-200 border border-t-0 border-zinc-700/70 w-full relative animate-slide-down`}>
                    <header className={`w-full grid grid-cols-1 border-b border-zinc-700/70 fixed 2xl:max-w-[38.46rem] xl:max-w-[33.3rem] lg:max-w-[33.7rem] md:max-w-[39.34rem] sm:max-w-[31.2rem] xs:max-w-[31.15rem] xxs:max-w-[27.6rem] backdrop-blur-md`}>
                        {/* Header but only on small screens */}
                        <div className={`flex sm:hidden justify-between px-6 py-5 pb-1`}>
                            <img className={`size-11 rounded-full object-cover`} src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>
                            <FaXTwitter className={`size-9`}/>
                            <IoSettingsOutline className={`size-9`}/>
                        </div>
                        {/* Header for the rest of screens */}
                        <div className={`w-full`}>
                            <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>For you</button>
                            <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>Following</button>
                        </div>
                    </header>

                    {/* Post Section */}
                    <div className={`flex flex-col py-3 px-6 sm:mt-16 mt-36 border-b border-zinc-700/70 z-10`}>
                        <div className={`flex gap-x-3`}>

                            <img className={`size-11 object-cover rounded-full`} src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>

                            <div className={`flex flex-wrap w-full ${!tweet.image ? 'gap-y-5' : ''}`}>
                                <textarea
                                    ref={textAreaRef}
                                    maxLength={255}
                                    onChange={handleTextAreaChange}
                                    placeholder={!tweet.title ? 'What is happening?!' : ''}
                                    name={`title`}
                                    value={tweet.title}
                                    className={`bg-transparent overflow-x-auto resize-none ${!tweet.image ? 'border-b pb-3' : ''}  border-zinc-700/70 text-xl w-full pt-1 placeholder:font-light placeholder:text-neutral-500 focus:outline-0`}
                                />

                                {/* Preview uploaded image */}
                                {(tweet.image && !tweet.video && !isModelOpen) &&
                                    <div className={`${!tweet.image ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                                        <div onClick={removeUploadedFile} className="absolute right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                                            <HiMiniXMark className={`size-6`}/>
                                        </div>
                                        <img className={`w-full rounded-2xl transition object-cover`}
                                             src={tweet?.image ? URL.createObjectURL(tweet?.image as File) : ''} alt=""/>
                                    </div>
                                }

                                {/* Preview uploaded video */}
                                {(tweet.video && !tweet.image && !isModelOpen) &&
                                    <div className={`${!tweet.video ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                                        <div onClick={removeUploadedFile} className="absolute z-50 right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                                            <HiMiniXMark className={`size-6`}/>
                                        </div>
                                        <video
                                            src={videoURL}
                                            className={`w-full`}
                                            controls
                                        />
                                    </div>
                                }

                                <div className={`flex justify-between w-full ${tweet.image ? 'mt-2' : 'mt-0'}`}>
                                    <div className={`flex text-2xl text-sky-600`}>
                                        <label htmlFor="uploadInput">
                                            <div className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                                <input name={'image'} id={`uploadInput`} type="file" className={`hidden`} onChange={(e) => handleFileChange(e, 'image', setTweet)}  />
                                                <MdOutlinePermMedia />
                                            </div>
                                        </label>

                                        <div ref={mainEmojiPickerRef} className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                            <CiFaceSmile onClick={displayMainEmojiPicker}/>
                                            {showEmojiPicker &&
                                                <EmojiPicker
                                                    theme={'dark'}
                                                    emojiStyle={'twitter'}
                                                    width={320}
                                                    height={400}
                                                    onEmojiClick={onEmojiClick}
                                                    className={`main-emoji-picker`}
                                                    style={{
                                                        position: 'absolute',
                                                        backgroundColor: 'black',
                                                        boxShadow: '0 3px 12px #ffffff73',
                                                        borderRadius: '8px',
                                                        padding: '10px',
                                                    }}
                                                />
                                            }

                                        </div>
                                    </div>

                                    <div onClick={sendRequest} className={`bg-sky-600 px-6 font-semibold flex justify-center items-center rounded-full ${isPostBtnDisabled ? 'bg-sky-800 text-neutral-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        Post
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  All Posts  */}
                    <div>
                        {posts}
                    </div>

                </div>

                <TrendingSidebar/>

            </div>

            {/* Post model  */}
            <div ref={model} className={`absolute bg-black text-neutral-200 top-16 w-[37rem] p-3 rounded-2xl flex flex-col gap-y-3 ${isModelOpen ? 'animate-slide-down' : 'close-slide-down'} `}>
                <div
                    onClick={handleModelOpen}
                    className="w-fit p-1 cursor-pointer hover:bg-neutral-800 text-neutral-300 flex justify-center items-center rounded-full transition">
                    <HiMiniXMark className={`size-6`}/>
                </div>
                <div className={`flex gap-x-3 ${(tweet.image || tweet.video) ? 'border-0' : 'border-b'} border-zinc-700/70 text-neutral-200`}>
                    <img className={`size-11 object-cover rounded-full`} src={`${baseUrl}/storage/${user?.avatar}`}
                         alt=""/>
                    <textarea
                        ref={textAreaModelRef}
                        maxLength={255}
                        onChange={handleTextAreaChangePostModel}
                        placeholder={`What is happening?!`}
                        name={`title`}
                        value={tweetInModel.title}
                        className={`bg-transparent overflow-x-auto resize-none text-xl w-full pt-1 pb-16 placeholder:font-light placeholder:text-neutral-500 focus:outline-0`}
                    />
                </div>

                {/* Preview uploaded image */}
                {(tweetInModel.image && !tweetInModel.video) &&
                    <div className={`${!tweetInModel.image ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                        <div onClick={removeUploadedFile} className="absolute right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                            <HiMiniXMark className={`size-6`}/>
                        </div>
                        <img className={`w-full rounded-2xl transition object-cover`}
                             src={tweetInModel?.image ? URL.createObjectURL(tweetInModel?.image as File) : ''} alt=""/>
                    </div>
                }

                {/* Preview uploaded video */}
                {(tweetInModel.video && !tweetInModel.image) &&
                    <div className={`${!tweetInModel.video ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                        <div onClick={removeUploadedFile} className="absolute z-50 right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                            <HiMiniXMark className={`size-6`}/>
                        </div>
                        <video
                            src={videoURL}
                            className={`w-full rounded-2xl`}
                            controls
                        />
                    </div>
                }

                <div className={`flex justify-between w-full ${tweetInModel.image ? 'mt-2' : 'mt-0'}`}>
                    <div className={`flex text-2xl text-sky-600`}>
                        <label htmlFor="uploadInputInModel">
                            <div className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                <input id={`uploadInputInModel`} type="file" className={`hidden`}
                                       onChange={(e) => handleFileChange(e, 'image', setTweetInModel)}/>
                                <MdOutlinePermMedia/>
                            </div>
                        </label>

                        <div ref={modelEmojiPickerRef} className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                            <CiFaceSmile onClick={displayModelEmojiPicker}/>
                            {showModelEmojiPicker &&
                                <EmojiPicker
                                    theme={'dark'}
                                    emojiStyle={'twitter'}
                                    width={320}
                                    height={400}
                                    style={{
                                        position: 'absolute',
                                        backgroundColor: 'black',
                                        boxShadow: '0 3px 12px #ffffff73',
                                        borderRadius: '8px',
                                        padding: '10px',
                                    }}
                                    onEmojiClick={onEmojiClick}
                                />
                            }
                        </div>
                    </div>

                    <div onClick={sendRequest}
                         className={`bg-sky-600 px-6 font-semibold flex justify-center items-center rounded-full ${isPostBtnDisabled ? 'bg-sky-800 text-neutral-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                        Post
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserHomePage
