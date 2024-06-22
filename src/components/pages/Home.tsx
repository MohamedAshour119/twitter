import {FaXTwitter} from "react-icons/fa6";
import {Link, useNavigate} from "react-router-dom";
import Footer from "../partials/Footer.tsx";
import {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import Register from "../partials/Register.tsx";
import Login from "../partials/Login.tsx";
import {AppContext} from "../appContext/AppContext.tsx";
import {FormErrorsDefaultValues} from "../../Interfaces.tsx";
import ResetPasswordLink from "../partials/ResetPasswordLink.tsx";
import ResetPasswordForm from "../partials/ResetPasswordForm.tsx";
import apiClient from "../services/ApiClient.tsx";
import SpinLoader from "../helper/SpinLoader.tsx";
import {FaGithub} from "react-icons/fa";
import CompleteRegistration from "../partials/CompleteRegistration.tsx";

interface Props {
    setIsResetPasswordOpen: Dispatch<SetStateAction<boolean>>
    isResetPasswordOpen: boolean
}
function Home(props: Props) {

    const {setFormErrors} = useContext(AppContext)

    const [isRegisterModelOpen, setIsRegisterModelOpen] = useState(false)
    const [isLoginModelOpen, setIsLoginModelOpen] = useState(false)
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
    const [isCompleteRegistrationOpen, setIsCompleteRegistrationOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setFormErrors(FormErrorsDefaultValues)
    }, [isLoginModelOpen, isRegisterModelOpen]);


    // Github login
    const [isVisible, setIsVisible] = useState(true)
    const homeParent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        const codeParam = query.get('code')
        if (codeParam) {
            if (homeParent.current) {
                homeParent.current.classList.add('hidden');
            }
            setIsVisible(false)
            apiClient().get(`/auth/callback?code=${codeParam}`)
                .then(res => {
                    // localStorage.setItem('token', res.data.token);
                    navigate('/')
                    homeParent.current?.classList.remove('hidden');
                    setIsVisible(true)
                    setIsLoginModelOpen(true)
                })
                .catch(error => {
                    console.error('Error logging in with GitHub', error);
                });
        }
    }, []);



    const client_id = 'Ov23lie2Z2ZEXaL3qWFt'
    const loginWithGithub = () => {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=${client_id}&scope=user:email`);
    }

    return (
        <>
            {!isVisible && (
                <div className={`translate-y-80`}>
                    <SpinLoader/>
                </div>
            )}
            <div ref={homeParent}>
                {/* Register modal */}
                {isRegisterModelOpen && (
                    <Register
                        setIsRegisterModelOpen={setIsRegisterModelOpen}
                        isRegisterModelOpen={isRegisterModelOpen}
                        setIsLoginModelOpen={setIsLoginModelOpen}
                    />
                )}

                {/* Login modal */}
                {isLoginModelOpen && (
                    <Login
                        setIsLoginModelOpen={setIsLoginModelOpen}
                        isLoginModelOpen={isLoginModelOpen}
                        setIsRegisterModelOpen={setIsRegisterModelOpen}
                        setIsResetPasswordOpen={setIsResetPasswordOpen}
                    />
                )}

                {/* Password reset link modal */}
                {isResetPasswordOpen && (
                    <ResetPasswordLink
                        setIsResetPasswordOpen={setIsResetPasswordOpen}
                        isResetPasswordOpen={isResetPasswordOpen}
                    />
                )}

                {/* Password reset form modal */}
                {props.isResetPasswordOpen && (
                    <ResetPasswordForm
                        setIsResetPasswordFormOpen={props.setIsResetPasswordOpen}
                        isResetPasswordFormOpen={props.isResetPasswordOpen}
                        setIsLoginModelOpen={setIsLoginModelOpen}
                    />
                )}

                {/* Complete Registration form modal */}
                {isCompleteRegistrationOpen && (
                    <CompleteRegistration
                        isCompleteRegistrationOpen={isCompleteRegistrationOpen}
                        setIsCompleteRegistrationOpen={setIsCompleteRegistrationOpen}
                    />
                )}

                <div
                    className={`grid grid-cols-1 w-full h-screen items-end justify-center text-zinc-200 ${
                        isRegisterModelOpen || isLoginModelOpen ? 'opacity-30 pointer-events-none' : ''
                    }`}
                >
                    <div className={`flex flex-col md:flex-row justify-around`}>
                        <div className="text-[3rem] md:text-[23.5rem] w-full md:w-auto flex justify-center">
                            <FaXTwitter />
                        </div>
                        <div className="w-full md:w-auto flex flex-col items-center md:block">
                            <h1 className="text-4xl mt-12 md:mt-0 md:text-5xl lg:text-7xl font-bold">Happening now</h1>

                            <div className="max-w-[21rem] flex flex-col items-center md:block">
                                <h6 className="mt-12 text-3xl font-bold">Join today.</h6>

                                <button
                                    onClick={() => setIsRegisterModelOpen(true)}
                                    className={`block text-center bg-sky-500 w-full py-3 rounded-3xl text-gray-100 mt-2 font-semibold hover:bg-sky-600 transition`}
                                >
                                    Create account
                                </button>

                                <button
                                    onClick={loginWithGithub}
                                    className={`relative block text-center bg-zinc-100 w-full py-3 rounded-3xl text-gray-900 mt-2 font-semibold hover:bg-zinc-200 transition`}
                                >
                                    <FaGithub className={`absolute size-6 top-1/2 -translate-y-1/2 left-14`}/>
                                    Sign up with Github
                                </button>

                                <p className="text-xs text-[#71767b] mt-1">
                                    By signing up, you agree to the
                                    <Link to="/explore" className="ml-1 text-sky-600">
                                        Terms of Service
                                    </Link>{' '}
                                    and
                                    <Link to="/privacy-policy" className="ml-1 text-sky-600">
                                        Privacy Policy
                                    </Link>
                                    ,including
                                    <Link to="/cooke-use" className="ml-1 text-sky-600">
                                        Cookie Use.
                                    </Link>
                                </p>

                                <h3 className="mt-14 text-lg font-semibold">Already have an account?</h3>
                                <button
                                    onClick={() => setIsLoginModelOpen(true)}
                                    className="block text-center border border-gray-500 hover:bg-sky-500/10 w-full py-3 rounded-3xl text-sky-600 mt-4 font-semibold transition"
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )

}



export default Home
