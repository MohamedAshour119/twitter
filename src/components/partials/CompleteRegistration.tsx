import {HiMiniXMark} from "react-icons/hi2";
import {FaXTwitter} from "react-icons/fa6";
import {CgSpinnerTwoAlt} from "react-icons/cg";
import {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../appContext/AppContext.tsx";
import ReactSelect from "../helper/ReactSelect.tsx";
import {Gender} from "../../Interfaces.tsx";
import Select, {GroupBase, SingleValue, StylesConfig} from "react-select";
import {genders} from "../helper/Helper.tsx";
import axios from "axios";
import {toast} from "react-toastify";
import {toastStyle} from "../helper/ToastifyStyle.tsx";

interface Props {
    setIsCompleteRegistrationOpen: Dispatch<SetStateAction<boolean>>
    isCompleteRegistrationOpen: boolean
    githubToken: string
}

function CompleteRegistration(props: Props) {

    const navigate = useNavigate();
    const {
        setUser,
        user,
        setFormErrors,
        formErrors,
        reactSelectStyles,
    } = useContext(AppContext)

    const [isLoading, setIsLoading] = useState(true)
    const [signUpBtnLoading, setSignUpBtnLoading] = useState(false)
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null)
    const handleClick = () => {
        props.setIsCompleteRegistrationOpen(false)
    }

    const sendData = () => {
        const formData = new FormData();

        formData.append('username', user?.user_info.username as string);
        formData.append('email', user?.user_info.email as string);
        formData.append('avatar', user?.user_info.avatar as string);
        formData.append('password', user?.user_info.password as string);
        formData.append('password_confirmation', user?.user_info.password_confirmation as string);
        formData.append('gender', user?.user_info.gender as string);
        formData.append('birth_date', user?.user_info.birth_date as string);

        setSignUpBtnLoading(true)
        axios.post('http://api.twitter.test/api/complete-registration', formData, {headers: {
                Authorization: 'Bearer ' + props.githubToken
            }})
            .then(res=> {
                setUser(prevState => ({
                    ...prevState,
                    user_info: res.data.data.data
                }))
                localStorage.setItem('token', res.data.data.token)
                localStorage.setItem('expires_at', res.data.data.expires_at)
                navigate('/home')
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    setFormErrors(err.response.data.errors || { message: 'Registration failed. Please try again.' });

                    toast.error("Can't sign up, this email already exist", toastStyle)
                }
            })
            .finally(() => setSignUpBtnLoading(false))
    }

    // Handle Submit button (Next btn)
    const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
        setSignUpBtnLoading(true)
        e.preventDefault();
        sendData();
    }

    // Handle Inputs changes
    const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(prevState => ({
            ...prevState,
            user_info: {
                ...prevState.user_info,
                [e.target.name]: e.target.value
            }
        }))
    }

    // Handle loading form
    setTimeout( ()=> {
        setIsLoading(false)
    }, 1000 )

    const completeRegistrationRef = useRef<HTMLDivElement>(null)
    useEffect( () => {
        const handleClickOutside = (e: MouseEvent) => {
            if(!completeRegistrationRef.current?.contains(e.target as Node)){
                props.setIsCompleteRegistrationOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    },[])

    const handleGenderSelectedChange = (selectedOption: SingleValue<Gender>): void => {
        if(selectedOption) {
            setSelectedGender(selectedOption as Gender);
            setUser(prevState => ({
                ...prevState,
                user_info: {
                    ...prevState.user_info,
                    gender: (selectedOption as Gender).value
                }
            }));
        } else {
            setSelectedGender(null);
            setUser(prevState => ({
                ...prevState,
                user_info: {
                    ...prevState.user_info,
                    gender: ''
                }
            }));
        }
    }

    type OptionType = Gender;
    const genderControlStyle: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
        control: (styles, { isFocused, isDisabled }) => ({
            ...styles,
            height: '3.5rem',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'ease-in-out',
            boxShadow: 'none',
            border: '0 solid transparent',
            outline: (formErrors?.gender?.length === 0 && isFocused) ? '2px solid #006a9d'
                : (formErrors?.gender?.length > 0 && !isFocused) ? '1px solid red'
                    : (formErrors?.gender?.length > 0 && isFocused) ? '2px solid red' : '1px solid #52525b',

            '&:hover': {
                borderColor: isDisabled ? 'transparent' : 'none',
            },
        }),

        placeholder: (defaultStyles, {isFocused}) => ({
            ...defaultStyles,
            height: '100% !important',
            fontSize: '14px',
            color: (formErrors?.gender?.length === 0 && isFocused) ? '#0284c7'
                : (formErrors?.gender?.length > 0 && isFocused) ? 'red' : '#52525b',
        }),

        dropdownIndicator: (defaultStyles, {isFocused}) => ({
            ...defaultStyles,
            color: (formErrors?.gender?.length === 0 && isFocused) ? '#0284c7'
                : (formErrors?.gender?.length > 0 && isFocused) ? 'red' : '#52525b',
            '&:hover': {
                color: isFocused ? '#0284c7' : '#52525b',
            },
        }),

    };

    const genderStyles = {
        ...reactSelectStyles,
        ...genderControlStyle
    }


    return (
        <div className={`flex ${props.isCompleteRegistrationOpen ? 'bg-[#415d757a] overflow-y-hidden' : 'bg-black'} w-screen h-svh absolute top-40 left-1/2 -translate-x-1/2 -translate-y-40 justify-center py-6 px-4 overflow-y-scroll z-50`}>
            <div ref={completeRegistrationRef} className={`bg-black container 2xl:w-2/4 lg:w-3/4 w-full rounded-xl h-fit relative top-1/2 -translate-y-1/2`}>

                {isLoading &&
                    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
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

                <form onSubmit={handleSubmitBtn} className={`${isLoading ? 'invisible' : 'visible'} py-10 px-10`}>
                    <header className="hidden md:flex justify-center relative text-neutral-100">
                        <div
                            onClick={handleClick}
                            className="absolute -left-3 cursor-pointer hover:bg-neutral-600/30 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                            <HiMiniXMark/>
                        </div>

                        <div className={`text-4xl`}>
                            <FaXTwitter/>
                        </div>
                    </header>
                    <div className={`${!isLoading ? 'visible ' : 'invisible'} relative `}>
                        <main className={`text-gray-200 md:mt-6`}>
                            <div className={`flex items-center justify-between`}>
                                <h1 className={`sm:text-3xl text-xl font-semibold`}>Sign up</h1>
                                <div
                                    className="flex md:hidden cursor-pointer hover:bg-neutral-600/30 text-2xl justify-center items-center rounded-full h-9 w-9 transition"
                                    onClick={handleClick}
                                >
                                    <div className={``}>
                                        <HiMiniXMark/>
                                    </div>
                                </div>
                            </div>
                            <div className={`mt-5 sm:mt-7 flex flex-col gap-y-2 sm:gap-y-3`}>
                                <h4 className={`mt-8 font-semibold`}>Password</h4>
                                <div>
                                    <input
                                        className={`${formErrors?.password?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : 'border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} w-full registerInputs h-14 border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1`}
                                        name={`password`}
                                        type={'password'}
                                        value={user?.user_info.password}
                                        onChange={handleInputsChange}
                                        placeholder="Password"
                                        disabled={isLoading}
                                        autoComplete="one-time-code"
                                    />
                                    {formErrors?.password && <p className={'text-red-500 font-semibold'}>{formErrors.password}</p>}
                                </div>

                                <div>
                                    <input
                                        maxLength={30}
                                        className={`${formErrors?.password_confirmation?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : 'border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} w-full registerInputs h-14 border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1`}
                                        name={`password_confirmation`}
                                        value={user?.user_info?.password_confirmation}
                                        type="password"
                                        onChange={handleInputsChange}
                                        placeholder="Confirm Password"
                                        disabled={isLoading}
                                        autoComplete="one-time-code"
                                    />
                                    {formErrors?.password_confirmation && <p className={'text-red-500 font-semibold'}>{formErrors?.password_confirmation}</p>}
                                </div>
                            </div>

                            <h4 className={`mt-8 font-semibold`}>Gender</h4>
                            <div className={`mt-3`}>
                                <Select
                                    options={genders}
                                    isDisabled={isLoading}
                                    placeholder={'Gender'}
                                    onChange={handleGenderSelectedChange}
                                    styles={genderStyles}
                                />
                                {formErrors?.gender &&
                                    <p className={`text-red-500 font-semibold`}>{formErrors?.gender}</p>}
                            </div>

                            <ReactSelect setIsCompleteRegistrationOpen={props.setIsCompleteRegistrationOpen} isLoading={isLoading} selectedGender={selectedGender}/>


                            <button type={"submit"}
                                    className={`${signUpBtnLoading ? 'bg-neutral-200' : 'bg-neutral-100'} sm:translate-x-1/2 sm:w-1/2 w-full relative flex justify-center items-center mt-6 gap-x-2 py-2 rounded-full text-black font-semibold text-lg`}>
                                <span className={`flex gap-x-2`}>
                                    {signUpBtnLoading ? 'Signing up' :  'Sign up'}
                                    <CgSpinnerTwoAlt className={`animate-spin size-6 ${signUpBtnLoading ? 'block' : 'hidden'}`}/>
                                </span>
                            </button>

                        </main>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CompleteRegistration
