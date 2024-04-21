import {HiMiniXMark} from "react-icons/hi2";
import {FaXTwitter} from "react-icons/fa6";
import Select, {GroupBase, SingleValue, StylesConfig} from 'react-select'
import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import ApiClient from "../services/ApiClient.tsx";
import {CgSpinnerTwoAlt} from "react-icons/cg";
import SuccessfulRegister from "../layouts/SuccessfulRegister.tsx";
import {AppContext} from "../appContext/AppContext.tsx";
import ReactSelect from "../helper/ReactSelect.tsx";
import {Gender, RegisterUser} from "../../Interfaces.tsx";

function Register() {

    const {setFormErrors, formErrors, styles} = useContext(AppContext)

    const genders: Gender[] = [
        {value: "male", label: "Male"},
        {value: "female", label: "Female"}
    ]

    const [nameCount, setNameCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    const [createBtnLoading, setCreateBtnLoading] = useState(false)
    const [successfulRegister, setSuccessfulRegister] = useState(false)
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null)

    const [userCredentials, setUserCredentials] = useState<RegisterUser>({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        gender: '',
        date_birth: '',
        avatar: '',
    })

    // Send request with register data
    const sendRequest = () => {

        const formData = new FormData();
        formData.append('username', userCredentials.username);
        formData.append('email', userCredentials.email);
        formData.append('password', userCredentials.password);
        formData.append('password_confirmation', userCredentials.password_confirmation);
        formData.append('gender', userCredentials.gender);
        formData.append('birth_date', userCredentials.date_birth);

        if(userCredentials.avatar instanceof File){
            formData.append('avatar', userCredentials.avatar as Blob)
        }

        ApiClient().post('/register', formData)
            .then(() => {
                setSuccessfulRegister(true)
            })
            .catch(err => {
                setSuccessfulRegister(false)
                setFormErrors(err.response.data.errors)
            })
            .finally(() => setCreateBtnLoading(false))
    }


    // Handle Submit button
    const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
        setCreateBtnLoading(true)
        e.preventDefault();
        sendRequest();
    }


    // Handle Name count
    useEffect(() => {
        setNameCount(userCredentials?.username?.length)
    }, [userCredentials.username])

    // Handle Inputs changes
    const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const {name, value, files} = e.target;

        if(name !== 'avatar'){
            setUserCredentials(prevUserCredentials => ({
                ...prevUserCredentials,
                [name]: value
            }))
        } else {
            if(files && files.length > 0){
                const file = files[0]
                setUserCredentials(prevUserCredentials => ({
                    ...prevUserCredentials,
                    avatar: file
                }));
            }
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
        ...styles,
        ...genderControlStyle
    }

    const handleGenderSelectedChange = (selectedOption: SingleValue<Gender>): void => {
        if(selectedOption) {
            setSelectedGender(selectedOption as Gender);
        } else {
            setSelectedGender(null)
        }
    }

    // Handle form loading
    setTimeout(() => {
        setIsLoading(false)
    }, 1000)

    // Handle collapse form
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/')
        setIsLoading(true)
    }


    return (
        <>
            <div className={`md:w-full h-screen flex ${successfulRegister ? 'items-center' : 'items-baseline'}  justify-center py-6 px-4 overflow-y-scroll bg-gradient-to-br from-blue-600 to-[#a8dbf9] z-50`}>
                <div className={`bg-black p-2 sm:p-4 text-white rounded-2xl md:w-[42rem] w-full`}>
                    <form onSubmit={handleSubmitBtn} className={`${isLoading ? 'invisible' : 'visible'} ${successfulRegister ? 'hidden' : 'block'}`}>
                        <header className="flex justify-center relative">
                            <div
                                className="absolute left-0 top-0 cursor-pointer mx-3 hover:bg-neutral-600/30 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition"
                                onClick={handleClick}
                            >
                                <div className={``}>
                                    <HiMiniXMark/>
                                </div>
                            </div>
                            <FaXTwitter className={`size-10`}/>
                        </header>
                        <div className={`${!isLoading ? 'visible ' : 'invisible'} relative `}>
                            <main className={`mt-8 px-6 text-gray-200`}>
                                <div className={`flex items-center justify-between`}>
                                    <h1 className={`sm:text-3xl text-xl font-semibold`}>Create your account</h1>
                                </div>
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
                                            className={`${formErrors?.username?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : ' border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} h-14 w-full border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                            type="text"
                                            placeholder="Username"
                                            disabled={isLoading}
                                            autoComplete="one-time-code"
                                        />
                                        {formErrors?.username &&
                                            <p className={'text-red-500 font-semibold'}>{formErrors?.username}</p>}

                                    </div>
                                    <div>
                                        <input
                                            className={`${formErrors?.email?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : 'border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} w-full registerInputs h-14 border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1`}
                                            name={`email`}
                                            value={userCredentials?.email}
                                            onChange={handleInputsChange}
                                            placeholder="Email"
                                            disabled={isLoading}
                                            autoComplete="one-time-code"
                                        />
                                        {formErrors?.email &&
                                            <p className={'text-red-500 font-semibold'}>{formErrors?.email}</p>}
                                    </div>

                                    <div>
                                        <input
                                            maxLength={30}
                                            className={`${formErrors?.password?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : 'border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 '} h-14 w-full border focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                            name={`password`}
                                            value={userCredentials?.password}
                                            type="password"
                                            onChange={handleInputsChange}
                                            placeholder="Password"
                                            disabled={isLoading}
                                            autoComplete="one-time-code"
                                        />
                                        {formErrors?.password &&
                                            <p className={'text-red-500 font-semibold'}>{formErrors?.password}</p>}
                                    </div>

                                    <div>
                                        <input
                                            maxLength={30}
                                            className={`${formErrors?.password_confirmation?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : 'border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} h-14 w-full border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                            name={`password_confirmation`}
                                            value={userCredentials?.password_confirmation}
                                            type="password"
                                            onChange={handleInputsChange}
                                            placeholder="Confirm Password"
                                            disabled={isLoading}
                                            autoComplete="one-time-code"
                                        />
                                        {formErrors?.password_confirmation &&
                                            <p className={'text-red-500 font-semibold'}>{formErrors?.password_confirmation}</p>}
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

                                <h4 className="mt-8 font-semibold">Date of birth</h4>

                                <ReactSelect isLoading={isLoading} setUserCredentials={setUserCredentials} selectedGender={selectedGender}/>

                                <div className={`mt-8`}>
                                    <h1 className={`font-semibold`}>Profile picture</h1>

                                    <div className="flex gap-x-2 mt-3">
                                        <label
                                            className={`flex flex-col items-center justify-center w-36 h-36 rounded-full text-neutral-100 ${userCredentials?.avatar ? 'border-0 bg-transparent' : 'border-2 bg-gray-700 hover:bg-gray-600'} border-gray-500 border-dashed cursor-pointer transition`}>
                                            <div className={`absolute ${!userCredentials?.avatar ? 'invisible' : 'visible'}`}>
                                                <img className={`w-36 h-36 rounded-full border-2 border-dashed border-gray-500 hover:border-gray-400 transition object-cover`} src={userCredentials?.avatar ? URL.createObjectURL(userCredentials?.avatar as File) : ''} alt=""/>
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-8 h-8"
                                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-center text-sm "><span
                                                    className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                            </div>
                                            <input name={`avatar`} value={userCredentials?.avatar ? '' : undefined} onChange={handleInputsChange} type="file" className="hidden"/>
                                        </label>
                                        <p className="text-xs ">SVG, PNG, JPG or GIF (Max size: 1 mb)</p>
                                    </div>
                                    {formErrors?.avatar &&
                                        <p className={`text-red-500 font-semibold`}>{formErrors?.avatar}</p>}
                                </div>

                                <button type={"submit"}
                                        className={`${createBtnLoading ? 'bg-neutral-200' : 'bg-neutral-100'} sm:translate-x-1/2 sm:w-1/2 w-full relative flex justify-center items-center mt-6 gap-x-2 py-2 rounded-full text-black font-semibold text-lg`}>
                                    <span className={`flex gap-x-2`}>
                                        {createBtnLoading ? 'Creating' :  'Create'}
                                        <CgSpinnerTwoAlt className={`animate-spin size-6 ${createBtnLoading ? 'block' : 'hidden'}`}/>
                                    </span>
                                </button>

                                <div className={`sm:translate-x-1/2 sm:w-1/2 w-full block mt-4 text-center`}>
                                    Already have account? <Link to={'/login'} className={`text-sky-600 font-semibold hover:text-sky-400 transition`}>Sign in</Link>
                                </div>
                            </main>
                        </div>
                    </form>

                    {/* Show successful registration component */}
                    {successfulRegister && <SuccessfulRegister/>}

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
