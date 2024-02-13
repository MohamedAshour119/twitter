import {createContext, ReactNode, useEffect, useState} from 'react'
import {useLocation} from "react-router";


export const AppContext = createContext<{isRegisterOpen: boolean; location: Pathname | null}> ({isRegisterOpen: false, location: null})

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

    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false)
    const location: Pathname = useLocation();


    useEffect(() => {
        if( location.pathname === '/register' ){
            setIsRegisterOpen(true)
        } else {
            setIsRegisterOpen(false);
        }


    }, [location.pathname]);

    return (
        <AppContext.Provider value={{isRegisterOpen, location}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
