import {HiMiniXMark} from "react-icons/hi2";
import {MdOutlinePermMedia} from "react-icons/md";
import {CiFaceSmile} from "react-icons/ci";
import EmojiPicker, {EmojiData} from "emoji-picker-react";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import * as React from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";

interface Tweet{
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
interface Prop {
    isModelOpen: boolean;
    setIsModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onEmojiClick: (emojiObject: EmojiData) => void;
    handleModelOpen: () => void;
    isPostBtnDisabled: boolean;
    setIsPostBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    setAllUserTweets: React.Dispatch<React.SetStateAction<TweetInfo[]>>

}
function TweetModel({isModelOpen, setIsModelOpen, handleModelOpen, isPostBtnDisabled, setIsPostBtnDisabled, setAllUserTweets}: Prop) {

    const {user ,baseUrl} = useContext(AppContext);

    const [tweetInModel, setTweetInModel] = useState<Tweet>({
        title: '',
        image: null,
        video: null
    })
    const [videoURL, setVideoURL] = useState("");
    const [tweetInfo, setTweetInfo] = useState({})
    const [showModelEmojiPicker, setShowModelEmojiPicker] = useState(false)


    // Show the model emoji picker when click on the smile btn
    const displayModelEmojiPicker = () => {
        setShowModelEmojiPicker(!showModelEmojiPicker)
    }

    // Handle textArea change in Tweet model
    const handleTextAreaChangePostModel = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTweetInModel(prevTweetInModel => ({
            ...prevTweetInModel,
            [name]: value
        }));
    };

    const onEmojiClick = (emojiObject: EmojiData) => {
        setTweetInModel(prevTweetInModel => ({
            ...prevTweetInModel,
            title: prevTweetInModel.title + emojiObject.emoji
        }))
    };

    // Handle input file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image') && !tweetInModel.video) {
                setTweetInModel(prevTweetInModel => ({
                    ...prevTweetInModel,
                    image: file,
                    video: null
                }))

            } else if (file.type.startsWith('video') && !tweetInModel.image) {
                setTweetInModel(prevTweetInModel => ({
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
        setTweetInModel(prevTweetInModel => ({
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
        formData.append('title', tweetInModel.title);

        if(tweetInModel.image){
            formData.append('image', tweetInModel.image as Blob);
        }
        if(tweetInModel.video){
            formData.append('video', tweetInModel.video as Blob)
        }

        ApiClient().post('/create-tweet', formData)
            .then(res => {
                setTweetInfo({
                    new_tweet: res.data.data,
                    reactions: {
                        likes: 0 // You might need to adjust this based on your data structure
                    }
                });

                setIsModelOpen(false)

                // Concatenate the new tweet with existing tweets and sort them based on created_at
                setAllUserTweets(prevAllUserTweets => {
                    const updatedTweets = [...prevAllUserTweets, res.data.data];
                    // Sort tweets based on created_at in descending order
                    updatedTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    return updatedTweets;
                });
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
        if(tweetInModel.title.length > 0 || tweetInModel.image || tweetInModel.video){
            setIsPostBtnDisabled(false)
        }else {
            setIsPostBtnDisabled(true)
        }

    }, [tweetInModel.title, tweetInModel.image, tweetInModel.video] )


    // Dynamic change textarea height based on the text long
    const textAreaModelRef = useRef<HTMLTextAreaElement>(null)

    useEffect( () => {

        if (textAreaModelRef.current) {
            textAreaModelRef.current.style.height = 'auto';
            textAreaModelRef.current.style.height = textAreaModelRef.current.scrollHeight + 1 + 'px';
        }

    }, [tweetInModel.title] )

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

    // Remove uploaded image
    const removeUploadedFile = () => {

        setTweetInModel(prevTweetInModel => ({
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
                setShowModelEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    return (
        <div ref={model} className={`absolute bg-black text-neutral-200 top-16 w-[37rem] p-3 rounded-2xl flex flex-col gap-y-3 ${isModelOpen ? 'animate-slide-down' : 'close-slide-down'} `}>
            <div
                onClick={handleModelOpen}
                className="w-fit p-1 cursor-pointer hover:bg-neutral-800 text-neutral-300 flex justify-center items-center rounded-full transition">
                <HiMiniXMark className={`size-6`}/>
            </div>
            <div className={`flex gap-x-3 ${(tweetInModel.image || tweetInModel.video) ? 'border-0' : 'border-b'} border-zinc-700/70 text-neutral-200`}>
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
    )
}

export default TweetModel

