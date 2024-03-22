import {ChangeEvent, createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";

interface TweetContextType {
    tweet: Tweet
    setTweet: Dispatch<SetStateAction<Tweet>>
    videoURL: string
    setVideoURL: Dispatch<SetStateAction<string>>
    showEmojiEl: boolean
    setShowEmojiEl: Dispatch<SetStateAction<boolean>>
    handleTextAreaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

interface Tweet {
    title: string
    image: string | File | null | undefined
    video: string | File | null | undefined
}
interface TweetProviderProps {
    children: ReactNode;
}
export const TweetContext = createContext<TweetContextType>({
    tweet: {
        title: '',
        image: null,
        video: null
    },
    setTweet: () => null,
    videoURL: '',
    setVideoURL: () => null,
    showEmojiEl: false,
    setShowEmojiEl: () => null,
    handleTextAreaChange: () => null,

});

const TweetProvider = ({children}: TweetProviderProps) => {

    const [tweet, setTweet] = useState<Tweet>({
        title: '',
        image: null,
        video: null
    })
    const [videoURL, setVideoURL] = useState("");
    const [showEmojiEl, setShowEmojiEl] = useState(false)

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setTweet(prevTweet => ({
            ...prevTweet,
            [name]: value
        }));
    };


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
            }}
        >
            {children}
        </TweetContext.Provider>
    )
}

export default  TweetProvider;