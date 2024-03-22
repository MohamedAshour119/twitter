import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";

interface TweetContextType {
    tweet: Tweet
    setTweet: Dispatch<SetStateAction<Tweet>>
    videoURL: string
    setVideoURL: Dispatch<SetStateAction<string>>
    showEmojiPicker: boolean
    setShowEmojiPicker: Dispatch<SetStateAction<boolean>>
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
    showEmojiPicker: false,
    setShowEmojiPicker: () => null,
});

const TweetProvider = ({children}: TweetProviderProps) => {

    const [tweet, setTweet] = useState<Tweet>({
        title: '',
        image: null,
        video: null
    })
    const [videoURL, setVideoURL] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)


    return (
        <TweetContext.Provider
            value={{
                tweet,
                setTweet,
                videoURL,
                setVideoURL,
                showEmojiPicker,
                setShowEmojiPicker,
            }}
        >
            {children}
        </TweetContext.Provider>
    )
}

export default  TweetProvider;