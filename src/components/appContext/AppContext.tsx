import {createContext, ReactNode, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import * as React from "react";


export const AppContext = createContext<{
    isRegisterOpen: boolean;
    location: Pathname | null;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}>({
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

    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const location: Pathname = useLocation();
    const [user, setUser] = useState<User>({
        id: null,
        username: '',
        email: '',
        gender: '',
        avatar: '',
        birth_date: '',
        ban_status: null,
    })


    useEffect(() => {
        if( location.pathname === '/register' ){
            setIsRegisterOpen(true)
        } else {
            setIsRegisterOpen(false);
        }


    }, [location.pathname]);

    return (
        <AppContext.Provider value={{isRegisterOpen, location, user, setUser}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
