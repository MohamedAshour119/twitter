import {ChangeEvent, createContext, Dispatch, MouseEventHandler, ReactNode, SetStateAction, useContext, useState} from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {EmojiData} from "emoji-picker-react";
import {tweetDefaultValues, TweetInfo, UserDefaultValues, UserInfo} from "../../Interfaces.tsx";
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
    displayMainEmojiPicker: MouseEventHandler<HTMLDivElement>
    displayModelEmojiPicker: MouseEventHandler<HTMLDivElement>
    showEmojiElInModel: boolean
    setShowEmojiElInModel: Dispatch<SetStateAction<boolean>>
    handleFileChange: (e: ChangeEvent<HTMLInputElement>, fileType: string, setTweet: (value: Tweet) => void) => void
    randomTweets: TweetInfo[];
    setRandomTweets: Dispatch<SetStateAction<TweetInfo[]>>;
    sendRequest: () => void
    comments: TweetInfo[]
    setComments: Dispatch<SetStateAction<TweetInfo[]>>
    commentsCount: number
    setCommentsCount: Dispatch<SetStateAction<number>>
    allProfileUserTweets: TweetInfo[]
    setAllProfileUserTweets: Dispatch<SetStateAction<TweetInfo[]>>
    userInfo: UserInfo | undefined
    setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>
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
    randomTweets: [tweetDefaultValues],
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
    comments: [tweetDefaultValues],
    setComments: () => null,
    commentsCount: 0,
    setCommentsCount: () => null,
    allProfileUserTweets: [tweetDefaultValues],
    setAllProfileUserTweets: () => null,
    userInfo: UserDefaultValues,
    setUserInfo: () => null,

});

const TweetProvider = ({children}: TweetProviderProps) => {


    const {
        setIsModalOpen,
        setIsCommentOpen,
        clickedTweet,
        isCommentOpen,
    } = useContext(AppContext)

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
    const [allProfileUserTweets, setAllProfileUserTweets] = useState<TweetInfo[]>([])
    const [comments, setComments] = useState<TweetInfo[]>([])
    const [commentsCount, setCommentsCount] = useState(0)
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>(UserDefaultValues)
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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

        const hashtags = tweet.title.match(/#[\u0600-\u06FFa-zA-Z][\u0600-\u06FFa-zA-Z0-9_]*[^\s]/g);
        if(hashtags) {
            ApiClient().post('/add-hashtag', hashtags)
                .then()
                .catch()
        }

        formData.append('title', tweet.title);
        formData.append('id', String(clickedTweet.id) )


        if(tweet.image){
            formData.append('image', tweet.image as Blob);
        }
        if(tweet.video){
            formData.append('video', tweet.video as Blob)
        }

        if(location.pathname == `/tweets/${clickedTweet.id}` || isCommentOpen){
            ApiClient().post(`/addComment`, formData)
                .then(res => {
                    makeInputEmpty()
                    setComments(prevComments => ([
                        res.data.data.tweet,
                        ...prevComments,
                    ]))

                    setCommentsCount(prevState => prevState + 1)

                    randomTweets.map((tweet, index) => {
                        const i = (tweet.id === res.data.data.main_tweet.id) ? index : null
                        const filteredTweets = randomTweets.filter(tweet => tweet.id !== res.data.data.main_tweet.id)
                        if (i) {
                            filteredTweets.splice(i, 0, res.data.data.main_tweet)
                            setRandomTweets(filteredTweets)
                        }
                    })

                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setIsCommentOpen(false))
        }
        else {
            ApiClient().post(`/create-tweet`, formData)
                .then(res => {
                    setIsModalOpen(false)

                    // Concatenate the new tweet with existing tweets and sort them based on created_at
                    setRandomTweets(prevState => (
                        [res.data.data, ...prevState]
                    ));

                    if (location.pathname === `/users/${userInfo?.username}`) {

                        setUserInfo((prevState: UserInfo | undefined) => ({
                            ...prevState,
                            tweets_count: res.data.data.user.tweets_count,
                        }) as UserInfo);


                        const pinned_tweet = allProfileUserTweets.filter(tweet => tweet.is_pinned)
                        const remain_tweets = allProfileUserTweets.filter(tweet => !tweet.is_pinned)
                        if (pinned_tweet) {
                            setAllProfileUserTweets([
                                ...pinned_tweet,
                                res.data.data,
                                ...remain_tweets
                            ])
                        } else {
                            setAllProfileUserTweets(prevState => (
                                [res.data.data, ...prevState]
                            ));
                        }
                    }

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
                commentsCount,
                setCommentsCount,
                allProfileUserTweets,
                setAllProfileUserTweets,
                userInfo,
                setUserInfo,
            }}
        >
            {children}
        </TweetContext.Provider>
    )
}

export default  TweetProvider;