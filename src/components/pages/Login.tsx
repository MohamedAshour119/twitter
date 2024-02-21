import {HiMiniXMark} from "react-icons/hi2";
import {FaXTwitter} from "react-icons/fa6";
import {CgSpinnerTwoAlt} from "react-icons/cg";
import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ApiClient from "../services/ApiClient.tsx";
import {AppContext} from "../appContext/AppContext.tsx";

interface User {
    email: string
    password: string
}

interface FormError {
    email: string[]
    password: string[]
}

function Login() {

    const {setUser} = useContext(AppContext)

    const [isLoading, setIsLoading] = useState(true)
    const [loginBtnLoading, setLoginBtnLoading] = useState(false)
    const [userCredentials, setUserCredentials] = useState<User>({
        email: '',
        password: '',
    })
    const [formErrors, setFormErrors] = useState<FormError>({
        email: [],
        password: [],
    })
    const [wrongCredentialsMsg, setWrongCredentialsMsg] = useState("")

    // Handle collapse form
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/')
        setIsLoading(true)
    }

    // Send request with login data
    const sendData = () => {
        const formData = new FormData();

        formData.append('email', userCredentials.email);
        formData.append('password', userCredentials.password);

        setLoginBtnLoading(true)

        ApiClient().post('/login', formData)
            .then(res=> {
                setLoginBtnLoading(false)
                setUser(res.data.data.data)
                localStorage.setItem('token', res.data.data.token)
                navigate('/home')
            })
            .catch((err) => {
                setFormErrors(err.response.data.errors)
                setWrongCredentialsMsg(err.response.data.message)

                setLoginBtnLoading(false)
            })
    }

    // Handle Submit button (Next btn)
    const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
        setLoginBtnLoading(true)
        e.preventDefault();
        sendData();
    }

    // Handle Inputs changes
    const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials(prevUserCredentials => ({
            ...prevUserCredentials,
            [e.target.name]: e.target.value
        }))
    }

    // Handle loading form
    setTimeout( ()=> {
        setIsLoading(false)
    }, 1000 )

    return (
        <div className={`bg-gradient-to-br from-blue-600 to-[#a8dbf9] px-4 flex justify-center items-center h-screen`}>
            <div className={`bg-black container 2xl:w-2/4 lg:w-3/4 w-full rounded-xl`}>
                <form onSubmit={handleSubmitBtn} className={`${isLoading ? 'invisible' : 'visible'} py-10 px-10`}>
                    <header className="hidden md:flex justify-center relative text-neutral-100">
                        <div onClick={handleClick} className="absolute -left-3 cursor-pointer hover:bg-neutral-600/30 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                            <HiMiniXMark/>
                        </div>

                        <div className={`text-4xl`}>
                            <FaXTwitter/>
                        </div>
                    </header>
                    <div className={`${!isLoading ? 'visible ' : 'invisible'} relative `}>
                        <main className={`text-gray-200 md:mt-6`}>
                            <div className={`flex items-center justify-between`}>
                                <h1 className={`sm:text-3xl text-xl font-semibold`}>Login</h1>
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
                                <div>
                                    <input
                                        className={`w-full registerInputs h-12 sm:h-14 border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1`}
                                        name={`email`}
                                        value={userCredentials?.email}
                                        onChange={handleInputsChange}
                                        placeholder="Email"
                                        disabled={isLoading}
                                        autoComplete="one-time-code"
                                    />
                                    {formErrors?.email && <p className={'text-red-500 font-semibold'}>{formErrors.email}</p>}
                                </div>

                                <div>
                                    <input
                                        maxLength={30}
                                        className={`registerInputs h-12 sm:h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                        name={`password`}
                                        value={userCredentials?.password}
                                        type="password"
                                        onChange={handleInputsChange}
                                        placeholder="Password"
                                        disabled={isLoading}
                                        autoComplete="one-time-code"
                                    />
                                    {formErrors?.password && <p className={'text-red-500 font-semibold'}>{formErrors?.password}</p>}
                                </div>
                            </div>
                            {(!formErrors.email && !formErrors.password) && <p className={'text-red-500 font-semibold'}>{wrongCredentialsMsg}</p>}


                            <button type={"submit"}
                                    className={`${loginBtnLoading ? 'bg-neutral-200' : 'bg-neutral-100'} sm:translate-x-1/2 sm:w-1/2 w-full relative flex justify-center items-center mt-6 gap-x-2 py-2 rounded-full text-black font-semibold text-lg`}>
                                <span className={`flex gap-x-2`}>
                                    {loginBtnLoading ? 'Logging in' :  'Login'}
                                    <CgSpinnerTwoAlt className={`animate-spin size-6 ${loginBtnLoading ? 'block' : 'hidden'}`}/>
                                </span>
                            </button>

                            <div className={`sm:translate-x-1/2 sm:w-1/2 w-full block mt-4 text-center`}>
                                Don't have account? <Link to={'/register'} className={`text-sky-600 font-semibold hover:text-sky-400 transition`}>Create one</Link>
                            </div>
                        </main>
                    </div>
                </form>
            </div>

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
    )
}

export default Login
