import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {useLocation} from "react-router";
import ApiClient from "../services/ApiClient.tsx";
import {
    ClickedTweet,
    ClickedTweetDefaultValues,
    Hashtag,
    Notification,
    UserDefaultValues,
    UserInfo,
    FormError,
    Gender, FormErrorsDefaultValues
} from "../../Interfaces.tsx";
import {GroupBase, StylesConfig} from "react-select";

interface AppContextType {
    isRegisterOpen: boolean
    location: Pathname | null
    user: UserInfo | null
    setUser: Dispatch<SetStateAction<UserInfo | null>>
    baseUrl: string
    handleModalOpen: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
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
    showExplorePageHashtags: boolean
    setShowExplorePageHashtags: Dispatch<SetStateAction<boolean>>
    formErrors: FormError
    setFormErrors: Dispatch<SetStateAction<FormError>>
    styles: StylesConfig<OptionType, false, GroupBase<OptionType>>
    displayNotResultsFound: boolean
    setDisplayNotResultsFound: Dispatch<SetStateAction<boolean>>
}

type OptionType = Gender;

export const AppContext = createContext<AppContextType>({
    isRegisterOpen: false,
    location: null,
    user: UserDefaultValues,
    setUser: () => {},
    handleModalOpen: () => null,
    isModalOpen: false,
    setIsModalOpen: () => null,
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
    showExplorePageHashtags: true,
    setShowExplorePageHashtags: () => null,
    formErrors: FormErrorsDefaultValues,
    setFormErrors: () => null,
    styles: {},
    displayNotResultsFound: false,
    setDisplayNotResultsFound: () => null,
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
    const [originalNotifications, setOriginalNotifications] = useState<Notification[]>([])
    const [notificationsCount, setNotificationsCount] = useState(0)
    const [notificationsPageURL, setNotificationsPageURL] = useState('')
    const [hashtags, setHashtags] = useState<Hashtag[]>([])
    const [showExplorePageHashtags, setShowExplorePageHashtags] = useState(true)
    const baseUrl = 'http://api.twitter.test'
    const [displayNotResultsFound, setDisplayNotResultsFound] = useState(false);
    const [formErrors, setFormErrors] = useState<FormError>(FormErrorsDefaultValues)

    useEffect(() => {
        if( location.pathname === '/register' ){
            setIsRegisterOpen(true)
        } else {
            setIsRegisterOpen(false);
        }

        setFormErrors(FormErrorsDefaultValues)

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
    }, [token])

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
                    : (formErrors?.birth_date?.length > 0 && isFocused) ? '2px solid red' : '1px solid #52525b'
            ,

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
                isRegisterOpen,
                location,
                baseUrl,
                user,
                setUser,
                handleModalOpen: handleModelOpen,
                isModalOpen: isModelOpen,
                setIsModalOpen: setIsModelOpen,
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
                showExplorePageHashtags,
                setShowExplorePageHashtags,
                formErrors,
                setFormErrors,
                styles,
                displayNotResultsFound,
                setDisplayNotResultsFound,
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
