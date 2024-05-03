import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import {
    ClickedTweet,
    ClickedTweetDefaultValues,
    UserDefaultValues,
    UserInfo,
    FormError,
    Gender, FormErrorsDefaultValues, Notification
} from "../../Interfaces.tsx";
import {GroupBase, StylesConfig} from "react-select";
import ApiClient from "../services/ApiClient.tsx";
import {useNavigate} from "react-router-dom";

interface AppContextType {
    location: Pathname | null
    user: UserInfo | null
    setUser: Dispatch<SetStateAction<UserInfo | null>>
    baseUrl: string
    handleModalOpen: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    isCommentOpen: boolean
    setIsCommentOpen: Dispatch<SetStateAction<boolean>>
    clickedTweet: ClickedTweet
    setClickedTweet: Dispatch<SetStateAction<ClickedTweet>>
    formErrors: FormError
    setFormErrors: Dispatch<SetStateAction<FormError>>
    styles: StylesConfig<OptionType, false, GroupBase<OptionType>>
    displayNotResultsFound: boolean
    setDisplayNotResultsFound: Dispatch<SetStateAction<boolean>>
    notificationsCount: number
    setNotificationsCount: Dispatch<SetStateAction<number>>
    allNotifications: Notification[]
    setAllNotifications: Dispatch<SetStateAction<Notification[]>>
    originalNotifications: Notification[]
    notificationsPageURL: string | null
    getAllNotifications: (pageUrl: string) => void
    goBack: () => void
}

type OptionType = Gender;

export const AppContext = createContext<AppContextType>({
    location: null,
    user: UserDefaultValues,
    setUser: () => {},
    handleModalOpen: () => null,
    isModalOpen: false,
    setIsModalOpen: () => null,
    isCommentOpen: false,
    setIsCommentOpen: () => null,
    baseUrl: '',
    clickedTweet: ClickedTweetDefaultValues,
    setClickedTweet: () => null,
    formErrors: FormErrorsDefaultValues,
    setFormErrors: () => null,
    styles: {},
    displayNotResultsFound: false,
    setDisplayNotResultsFound: () => null,
    notificationsCount: 0,
    setNotificationsCount: () => null,
    allNotifications: [],
    setAllNotifications: () => null,
    originalNotifications: [],
    notificationsPageURL: null,
    getAllNotifications: () => null,
    goBack: () => null,
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
    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1)
    }

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(UserDefaultValues)
    const [clickedTweet, setClickedTweet] = useState<ClickedTweet>(ClickedTweetDefaultValues)
    const baseUrl = 'http://api.twitter.test'
    const [displayNotResultsFound, setDisplayNotResultsFound] = useState(false);
    const [formErrors, setFormErrors] = useState<FormError>(FormErrorsDefaultValues)
    const [notificationsCount, setNotificationsCount] = useState(0)
    const [allNotifications, setAllNotifications] = useState<Notification[]>([])
    const [originalNotifications, setOriginalNotifications] = useState<Notification[]>([])
    const [notificationsPageURL, setNotificationsPageURL] = useState(null)

    // Handle model open state
    const handleModelOpen = () => {
        setIsModelOpen(false)
        setIsCommentOpen(false)
    }

    // Get all notifications
    const getAllNotifications = (pageURL: string) => {

        ApiClient().get(pageURL)
            .then(res => {
                setAllNotifications(prevState => ([
                    ...prevState,
                    ...res.data.data.notifications
                ]))
                setOriginalNotifications(prevState => ([
                    ...prevState,
                    ...res.data.data.notifications
                ]))
                setNotificationsPageURL(res.data.data.next_page_url)
                setNotificationsCount(res.data.data.notifications_count)

            })
            .catch(err => {
                console.log(err)
            })
    }

    const token = localStorage.getItem('token')

    useEffect( () => {
        if (!localStorage.getItem('token')) {
            setOriginalNotifications([])
            setAllNotifications([])
        }
    }, [user])

    useEffect( () => {
        if (location.pathname === '/notifications' || location.pathname === '/home') {
            getAllNotifications('/notifications')
        }
    }, [notificationsPageURL, token])


    const styles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
        control: (styles, { isFocused, isDisabled }) => ({
            ...styles,
            height: '3.5rem',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'ease-in-out',
            boxShadow: 'none',
            border: '0 solid transparent',
            outline: (formErrors?.birth_date?.length === 0 && isFocused) ? '2px solid #006a9d'
                : (formErrors?.birth_date?.length > 0 && !isFocused) ? '1px solid red'
                    : (formErrors?.birth_date?.length > 0 && isFocused) ? '2px solid red' : '1px solid #52525b',

            '&:hover': {
                borderColor: isDisabled ? 'transparent' : 'none',
            },
        }),

        placeholder: (defaultStyles, {isFocused}) => ({
            ...defaultStyles,
            height: '100% !important',
            fontSize: '14px',
            color: (formErrors?.birth_date?.length === 0 && isFocused) ? '#0284c7'
                : (formErrors?.birth_date?.length > 0 && isFocused) ? 'red' : '#52525b',
        }),

        indicatorSeparator: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: 'transparent'
        }),

        dropdownIndicator: (defaultStyles, {isFocused}) => ({
            ...defaultStyles,
            color: (formErrors?.birth_date?.length === 0 && isFocused) ? '#0284c7'
                : (formErrors?.birth_date?.length > 0 && isFocused) ? 'red' : '#52525b',
            '&:hover': {
                color: isFocused ? '#0284c7' : '#52525b',
            },
        }),

        input: (defaultStyles) => ({
            ...defaultStyles,
            color: 'white',
        }),

        singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: 'white',
        }),

        menu: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: 'black',
            border: '1px solid #4a4a4a',
        }),

        option: (defaultStyles, state) => ({
            ...defaultStyles,
            backgroundColor: state.isSelected ? '#0284c7' : 'black',
            '&:hover': {backgroundColor: state.isFocused ? '#0284c7' : '#52525b'},
        }),

        menuList: (base) => ({
            ...base,
            "::-webkit-scrollbar": {
                width: "4px",
                height: "0px",
            },
            "::-webkit-scrollbar-track": {
                background: "#000000"
            },
            "::-webkit-scrollbar-thumb": {
                background: "#0284c7",
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: "#006a9d"
            }
        })

    }

    return (
        <AppContext.Provider
            value={{
                location,
                baseUrl,
                user,
                setUser,
                handleModalOpen: handleModelOpen,
                isModalOpen: isModelOpen,
                setIsModalOpen: setIsModelOpen,
                isCommentOpen,
                setIsCommentOpen,
                clickedTweet,
                setClickedTweet,
                formErrors,
                setFormErrors,
                styles,
                displayNotResultsFound,
                setDisplayNotResultsFound,
                notificationsCount,
                setNotificationsCount,
                allNotifications,
                setAllNotifications,
                originalNotifications,
                notificationsPageURL,
                getAllNotifications,
                goBack,
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
