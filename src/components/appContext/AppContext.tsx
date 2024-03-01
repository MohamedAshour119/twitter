import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import ApiClient from "../services/ApiClient.tsx";

interface TweetInfo {
    user: {
        username: string
        avatar: string
    },
    tweet: {
        title: string;
        user_id: number;
        image: string;
        video: string;
        updated_at: string;
        created_at: string;
        id: number;
    };
    reactions: number;
}
interface AppContextType {
    isRegisterOpen: boolean;
    location: Pathname | null;
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    baseUrl: string;
    handleModelOpen: () => void;
    isModelOpen: boolean;
    setIsModelOpen: Dispatch<SetStateAction<boolean>>;
    allUserTweets: TweetInfo[]
    setAllUserTweets: Dispatch<SetStateAction<TweetInfo[]>>
    suggestedUsersToFollow: SuggestedUsersToFollow[]
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
        created_at: ''
    },
    setUser: () => {},
    handleModelOpen: () => null,
    isModelOpen: false,
    setIsModelOpen: () => null,
    baseUrl: '',
    setAllUserTweets: () => null,
    allUserTweets: [{
        user: {
            username: '',
            avatar: ''
        },
        tweet: {
            title: '',
            user_id: 0,
            image: '',
            video: '',
            updated_at: '',
            created_at: '',
            id: 0
        },
        reactions: 0,
    }],
    suggestedUsersToFollow: [
        {
            avatar: '',
            ban_status: null,
            birth_date: '',
            email: '',
            gender: '',
            id: null,
            username: '',
            created_at: '',
            updated_at: '',
            is_followed: false
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

interface User {
    id: number | null
    username: string
    email: string
    gender: string
    avatar: string
    birth_date: string
    ban_status: number | null
    created_at: string
}

interface SuggestedUsersToFollow {
    avatar: string | null
    ban_status: number | null
    birth_date: string
    email: string
    gender: string
    id: number | null
    username: string
    created_at: string
    updated_at: string
    is_followed: boolean
}

const AppProvider = ({children}: AppProviderProps) => {

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const location: Pathname = useLocation();
    const [user, setUser] = useState<User | null>({
        id: null,
        username: '',
        email: '',
        gender: '',
        avatar: '',
        birth_date: '',
        created_at: '',
        ban_status: null,
    })
    const [allUserTweets, setAllUserTweets] = useState<TweetInfo[]>([]);
    const [suggestedUsersToFollow, setSuggestedUsersToFollow] = useState<SuggestedUsersToFollow[]>([])

    const baseUrl = 'http://api.twitter.test'

    useEffect(() => {
        if( location.pathname === '/register' ){
            setIsRegisterOpen(true)
        } else {
            setIsRegisterOpen(false);
        }


    }, [location.pathname]);

    // Sort tweets based on created_at in descending order
    allUserTweets.sort((a, b) => new Date(b.tweet.created_at).getTime() - new Date(a.tweet.created_at).getTime());


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
        <AppContext.Provider value={{isRegisterOpen, location, user, setUser, baseUrl, handleModelOpen, isModelOpen, setIsModelOpen, allUserTweets, setAllUserTweets, suggestedUsersToFollow}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
