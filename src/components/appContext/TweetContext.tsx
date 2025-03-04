import {
    ChangeEvent,
    createContext,
    Dispatch,
    MouseEventHandler,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState
} from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {EmojiData} from "emoji-picker-react";
import {tweetDefaultValues, TweetInfo, UserDefaultValues, UserInfo} from "../../Interfaces.tsx";
import ApiClient from "../ApiClient.tsx";
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
    tweets: TweetInfo[];
    setTweets: Dispatch<SetStateAction<TweetInfo[]>>;
    sendRequest: () => void
    comments: TweetInfo[]
    setComments: Dispatch<SetStateAction<TweetInfo[]>>
    allProfileUserTweets: TweetInfo[]
    setAllProfileUserTweets: Dispatch<SetStateAction<TweetInfo[]>>
    userInfo: UserInfo | undefined
    setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>
    showTweet: TweetInfo
    setShowTweet: Dispatch<SetStateAction<TweetInfo>>
    setSlug: Dispatch<SetStateAction<string>>
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
    setTweets: () => null,
    tweets: [tweetDefaultValues],
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
    allProfileUserTweets: [tweetDefaultValues],
    setAllProfileUserTweets: () => null,
    userInfo: UserDefaultValues,
    setUserInfo: () => null,
    showTweet: tweetDefaultValues,
    setShowTweet: () => null,
    setSlug: () => null,
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
    const [showTweet, setShowTweet] = useState<TweetInfo>(tweetDefaultValues)
    const [tweets, setTweets] = useState<TweetInfo[]>([])
    const [allProfileUserTweets, setAllProfileUserTweets] = useState<TweetInfo[]>([])
    const [comments, setComments] = useState<TweetInfo[]>([])
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>(UserDefaultValues)
    const [slug, setSlug] = useState('');

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setTweet(prevTweet => ({
            ...prevTweet,
            [name]: value
        }));
    };


    // Reset allProfileUserTweets state when username changes
    useEffect(() => {
        setAllProfileUserTweets([]);
    }, [location.pathname]);

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

        if(location.pathname === `/tweets/${showTweet.slug}` || isCommentOpen){
            ApiClient().post(`/addComment`, formData)
                .then(res => {
                    makeInputEmpty()
                    if (showTweet.slug === slug) {
                        setComments(prevComments => ([
                            res.data.data.tweet,
                            ...prevComments,
                        ]))
                    }

                    const target_tweet_id = res.data.data.main_tweet.id
                    tweets.map((tweet, index) => {
                        if (tweet.id === target_tweet_id) {
                            setTweets(prevState => ([
                                ...prevState,
                                tweets[index].comments_count = res.data.data.main_tweet.comments_count
                            ]))
                        }
                    })

                    const target_comment_id = res.data.data.main_tweet.id
                    comments.map((comment, index) => {
                        if (comment.id === target_comment_id) {
                            setComments(prevState => ([
                                ...prevState,
                                comments[index].comments_count = res.data.data.main_tweet.comments_count
                            ]))
                        }
                    })

                    tweets.map((tweet, index) => {
                        const i = (tweet.id === res.data.data.main_tweet.id) ? index : null
                        const filteredTweets = tweets.filter(tweet => tweet.id !== res.data.data.main_tweet.id)
                        if (i) {
                            filteredTweets.splice(i, 0, res.data.data.main_tweet)
                            setTweets(filteredTweets)
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
                    setTweets(prevState => (
                        [res.data.data, ...prevState]
                    ));

                    if (location.pathname === `/users/${userInfo?.user_info.username}`) {

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
                tweets,
                setTweets,
                sendRequest,
                comments,
                setComments,
                allProfileUserTweets,
                setAllProfileUserTweets,
                userInfo,
                setUserInfo,
                showTweet,
                setShowTweet,
                setSlug,
            }}
        >
            {children}
        </TweetContext.Provider>
    )
}

export default  TweetProvider;