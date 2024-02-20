import Sidebar from "../partials/Sidebar.tsx";
import {FaRegCircleUser, FaXTwitter} from "react-icons/fa6";
import {MdOutlinePermMedia} from "react-icons/md";
import {CiFaceSmile} from "react-icons/ci";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import Post from "../layouts/Post.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import {IoSettingsOutline} from "react-icons/io5";
import {LuArrowBigUp} from "react-icons/lu";

function UserHomePage() {

    const [textAreaValue, setTextAreaValue] = useState('')
    const [isPostBtnDisabled, setIsPostBtnDisabled] = useState(true)
    console.log(setIsPostBtnDisabled)
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTextAreaValue(e.target.value)
    }

    // Dynamic change textarea height based on the text long
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    useEffect( () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 1 + 'px';
        }
    }, [textAreaValue] )


    return (
        <div className={`bg-black w-screen h-screen flex justify-center overflow-x-hidden`}>
            <div className={`container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,2fr]`}>

                <div className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                <div className={`text-neutral-100 border border-t-0 border-zinc-700/70 w-full relative animate-slide-down`}>
                        <header className={`w-full grid grid-cols-1 border-b border-zinc-700/70 fixed 2xl:max-w-[38.46rem] xl:max-w-[33.3rem] lg:max-w-[33.7rem] md:max-w-[39.34rem] sm:max-w-[31.2rem] xs:max-w-[31.15rem] xxs:max-w-[27.6rem] backdrop-blur-md`}>
                            <div className={`flex sm:hidden justify-between px-6 py-5 pb-1`}>
                                <FaRegCircleUser className={`size-9`}/>
                                <FaXTwitter className={`size-9`}/>
                                <IoSettingsOutline className={`size-9`}/>
                            </div>
                            <div className={`w-full`}>
                                <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>For you</button>
                                <button className={`hover:bg-neutral-600/30 py-4 w-1/2 transition`}>Following</button>
                            </div>
                        </header>

                    {/* Post Section */}
                    <div className={`flex flex-col py-3 px-6 sm:mt-16 mt-36 border-b border-zinc-700/70 z-10`}>
                        <div className={`flex gap-x-3`}>

                            <FaRegCircleUser className={`size-10`}/>

                            <div className={`flex flex-wrap w-full gap-y-5`}>
                                <textarea
                                    ref={textAreaRef}
                                    maxLength={280}
                                    onChange={handleChange}
                                    placeholder={`What is happening?!`}
                                    name={`textAreaValue`}
                                    value={textAreaValue}
                                    className={`bg-transparent overflow-x-auto resize-none border-b border-zinc-700/70 text-xl w-full pt-1 pb-3 placeholder:font-light placeholder:text-neutral-500 focus:outline-0`}
                                />

                                <div className={`flex justify-between w-full`}>
                                    <div className={`flex text-2xl text-sky-600`}>
                                        <div className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                            <MdOutlinePermMedia />
                                        </div>
                                        <div className={`hover:bg-sky-600/20 p-2 rounded-full cursor-pointer transition`}>
                                            <CiFaceSmile />
                                        </div>
                                    </div>

                                    <div className={`bg-sky-600 px-6 font-semibold flex justify-center items-center rounded-full ${isPostBtnDisabled ? 'bg-sky-800 text-neutral-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        Post
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  All Posts  */}
                    <div>
                        <Post/>
                        <Post/>
                        <Post/>
                        <Post/>
                    </div>

                </div>

                <TrendingSidebar/>

            </div>
        </div>
    )
}

export default UserHomePage
