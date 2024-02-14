import {HiMiniXMark} from "react-icons/hi2";
import {FaXTwitter} from "react-icons/fa6";
import Home from "./Home.tsx";
import Select, {GroupBase, SingleValue, StylesConfig} from 'react-select'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ApiClient from "../services/ApiClient.tsx";

interface Month {
    value: string
    label: string
    days: number
}
interface Day extends Month {}

interface Year extends Month {}

interface User {
    username: string
    email: string
    password: string
    password_confirmation: string
    date_birth: string
}

interface FormError {
    username: string[]
    email: string[]
    password: string[]
    password_confirmation: string[]
    birth_date: string[]
}


function Register()  {

    const months: Month[] = [
        { value: "january", label: "January", days: 31 },
        { value: "february", label: "February", days: 28 },
        { value: "march", label: "March", days: 31 },
        { value: "april", label: "April", days: 30 },
        { value: "may", label: "May", days: 31 },
        { value: "june", label: "June", days: 30 },
        { value: "july", label: "July", days: 31 },
        { value: "august", label: "August", days: 31 },
        { value: "september", label: "September", days: 30 },
        { value: "october", label: "October", days: 31 },
        { value: "november", label: "November", days: 30 },
        { value: "december", label: "December", days: 31 },
    ]

    const [nameCount, setNameCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDay, setSelectedDay] = useState<Day | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<Month | null>(null)
    const [selectedYear, setSelectedYear] = useState<Year | null>(null)
    const [formErrors, setFormErrors] = useState<FormError>({
        username: [],
        email: [],
        password: [],
        password_confirmation: [],
        birth_date: [],
    })
    const [userCredentials, setUserCredentials] = useState<User>({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        date_birth: ``
    })

    // Handle Submit button (Next btn)
    const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        ApiClient().post('/register', {
            'username': userCredentials.username,
            'email': userCredentials.email,
            'password': userCredentials.password,
            'password_confirmation': userCredentials.password_confirmation,
            'birth_date': userCredentials.date_birth
        })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                setFormErrors(err.response.data.errors)
            })
    }



    // Handle Name count
    useEffect( () => {
        setNameCount(userCredentials?.username?.length)
    }, [userCredentials.username] )

    const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials(prevUserCredentials => ({
            ...(prevUserCredentials || {}),
            [e.target.name]: e.target.value
        }))
    }

    // React Select
    const styles: StylesConfig<Month, false, GroupBase<Month>> = {
        control: (styles, {isFocused, isDisabled}) => ({
            ...styles,
            height: '3.5rem',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'ease-in-out',
            border: '2px solid transparent',
            outline: isFocused ? '2px solid #0284c7' : '1px solid #52525b',
            '&:hover': {
                borderColor: isDisabled ? 'transparent' : 'none', // Disable border color change on hover when disabled
            },
        }),

        placeholder: (defaultStyles, {isFocused}) => ({
            ...defaultStyles,
            height: '100% !important',
            fontSize: '14px',
            color: isFocused ? '#0284c7' : '#52525b',
        }),

        indicatorSeparator: (defaultStyles)=> ({
            ...defaultStyles,
            backgroundColor: 'transparent'
        }),

        dropdownIndicator: (defaultStyles, { isFocused }) => ({
            ...defaultStyles,
            color: isFocused ? '#0284c7' : '#52525b',
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
            border: '1px solid #4a4a4a'
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

    // Handle selected options
    const handleSelectedChange = (selectedOption: SingleValue<Month>): void => {
        if (selectedOption) {
            const selectedMonth: Month = selectedOption as Month;
            setSelectedMonth(selectedMonth);
        } else {
            setSelectedMonth(null);
        }
    }

    const handleDaySelectedChange = (selectedOption: SingleValue<Day>): void => {
        if (selectedOption) {
            const selectedDay: Day = selectedOption as Day;
            setSelectedDay(selectedDay);
        } else {
            setSelectedDay(null);
        }
    }

    const handleYearSelectedChange = (selectedOption: SingleValue<Year>): void => {
        if (selectedOption) {
            const selectedYear: Year = selectedOption as Year;
            setSelectedYear(selectedYear);
        } else {
            setSelectedYear(null);
        }
    }

    // End Handle selected options


    // Handle number of days based on the selected month
    const days: Day[] = [];

    if (selectedMonth?.days){
        for (let i: number = 1; i <= selectedMonth.days; i++){
            days.push({
                value: `${i}`,
                label: `${i}`,
                days: i,
            })
        }
    }

    // Handle years (last 120 year)
    const startYear: number = new Date().getFullYear() - 120;
    const currentYear: number = new Date().getFullYear();

    const years: Year[] = []

    for (let i: number = currentYear; i >= startYear; i--){
        years.push({
            value: `${i}`,
            label: `${i}`,
            days: i,
        })
    }

    // Set the three selected values to 'birth_date' in the userCredentials state
    useEffect( () => {
        setUserCredentials(prevUserCredentials => ({
            ...prevUserCredentials,
            date_birth: `${selectedYear?.value}-${selectedMonth?.label}-${selectedDay?.value}`
        }))
    }, [selectedDay, selectedMonth, selectedYear] )

    // Handle form loading
    setTimeout( ()=>{
        setIsLoading(false)
    }, 1000)

    // Handle collapse form
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/')
        setIsLoading(true)
    }


    console.log(formErrors)

    return (
        <>
            <Home/>
            <div className={`absolute h-[90%] md:w-[42rem] w-fit px-3 md:px-0 flex items-center z-50 animate-slide-down`}>
                <div className={`bg-black p-2 sm:p-4 text-white rounded-2xl relative  md:w-[42rem]`}>
                    <form onSubmit={handleSubmitBtn} className={`${isLoading ? 'invisible' : 'visible'}`}>
                        <header className="flex justify-center">
                            <div className="absolute left-0 top-2 cursor-pointer mx-3 hover:bg-neutral-600/30 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition"
                                onClick={handleClick}
                            >
                                <div className={``}>
                                    <HiMiniXMark/>
                                </div>
                            </div>
                            <div className={`text-4xl`}>
                                <FaXTwitter/>
                            </div>
                        </header>
                        <div className={`${!isLoading ? 'visible ' : 'invisible'} relative `}>
                            <main className={`mt-7 sm:mt-10 px-4 sm:px-16 text-gray-200`}>
                                <h1 className={`text-3xl font-semibold`}>Create your account</h1>
                                <div className={`mt-5 sm:mt-7 flex flex-col gap-y-2 sm:gap-y-3`}>
                                    <div className={`relative`}>
                                        <div className={`flex gap-x-1 absolute right-2 top-2 text-sm text-[#52525b]`}>
                                            <span>{nameCount}</span>
                                            /
                                            <span>50</span>
                                        </div>
                                        <input
                                           maxLength={50}
                                           name={`username`}
                                           value={userCredentials?.username}
                                           onChange={handleInputsChange}
                                           className={`registerInputs h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                           type="text"
                                           placeholder="Username"
                                           disabled={isLoading}
                                           autoComplete="one-time-code"
                                        />
                                        {formErrors?.username && <p className={'text-red-700 font-semibold'}>{formErrors.username[0]}</p>}

                                    </div>
                                        <div>
                                            <input
                                                className={`w-full registerInputs h-14 border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1`}
                                                name={`email`}
                                                value={userCredentials?.email}
                                                type="email"
                                                onChange={handleInputsChange}
                                                placeholder="Email"
                                                disabled={isLoading}
                                                autoComplete="one-time-code"
                                            />
                                            {formErrors?.email && <p className={'text-red-700 font-semibold'}>{formErrors.email[0]}</p>}
                                        </div>

                                        <div>
                                            <input
                                                maxLength={30}
                                                className={`registerInputs h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                                name={`password`}
                                                value={userCredentials?.password}
                                                type="password"
                                                onChange={handleInputsChange}
                                                placeholder="Password"
                                                disabled={isLoading}
                                                autoComplete="one-time-code"
                                            />
                                            {formErrors?.password && <p className={'text-red-700 font-semibold'}>{formErrors?.password[0]}</p>}
                                        </div>

                                        <div>
                                            <input
                                                maxLength={30}
                                                className={`registerInputs h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                                name={`password_confirmation`}
                                                value={userCredentials?.password_confirmation}
                                                type="password"
                                                onChange={handleInputsChange}
                                                placeholder="Confirm Password"
                                                disabled={isLoading}
                                                autoComplete="one-time-code"
                                            />
                                            {formErrors?.password_confirmation && <p className={'text-red-700 font-semibold'}>{formErrors?.password_confirmation[0]}</p>}
                                        </div>





                                </div>

                                <h4 className="mt-7 sm:mt-11 font-semibold">Date of birth</h4>
                                <p className={`text-[#71767b] leading-4`}>This will not be shown publicly. Confirm your own
                                    age, even if this account is for a business, a pet, or something else.</p>

                                <div className={`flex sm:flex-row flex-col justify-center items-center sm:justify-start sm:items-start gap-y-4 sm:gap-y-0 gap-x-3 mt-6`}>
                                    <Select
                                        className={`sm:w-1/2 w-3/4`}
                                        options={months}
                                        isDisabled={isLoading}
                                        placeholder={'Month'}
                                        onChange={handleSelectedChange}
                                        styles={styles}
                                    />


                                    <div className={`sm:w-1/2 w-3/4 flex sm:flex-row flex-col gap-y-4 sm:gap-y-0 gap-x-3`}>
                                        <Select
                                            options={days}
                                            isDisabled={isLoading}
                                            placeholder={'Day'}
                                            className={`sm:w-1/2 w-full`}
                                            noOptionsMessage={()=> 'Select Month'}
                                            onChange={handleDaySelectedChange}
                                            styles={styles}
                                        />

                                        <Select
                                            options={years}
                                            isDisabled={isLoading}
                                            placeholder={'Year'}
                                            className={`sm:w-1/2 w-full`}
                                            onChange={handleYearSelectedChange}
                                            styles={styles}
                                        />
                                    </div>
                                </div>
                                {formErrors?.birth_date && <p className={'text-red-700 font-semibold'}>{formErrors?.birth_date[0]}</p>}

                                <button type={"submit"} className={`bg-white w-full mt-10 sm:mt-20 py-3 rounded-full text-black font-semibold text-lg`}>Create</button>
                            </main>
                        </div>
                    </form>

                    {isLoading &&
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
                            <svg aria-hidden="true"
                                 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#0284c7]"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                        </div>
                    }
                </div>
            </div>
        </>

    )
}

export default Register
