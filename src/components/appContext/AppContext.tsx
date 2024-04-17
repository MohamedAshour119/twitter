import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import ApiClient from "../services/ApiClient.tsx";
import {ClickedTweet, ClickedTweetDefaultValues, Hashtag, Notification, UserDefaultValues, UserInfo} from "../../Interfaces.tsx";

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
    originalNotifications: Notification[]
    setOriginalNotifications: Dispatch<SetStateAction<Notification[]>>
    hashtags: Hashtag[]
    setHashtags: Dispatch<SetStateAction<Hashtag[]>>
}

export const AppContext = createContext<AppContextType>({
    isRegisterOpen: false,
    location: null,
    user: UserDefaultValues,
    setUser: () => {},
    handleModelOpen: () => null,
    isModelOpen: false,
    setIsModelOpen: () => null,
    isCommentOpen: false,
    setIsCommentOpen: () => null,
    baseUrl: '',
    suggestedUsersToFollow: [],
    clickedTweet: ClickedTweetDefaultValues,
    setClickedTweet: () => null,
    allNotifications: [],
    originalNotifications: [],
    setOriginalNotifications: () => null,
    setAllNotifications: () => null,
    notificationsCount: 0,
    setNotificationsCount: () => null,
    notificationsPageURL: '',
    setNotificationsPageURL: () => null,
    getAllNotifications: () => null,
    hashtags: [],
    setHashtags: () => null,
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

    const location: Pathname = useLocation();
    const token = localStorage.getItem('token');

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(UserDefaultValues)
    const [clickedTweet, setClickedTweet] = useState<ClickedTweet>(ClickedTweetDefaultValues)
    const [suggestedUsersToFollow, setSuggestedUsersToFollow] = useState<UserInfo[]>([])
    const [allNotifications, setAllNotifications] = useState<Notification[]>([])
    const [originalNotifications, setOriginalNotifications] = useState<Notification[]>(allNotifications)
    const [notificationsCount, setNotificationsCount] = useState(0)
    const [notificationsPageURL, setNotificationsPageURL] = useState('')
    const [hashtags, setHashtags] = useState<Hashtag[]>([])

    const baseUrl = 'http://api.twitter.test'

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

        setOriginalNotifications([])
        setAllNotifications([])

    }, [user])

    // Get all notifications
    const getAllNotifications = (pageURL: string) => {
        ApiClient().get(pageURL)
            .then(res => {
                setAllNotifications(prevNotifications => ([
                    ...prevNotifications,
                    ...res.data.data.notifications
                ]))
                setOriginalNotifications(prevNotifications => ([
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

    const getHashtags = () => {
    ApiClient().get(`/hashtags`)
        .then(res => {
            setHashtags(res.data.data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(hashtags?.length <= 1) {
            getHashtags()
        }
    }, [hashtags?.length]);


    useEffect( () => {
        getAllNotifications('/notifications')
        getHashtags()
    }, [token])

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
                originalNotifications,
                setOriginalNotifications,
                hashtags,
                setHashtags,
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
