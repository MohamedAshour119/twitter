import Sidebar from "../partials/Sidebar.tsx";
import {FaRegCircleUser} from "react-icons/fa6";
import {MdOutlinePermMedia} from "react-icons/md";
import {CiFaceSmile} from "react-icons/ci";
import {ChangeEvent, useEffect, useRef, useState} from "react";

function UserHomePage() {

    const [textAreaValue, setTextAreaValue] = useState('')

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
        <div className={`bg-black w-screen h-screen flex justify-center`}>
            <div className={`container grid grid-cols-[1fr,3fr,2fr]`}>
                <Sidebar/>

                <div className={`text-neutral-100 border border-t-0 border-zinc-700/70`}>
                    <header className={`w-full grid grid-cols-2 border-b border-zinc-700/70`}>
                        <button className={`bg-transparent hover:bg-neutral-600/30 py-3`}>For you</button>
                        <button className={`bg-transparent hover:bg-neutral-600/30 py-3`}>Following</button>
                    </header>

                    {/* Post Section */}
                    <div className={`flex flex-col py-3 px-6 border-b border-zinc-700/70`}>
                        <div className={`flex gap-x-3`}>
                            <div className={`text-4xl`}>
                                <FaRegCircleUser />
                            </div>
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
                                        <div className={`bg-transparent hover:bg-sky-600/20 p-2 rounded-full cursor-pointer`}>
                                            <MdOutlinePermMedia />
                                        </div>
                                        <div className={`bg-transparent hover:bg-sky-600/20 p-2 rounded-full cursor-pointer`}>
                                            <CiFaceSmile />
                                        </div>
                                    </div>

                                    <div className={`bg-sky-600 px-6 flex justify-center items-center rounded-full cursor-pointer`}>
                                        Post
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserHomePage
