import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import ApiClient from "../services/ApiClient.tsx";
import {ClickedTweet, Notification, UserDefaultValues, UserInfo} from "../../Interfaces.tsx";

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
    allNotifications: Notification[]
    setAllNotifications: Dispatch<SetStateAction<Notification[]>>
    notificationsCount: number
    setNotificationsCount: Dispatch<SetStateAction<number>>
    notificationsPageURL: string
    setNotificationsPageURL: Dispatch<SetStateAction<string>>
    getAllNotifications: (pageURL: string) => void
}

export const AppContext = createContext<AppContextType>({
    isRegisterOpen: false,
    location: null,
    user: {
        id: 0,
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
            id: 0,
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
    allNotifications: [{
        id: null,
        type: '',
        tweet_id: null,
        is_read: false,
        follower_id: null,
        followed_id: null,
        created_at: '',
        user: UserDefaultValues
    }],
    setAllNotifications: () => null,
    notificationsCount: 0,
    setNotificationsCount: () => null,
    notificationsPageURL: '',
    setNotificationsPageURL: () => null,
    getAllNotifications: () => null
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
    const [user, setUser] = useState<UserInfo | null>(UserDefaultValues)


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
    const [allNotifications, setAllNotifications] = useState<Notification[]>([])
    const [notificationsCount, setNotificationsCount] = useState<number>(0)
    const [notificationsPageURL, setNotificationsPageURL] = useState<string>('')

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
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [user])

    // Get all notifications
    const getAllNotifications = (pageURL: string) => {
        ApiClient().get(pageURL)
            .then(res => {
                setAllNotifications(prevNotifications => ([
                    ...prevNotifications,
                    ...res.data.data.notifications
                ]))
                setNotificationsPageURL(res.data.data.next_page_url)
                setNotificationsCount(res.data.data.notifications_count)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect( () => {
        getAllNotifications('/notifications')
    }, [localStorage.getItem('token')])

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
                allNotifications,
                setAllNotifications,
                notificationsCount,
                setNotificationsCount,
                notificationsPageURL,
                setNotificationsPageURL,
                getAllNotifications,
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
