import {ChangeEvent, createContext, Dispatch, MouseEventHandler, ReactNode, SetStateAction, useState} from "react";
import {EmojiData} from "emoji-picker-react";

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
    onEmojiClick: () => null,
    displayMainEmojiPicker: () => null,
    showEmojiElInModel: false,
    setShowEmojiElInModel: () => null,
    displayModelEmojiPicker: () => null,
});

const TweetProvider = ({children}: TweetProviderProps) => {

    const [tweet, setTweet] = useState<Tweet>({
        title: '',
        image: null,
        video: null
    })
    const [videoURL, setVideoURL] = useState("");
    const [showEmojiEl, setShowEmojiEl] = useState(false)
    const [showEmojiElInModel, setShowEmojiElInModel] = useState(false)

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
            }}
        >
            {children}
        </TweetContext.Provider>
    )
}

export default  TweetProvider;