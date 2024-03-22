import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import ApiClient from "../services/ApiClient.tsx";
import {ClickedTweet, UserInfo} from "../../Interfaces.tsx";

interface AppContextType {
    isRegisterOpen: boolean;
    location: Pathname | null;
    user: UserInfo | null;
    setUser: Dispatch<SetStateAction<UserInfo | null>>;
    baseUrl: string;
    handleModelOpen: () => void;
    isModelOpen: boolean;
    setIsModelOpen: Dispatch<SetStateAction<boolean>>;
    suggestedUsersToFollow: UserInfo[];
    isCommentOpen: boolean;
    setIsCommentOpen: Dispatch<SetStateAction<boolean>>;
    clickedTweet: ClickedTweet;
    setClickedTweet: Dispatch<SetStateAction<ClickedTweet>>
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
            is_followed: null,
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
            id: 0,
        },
    },

    setClickedTweet: () => null

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
        is_followed: null,
        tweets_count: null,
    })
    const [clickedTweet, setClickedTweet] = useState<ClickedTweet>({
        user: {
            id: 0,
            username: '',
            avatar: '',
        },
        tweet: {
            id: 0,
            title: '',
            created_at: ''
        }
    })
    const [suggestedUsersToFollow, setSuggestedUsersToFollow] = useState<UserInfo[]>([])

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
        ApiClient().get('/home')
            .then(res => {
                setSuggestedUsersToFollow(res.data.data.suggested_users)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

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
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
