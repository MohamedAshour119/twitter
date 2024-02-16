import {HiMiniXMark} from "react-icons/hi2";
import {FaXTwitter} from "react-icons/fa6";
import {CgSpinnerTwoAlt} from "react-icons/cg";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface User {
    username: string
    email: string
    password: string
}

function Login() {

    const [isLoading, setIsLoading] = useState(true)
    const [loginBtnLoading, setLoginBtnLoading] = useState(false)
    const [userCredentials, setUserCredentials] = useState<User>({
        username: '',
        email: '',
        password: '',
    })

    // Handle collapse form
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/')
        setIsLoading(true)
    }

    // Handle Submit button (Next btn)
    const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
        setLoginBtnLoading(true)
        e.preventDefault();
    }

    // Handle Inputs changes
    const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials(prevUserCredentials => ({
            ...(prevUserCredentials || {}),
            [e.target.name]: e.target.value
        }))
    }

    return (
        <form onSubmit={handleSubmitBtn} className={`${isLoading ? 'invisible' : 'visible'} bg-red-600`}>
            <header className="hidden md:flex justify-center">
                <div
                    className="absolute left-0 top-2 cursor-pointer mx-3 hover:bg-neutral-600/30 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition"
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
                <main className={`mt-3 sm:mt-10 px-4 md:px-16 text-gray-200`}>
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
                        <div className={`relative`}>
                            <input
                                maxLength={50}
                                name={`username`}
                                value={userCredentials?.username}
                                onChange={handleInputsChange}
                                className={`registerInputs h-12 sm:h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                                type="text"
                                placeholder="Username"
                                disabled={isLoading}
                                autoComplete="one-time-code"
                            />
                            {/*{formErrors?.username &&*/}
                            {/*    <p className={'text-red-500 font-semibold'}>{formErrors.username[0]}</p>}*/}

                        </div>
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
                            {/*{formErrors?.email &&*/}
                            {/*    <p className={'text-red-500 font-semibold'}>{formErrors.email[0]}</p>}*/}
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
                            {/*{formErrors?.password &&*/}
                            {/*    <p className={'text-red-500 font-semibold'}>{formErrors?.password[0]}</p>}*/}
                        </div>

                    </div>

                    <button type={"submit"}
                            className={`bg-white w-full relative flex justify-center items-center gap-x-2 py-2 rounded-full text-black font-semibold text-lg`}>
                        <span>Create</span>
                        <CgSpinnerTwoAlt className={`animate-spin size-6 ${loginBtnLoading ? 'visible' : 'invisible'}`}/>
                    </button>
                </main>
            </div>
        </form>
    )
}

export default Login
