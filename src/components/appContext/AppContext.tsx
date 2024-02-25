import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";



interface AppContextType {
    isRegisterOpen: boolean;
    location: Pathname | null;
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    baseUrl: string;
    handleModelOpen: () => void;
    isModelOpen: boolean;
    setIsModelOpen: Dispatch<SetStateAction<boolean>>;
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
    },
    setUser: () => {},
    handleModelOpen: () => null,
    isModelOpen: false,
    setIsModelOpen: () => null,
    baseUrl: '',
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
        ban_status: null,
    })

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
        setIsModelOpen(prev => !prev)
    }

    return (
        <AppContext.Provider value={{isRegisterOpen, location, user, setUser, baseUrl, handleModelOpen, isModelOpen, setIsModelOpen}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
