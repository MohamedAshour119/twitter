import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import ApiClient from "../services/ApiClient.tsx";
import {TweetInfo, UserInfo} from "../../Interfaces.tsx";

interface AppContextType {
    isRegisterOpen: boolean;
    location: Pathname | null;
    user: UserInfo | null;
    setUser: Dispatch<SetStateAction<UserInfo | null>>;
    baseUrl: string;
    handleModelOpen: () => void;
    isModelOpen: boolean;
    setIsModelOpen: Dispatch<SetStateAction<boolean>>;
    randomTweets: TweetInfo[]
    setRandomTweets: Dispatch<SetStateAction<TweetInfo[]>>
    suggestedUsersToFollow: UserInfo[]
}

export const AppContext = createContext<AppContextType>({
    isRegisterOpen: false,
    location: null,
    user: {
        id: null,
        username: '',
        email: '',
        gender: '',
        avatar: '',
        birth_date: '',
        ban_status: null,
        created_at: '',
        updated_at: '',
        following_number: null,
        followers_number: null,
        is_followed: null,
        tweets_count: null,
    },
    setUser: () => {},
    handleModelOpen: () => null,
    isModelOpen: false,
    setIsModelOpen: () => null,
    baseUrl: '',
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
        updated_at: '',
        created_at: '',
        id: 0,
        retweet_to: null,
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
            updated_at: '',
            created_at: '',
            id: 0,
            retweet_to: null,
            reactions_count: 0,
            retweets_count: 0,
            comments_count: 0,
            is_reacted: false,
            is_retweeted: false,
        }
    }],
    suggestedUsersToFollow: [
        {
            id: null,
            username: '',
            email: '',
            gender: '',
            avatar: '',
            birth_date: '',
            ban_status: null,
            created_at: '',
            updated_at: '',
            following_number: null,
            followers_number: null,
            is_followed: null,
            tweets_count: null,
        }
    ]

});

interface AppProviderProps {
    children: ReactNode;
}

interface Pathname {
    hash: string
    key: string
    pathname: string
    search: string
    state: null
}


const AppProvider = ({children}: AppProviderProps) => {

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const location: Pathname = useLocation();
    const [user, setUser] = useState<UserInfo | null>({
        id: null,
        username: '',
        email: '',
        gender: '',
        avatar: '',
        birth_date: '',
        ban_status: null,
        created_at: '',
        updated_at: '',
        following_number: null,
        followers_number: null,
        is_followed: null,
        tweets_count: null,
    })
    const [randomTweets, setRandomTweets] = useState<TweetInfo[]>([])
    const [suggestedUsersToFollow, setSuggestedUsersToFollow] = useState<UserInfo[]>([])

    const baseUrl = 'http://api.twitter.test'

    useEffect(() => {
        if( location.pathname === '/register' ){
            setIsRegisterOpen(true)
        } else {
            setIsRegisterOpen(false);
        }


    }, [location.pathname]);



    // Sort tweets based on created_at in descending order
    randomTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


    // Handle model open state
    const handleModelOpen = () => {
        setIsModelOpen(prev => !prev)
    }

    // Suggested users to follow
    useEffect( () => {
        ApiClient().get('/home')
            .then(res => {
                setSuggestedUsersToFollow(res.data.data.suggested_users)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <AppContext.Provider value={{isRegisterOpen, location, user, setUser, baseUrl, handleModelOpen, isModelOpen, setIsModelOpen, randomTweets, setRandomTweets, suggestedUsersToFollow}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
