import {JSX} from 'react'
import {FaXTwitter} from "react-icons/fa6";
import {Link} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";

function Home(): JSX.Element {

    return (
        <div className="flex md:flex-row flex-col px-10 w-full md: items-center justify-between text-zinc-200 mt-24">
            <div className="text-[3rem] md:text-[23.5rem] w-full md:w-auto flex justify-center">
                <FaXTwitter/>
            </div>

            <div className="w-full md:w-auto flex flex-col items-center md:block">
                <h1 className="text-4xl mt-12 md:mt-0 md:text-5xl lg:text-7xl font-bold">Happening now</h1>

                <div className="max-w-[21rem] flex flex-col items-center md:block">
                    <h6 className="mt-12 text-3xl font-bold">Join today.</h6>
                    <button className="flex items-center justify-center bg-white text-black/85 font-semibold w-full rounded-3xl mt-6 py-3 gap-x-2 hover:bg-gray-100 transition">
                        <div className="text-lg">
                            <FcGoogle />
                        </div>
                        Sign up with Google
                    </button>
                    <div className="relative flex items-center justify-center mt-2">
                        <div className="absolute w-full h-[1px] bg-white/20"></div>
                        <span className="z-10 bg-black rounded-full size-7 text-center">or</span>
                    </div>

                    <Link to="/register"  >
                        <button className="bg-sky-500 w-full py-3 rounded-3xl text-gray-100 mt-2 font-semibold hover:bg-sky-600 transition">Create account</button>
                    </Link>

                    <p className="text-xs text-[#71767b] mt-1">By signing up, you agree to the
                        <Link to="/terms" className="ml-1 text-sky-600">
                            Terms of Service
                        </Link> and
                        <Link to="/privacy-policy" className="ml-1 text-sky-600">
                            Privacy Policy
                        </Link>,including
                        <Link to="/cooke-use" className="ml-1 text-sky-600">
                            Cookie Use.
                        </Link>
                    </p>

                    <h3 className="mt-14 text-lg font-semibold">Already have an account?</h3>
                    <button className="border border-gray-500 hover:bg-sky-500/10 w-full py-3 rounded-3xl text-sky-600 mt-4 font-semibold transition">Sign in</button>
                </div>
            </div>
        </div>
    )

}



export default Home
