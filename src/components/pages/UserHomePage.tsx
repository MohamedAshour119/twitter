import Sidebar from "../partials/Sidebar.tsx";
import {FaXTwitter} from "react-icons/fa6";
import {MdOutlinePermMedia} from "react-icons/md";
import {CiFaceSmile} from "react-icons/ci";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import Tweet from "../layouts/Tweet.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import {LuArrowBigUp} from "react-icons/lu";
import ApiClient from "../services/ApiClient.tsx";
import * as React from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {HiMiniXMark} from "react-icons/hi2";
import EmojiPicker from 'emoji-picker-react';
import {EmojiData} from 'emoji-picker-react'
import TweetModel from "../layouts/TweetModel.tsx";
import apiClient from "../services/ApiClient.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";

interface Tweet {
    title: string
    image: string | File | null | undefined
    video: string | File | null | undefined
}

function UserHomePage() {
    const {
        user,
        baseUrl,
        isModelOpen,
        setIsModelOpen,
        randomTweets,
        setRandomTweets,
        isCommentOpen,
    } = useContext(AppContext);

    const {
        tweet,
        setTweet,
        videoURL,
        setVideoURL,
        showEmojiEl,
        setShowEmojiEl,
        handleTextAreaChange,
        onEmojiClick,
        displayMainEmojiPicker,
    } = useContext(TweetContext)


    const [isPostBtnDisabled, setIsPostBtnDisabled] = useState(true)
    const [pageURL, setPageURL] = useState('')


    // Fetch random tweets
    const getHomeTweets = (pageURL: string) => {
        apiClient().get(pageURL)
            .then(res => {
                setRandomTweets([])
                setPageURL(res.data.data.pagination.next_page_url)
                setRandomTweets(prevRandomTweets => ([
                    ...prevRandomTweets,
                    ...res.data.data.tweets
                ]))
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getHomeTweets('home-tweets')
    }, [])



    // Detect when scroll to last element
    const lastTweetRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                getHomeTweets(pageURL)
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
        if (lastTweetRef.current) {
            observer.observe(lastTweetRef.current)
        }

        // Cleanup
        return () => {
            if (lastTweetRef.current) {
                observer.unobserve(lastTweetRef.current);
            }
        };
    }, [pageURL])

    // Display random tweets
    const displayRandomTweets: React.ReactNode = randomTweets?.slice(0, randomTweets.length - 1).map(tweetInfo => (
        <Tweet
            key={tweetInfo.id}
            {...tweetInfo}
        />
    ));


    // Handle input file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: string, setTweet: (value: Tweet) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image') && !tweet.video) {
                setTweet({
                    ...tweet,
                    image: file,
                    video: null
                });
            } else if (file.type.startsWith('video') && !tweet.image) {
                setTweet({
                    ...tweet,
                    image: null,
                    video: file
                });
                setVideoURL(URL.createObjectURL(file));
            }
        }
    };


    // Change the disabled post btn if the tweet.title not empty
    useEffect(() => {
        if (tweet.title.length > 0 || tweet.image || tweet.video) {
            setIsPostBtnDisabled(false)
        } else {
            setIsPostBtnDisabled(true)
        }

    }, [tweet.title, tweet.image, tweet.video])


    // Set input to empty when he successfully post
    const makeInputEmpty = () => {
        setTweet(prevTweet => ({
            ...prevTweet,
            title: "",
            image: null,
            video: null,
        }))
    }

    const inputElement = document.getElementById('uploadInput') as HTMLInputElement;

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

        ApiClient().post(`/create-tweet`, formData)
            .then(res => {
                setIsModelOpen(false)

                // Concatenate the new tweet with existing tweets and sort them based on created_at
                setRandomTweets(prevRandomTweets => (
                    [res.data.data, ...prevRandomTweets]
                ));
                makeInputEmpty()

                if (inputElement) {
                    inputElement.value = '';
                }

            })
            .catch(err => {
                console.log(err)
            })
    }

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



    // Handle close main emoji picker when clicked outside
    const emojiPickerRef = useRef<HTMLDivElement>(null); // Specify the type as HTMLDivElement
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!emojiPickerRef.current?.contains(e.target as Node)) {
                setShowEmojiEl(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);


    return (
        <div
            className={`${(isModelOpen || isCommentOpen) ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-screen flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header
                    className={`w-full grid grid-cols-1 border ${isModelOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70 2xl:max-w-[39rem] xl:max-w-[34rem] lg:max-w-[34rem] md:max-w-[40.34rem] sm:max-w-[32rem] xs:max-w-[31.30rem] xxs:max-w-[28rem] backdrop-blur-sm`}>
                    {/* Header but only on small screens */}
                    <div className={`flex sm:hidden justify-between px-6 py-5 pb-1 text-neutral-200`}>
                        <img className={`size-11 rounded-full object-cover`}
                             src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>
                        <FaXTwitter className={`size-9`}/>
                        <IoSettingsOutline className={`size-9`}/>
                    </div>
                    {/* Header for the rest of screens */}
                    <div className={`w-full text-neutral-200 z-[100]`}>
                        <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>For you</button>
                        <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>Following</button>
                    </div>
                </header>
                <div></div>
            </div>

            <div
                className={`${(isModelOpen || isCommentOpen) ? 'opacity-20 pointer-events-none' : 'z-50'} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Scroll to top button */}
                <div
                    className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                {/* Middle content */}
                <div
                    className={`z-10 text-neutral-200 border border-t-0 border-zinc-700/70 w-full relative`}>

                    {/* Tweet Section */}
                    <div className={`flex flex-col py-3 px-6 sm:mt-16 mt-36 border-b border-zinc-700/70 z-10`}>
                        <div className={`flex gap-x-3`}>

                            <img className={`size-11 object-cover rounded-full`}
                                 src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>

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
                                    <div
                                        className={`${!tweet.image ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                                        <div onClick={removeUploadedFile}
                                             className="absolute right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                                            <HiMiniXMark className={`size-6`}/>
                                        </div>
                                        <img className={`w-full max-h-[40rem] rounded-2xl transition`}
                                             src={tweet?.image ? URL.createObjectURL(tweet?.image as File) : ''}
                                             alt=""/>
                                    </div>
                                }

                                {/* Preview uploaded video */}
                                {(tweet.video && !tweet.image && !isModelOpen) &&
                                    <div
                                        className={`${!tweet.video ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 relative'}`}>
                                        <div onClick={removeUploadedFile}
                                             className="absolute z-50 right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                                            <HiMiniXMark className={`size-6`}/>
                                        </div>
                                        <video
                                            src={videoURL}
                                            className={`w-full max-h-[40rem]`}
                                            controls
                                        />
                                    </div>
                                }

                                <div className={`flex justify-between w-full ${tweet.image ? 'mt-2' : 'mt-0'}`}>
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
                                            <div className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                                <CiFaceSmile onClick={displayMainEmojiPicker}/>
                                            </div>
                                            {showEmojiEl &&
                                                <div ref={emojiPickerRef}>
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
                                    </div>

                                    <div onClick={sendRequest}
                                         className={`bg-sky-600 px-6 font-semibold flex justify-center items-center rounded-full ${isPostBtnDisabled ? 'bg-sky-800 text-neutral-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        Post
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  All Tweets  */}
                    <div>
                        {/*{tweets}*/}
                        {displayRandomTweets}
                        <div ref={lastTweetRef}>
                            {randomTweets.length > 0 && (
                                <Tweet {...randomTweets[randomTweets.length - 1]} />
                            )}
                        </div>
                    </div>

                </div>

                <TrendingSidebar/>

            </div>

            {/* Tweet model  */}
            <TweetModel/>
        </div>
    )
}

export default UserHomePage
