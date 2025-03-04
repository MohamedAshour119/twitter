import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {
    TweetInfo,
    UserDefaultValues,
    UserInfo,
    FormError,
    Gender, FormErrorsDefaultValues, tweetDefaultValues
} from "../../Interfaces.tsx";
import {GroupBase, StylesConfig} from "react-select";
import {useNavigate} from "react-router-dom";

interface AppContextType {
    user: UserInfo | null
    setUser: Dispatch<SetStateAction<UserInfo>>
    handleModalOpen: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    isCommentOpen: boolean
    setIsCommentOpen: Dispatch<SetStateAction<boolean>>
    clickedTweet: TweetInfo
    setClickedTweet: Dispatch<SetStateAction<TweetInfo>>
    formErrors: FormError
    setFormErrors: Dispatch<SetStateAction<FormError>>
    reactSelectStyles: StylesConfig<OptionType, false, GroupBase<OptionType>>
    goBack: () => void
    isShowEditInfoModal: boolean
    setIsShowEditInfoModal: Dispatch<SetStateAction<boolean>>
    isSearched: boolean | null
    setIsSearched: Dispatch<SetStateAction<boolean | null>>
    displayNotResultsFound: boolean
    setDisplayNotResultsFound: Dispatch<SetStateAction<boolean>>
    isSidebarSearchLoading: boolean
    setIsSidebarSearchLoading: Dispatch<SetStateAction<boolean>>
}

type OptionType = Gender;

export const AppContext = createContext<AppContextType>({
    user: UserDefaultValues,
    setUser: () => {},
    handleModalOpen: () => null,
    isModalOpen: false,
    setIsModalOpen: () => null,
    isCommentOpen: false,
    setIsCommentOpen: () => null,
    clickedTweet: tweetDefaultValues,
    setClickedTweet: () => null,
    formErrors: FormErrorsDefaultValues,
    setFormErrors: () => null,
    reactSelectStyles: {},
    goBack: () => null,
    isShowEditInfoModal: false,
    setIsShowEditInfoModal: () => null,
    isSearched: true,
    setIsSearched: () => null,
    displayNotResultsFound: false,
    setDisplayNotResultsFound: () => null,
    isSidebarSearchLoading: false,
    setIsSidebarSearchLoading: () => null,
});

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider = ({children}: AppProviderProps) => {
    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1)
    }

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [user, setUser] = useState<UserInfo>(UserDefaultValues)
    const [clickedTweet, setClickedTweet] = useState<TweetInfo>(tweetDefaultValues)
    const [formErrors, setFormErrors] = useState<FormError>(FormErrorsDefaultValues)
    const [isSearched, setIsSearched] = useState<boolean | null>(null);
    const [isShowEditInfoModal, setIsShowEditInfoModal] = useState(false)
    const [displayNotResultsFound, setDisplayNotResultsFound] = useState(false);
    const [isSidebarSearchLoading, setIsSidebarSearchLoading] = useState(false);

    // Handle model open state
    const handleModelOpen = () => {
        setIsModelOpen(false)
        setIsCommentOpen(false)
    }

    const token = localStorage.getItem('token')

    useEffect( () => {
        if (!localStorage.getItem('token')) {
            setUser(prevState => ({
                ...prevState,
                originalNotifications: [],
                allNotifications: {
                    notifications_info: [],
                    notifications_count: null
                },
            }))
        }
    }, [token])




    const reactSelectStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
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
                reactSelectStyles,
                goBack,
                isShowEditInfoModal,
                setIsShowEditInfoModal,
                isSearched,
                setIsSearched,
                displayNotResultsFound,
                setDisplayNotResultsFound,
                isSidebarSearchLoading,
                setIsSidebarSearchLoading,
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
