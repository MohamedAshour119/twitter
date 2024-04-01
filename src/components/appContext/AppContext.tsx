import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import ApiClient from "../services/ApiClient.tsx";
import {ClickedTweet, TweetNotification, UserInfo} from "../../Interfaces.tsx";

interface AppContextType {
    isRegisterOpen: boolean
    location: Pathname | null
    user: UserInfo | null
    setUser: Dispatch<SetStateAction<UserInfo | null>>
    baseUrl: string
    handleModelOpen: () => void
    isModelOpen: boolean
    setIsModelOpen: Dispatch<SetStateAction<boolean>>
    suggestedUsersToFollow: UserInfo[]
    isCommentOpen: boolean
    setIsCommentOpen: Dispatch<SetStateAction<boolean>>
    clickedTweet: ClickedTweet
    setClickedTweet: Dispatch<SetStateAction<ClickedTweet>>
    tweetNotifications: TweetNotification[]
    setTweetNotifications: Dispatch<SetStateAction<TweetNotification[]>>
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
        is_followed: false,
        tweets_count: null,
    },
    setUser: () => {},
    handleModelOpen: () => null,
    isModelOpen: false,
    setIsModelOpen: () => null,
    isCommentOpen: false,
    setIsCommentOpen: () => null,
    baseUrl: '',
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
            is_followed: false,
            tweets_count: null,
        }
    ],

    clickedTweet: {
        user: {
            id: 0,
            username: '',
            avatar: ''
        },

        tweet: {
            title: '',
            created_at: '',
            id: null,
            comments_count: 0,
        },
    },

    setClickedTweet: () => null,
    tweetNotifications: [{
        id: null,
        username: '',
        email: '',
        gender: '',
        avatar: '',
        birth_date: '',
        ban_status: false,
        created_at: '',
        updated_at: '',
    }],
    setTweetNotifications: () => null,
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
    const [isCommentOpen, setIsCommentOpen] = useState(false);
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
        is_followed: false,
        tweets_count: null,
    })


    const [clickedTweet, setClickedTweet] = useState<ClickedTweet>({
        user: {
            id: 0,
            username: '',
            avatar: ''
        },
        tweet: {
            title: '',
            created_at: '',
            id: null,
            comments_count: 0,
        },
    })
    const [suggestedUsersToFollow, setSuggestedUsersToFollow] = useState<UserInfo[]>([])
    // const [notificationsCount, setNotificationsCount] = useState<number | null>(null)
    const [tweetNotifications, setTweetNotifications] = useState<TweetNotification[]>([])

    const baseUrl = 'http://api.twitter.test'

    useEffect(() => {
        const storedTweet = localStorage.getItem('tweet');
        if(storedTweet) {
            setClickedTweet(JSON.parse(storedTweet))
        }

    }, []);

    useEffect(() => {
        if( location.pathname === '/register' ){
            setIsRegisterOpen(true)
        } else {
            setIsRegisterOpen(false);
        }

    }, [location.pathname]);


    // Handle model open state
    const handleModelOpen = () => {
        setIsModelOpen(false)
        setIsCommentOpen(false)
    }

    // Suggested users to follow
    useEffect( () => {
        if(user?.id) {
            ApiClient().get('/home')
                .then(res => {
                    setSuggestedUsersToFollow(res.data.data.suggested_users)
                    // setNotificationsCount(res.data.data.notifications_count)
                    setTweetNotifications(res.data.data.notifications)
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }, [user])

    return (
        <AppContext.Provider
            value={{
                isRegisterOpen,
                location,
                user,
                setUser,
                baseUrl,
                handleModelOpen,
                isModelOpen,
                setIsModelOpen,
                suggestedUsersToFollow,
                isCommentOpen,
                setIsCommentOpen,
                clickedTweet,
                setClickedTweet,
                tweetNotifications,
                setTweetNotifications,
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
