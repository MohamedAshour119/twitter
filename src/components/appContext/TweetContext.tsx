import {ChangeEvent, createContext, Dispatch, MouseEventHandler, ReactNode, SetStateAction, useContext, useState} from "react";
import {EmojiData} from "emoji-picker-react";
import {TweetInfo} from "../../Interfaces.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {AppContext} from "./AppContext.tsx";

interface TweetContextType {
    tweet: Tweet
    setTweet: Dispatch<SetStateAction<Tweet>>
    videoURL: string
    setVideoURL: Dispatch<SetStateAction<string>>
    showEmojiEl: boolean
    setShowEmojiEl: Dispatch<SetStateAction<boolean>>
    handleTextAreaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
    onEmojiClick: (emojiObject: EmojiData) => void
    displayMainEmojiPicker: MouseEventHandler<SVGElement>
    displayModelEmojiPicker: MouseEventHandler<SVGElement>
    showEmojiElInModel: boolean
    setShowEmojiElInModel: Dispatch<SetStateAction<boolean>>
    handleFileChange: (e: ChangeEvent<HTMLInputElement>, fileType: string, setTweet: (value: Tweet) => void) => void
    randomTweets: TweetInfo[];
    setRandomTweets: Dispatch<SetStateAction<TweetInfo[]>>;
    sendRequest: () => void
    comments: TweetInfo[]
    setComments: Dispatch<SetStateAction<TweetInfo[]>>
}

interface Tweet {
    id: number | null
    title: string
    image: string | File | null | undefined
    video: string | File | null | undefined
}
interface TweetProviderProps {
    children: ReactNode;
}
export const TweetContext = createContext<TweetContextType>({
    tweet: {
        id: null,
        title: '',
        image: null,
        video: null
    },
    setTweet: () => null,
    setRandomTweets: () => null,
    randomTweets: [{
        user: {
            id: 0,
            username: '',
            avatar: ''
        },

        title: '',
        user_id: 0,
        image: '',
        video: '',
        show_tweet_created_at: '',
        updated_at: '',
        created_at: '',
        id: 0,
        retweet_to: null,
        comment_to: null,
        reactions_count: 0,
        retweets_count: 0,
        is_reacted: false,
        is_retweeted: false,
        comments_count: 0,

        main_tweet: {
            title: '',
            user_id: 0,
            image: '',
            video: '',
            show_tweet_created_at: '',
            updated_at: '',
            created_at: '',
            id: 0,
            retweet_to: null,
            comment_to: null,
            reactions_count: 0,
            retweets_count: 0,
            comments_count: 0,
            is_reacted: false,
            is_retweeted: false,
        }
    }],
    videoURL: '',
    setVideoURL: () => null,
    showEmojiEl: false,
    setShowEmojiEl: () => null,
    handleTextAreaChange: () => null,
    onEmojiClick: () => null,
    displayMainEmojiPicker: () => null,
    showEmojiElInModel: false,
    setShowEmojiElInModel: () => null,
    displayModelEmojiPicker: () => null,
    handleFileChange: () => null,
    sendRequest: () => null,
    comments: [{
        user: {
            id: 0,
            username: '',
            avatar: ''
        },

        title: '',
        user_id: 0,
        image: '',
        video: '',
        show_tweet_created_at: '',
        updated_at: '',
        created_at: '',
        id: 0,
        retweet_to: null,
        comment_to: null,
        reactions_count: 0,
        retweets_count: 0,
        is_reacted: false,
        is_retweeted: false,
        comments_count: 0,

        main_tweet: {
            title: '',
            user_id: 0,
            image: '',
            video: '',
            show_tweet_created_at: '',
            updated_at: '',
            created_at: '',
            id: 0,
            retweet_to: null,
            comment_to: null,
            reactions_count: 0,
            retweets_count: 0,
            comments_count: 0,
            is_reacted: false,
            is_retweeted: false,
        }
    }],
    setComments: () => null,
});

const TweetProvider = ({children}: TweetProviderProps) => {

    const {setIsModelOpen, setIsCommentOpen, clickedTweet} = useContext(AppContext)

    const [tweet, setTweet] = useState<Tweet>({
        id: null,
        title: '',
        image: null,
        video: null
    })
    const [videoURL, setVideoURL] = useState("");
    const [showEmojiEl, setShowEmojiEl] = useState(false)
    const [showEmojiElInModel, setShowEmojiElInModel] = useState(false)
    const [randomTweets, setRandomTweets] = useState<TweetInfo[]>([])
    const [comments, setComments] = useState<TweetInfo[]>([])

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setTweet(prevTweet => ({
            ...prevTweet,
            [name]: value
        }));
    };

    const onEmojiClick = (emojiObject: EmojiData) => {

        setTweet(prevTweet => ({
            ...prevTweet,
            title: prevTweet.title + emojiObject.emoji
        }))
        setShowEmojiEl(false)
        setShowEmojiElInModel(false)
    };

    // Show the main emoji picker when click on the smile btn
    const displayMainEmojiPicker = () => {
        setShowEmojiEl(!showEmojiEl)
    }

    // Show the model emoji picker when click on the smile btn
    const displayModelEmojiPicker = () => {
        setShowEmojiElInModel(!showEmojiElInModel)
    }

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
        formData.append('id', String(clickedTweet.tweet.id) )


        if(tweet.image){
            formData.append('image', tweet.image as Blob);
        }
        if(tweet.video){
            formData.append('video', tweet.video as Blob)
        }

        if(location.pathname == `/tweets/${clickedTweet.tweet.id}`){
            ApiClient().post(`/addComment`, formData)
                .then(res => {
                    makeInputEmpty()
                    setComments(prevComments => ([
                        res.data.data,
                        ...prevComments,
                    ]))
                    setIsCommentOpen(false)
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
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

    }

    return (
        <TweetContext.Provider
            value={{
                tweet,
                setTweet,
                videoURL,
                setVideoURL,
                showEmojiEl,
                setShowEmojiEl,
                handleTextAreaChange,
                onEmojiClick,
                displayMainEmojiPicker,
                displayModelEmojiPicker,
                showEmojiElInModel,
                setShowEmojiElInModel,
                handleFileChange,
                randomTweets,
                setRandomTweets,
                sendRequest,
                comments,
                setComments,
            }}
        >
            {children}
        </TweetContext.Provider>
    )
}

export default  TweetProvider;