import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {FaRegCircleUser} from "react-icons/fa6";
import {HiMiniMagnifyingGlass} from "react-icons/hi2";

function TrendingSidebar() {
    return (
        <div className={`text-neutral-100 flex flex-col gap-y-8`}>
            <div className={`mt-2 relative`}>
                <input
                    type="text"
                    placeholder={`Search`}
                    className={`bg-[#2a2d32b3] w-full px-12 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b]`}
                />
                <HiMiniMagnifyingGlass className={`absolute top-1/2 left-3 -translate-y-1/2 size-5 text-[#71767b]`}/>
            </div>

            <div className={`bg-[#2a2d32b3] rounded-2xl`}>
                <h1 className={`font-bold text-2xl p-4`}>What's happening</h1>

                <div className={`mt-6 flex flex-col gap-y-5 pb-3`}>
                    <div className={`px-4 hover:bg-[#25323f30] transition cursor-pointer`}>

                        <div className={`flex justify-between items-baseline`}>
                            <span className={`text-[#71767b]`}>Trending</span>
                            <div className={`hover:bg-sky-600/20 hover:text-sky-500 cursor-pointer flex justify-center items-center p-2 rounded-full transition`}>
                                <HiOutlineDotsHorizontal/>
                            </div>
                        </div>

                        <div className={`flex flex-col`}>
                            <span>Programing is nice</span>
                            <span className={`text-[#71767b]`}>3844 posts</span>
                        </div>

                    </div>
                    <div className={`px-4 hover:bg-[#25323f30] transition cursor-pointer`}>

                        <div className={`flex justify-between items-baseline`}>
                            <span className={`text-[#71767b]`}>Trending</span>
                            <div className={`hover:bg-sky-600/20 hover:text-sky-500 cursor-pointer flex justify-center items-center p-2 rounded-full transition`}>
                                <HiOutlineDotsHorizontal/>
                            </div>
                        </div>

                        <div className={`flex flex-col`}>
                            <span>Programing is nice</span>
                            <span className={`text-[#71767b]`}>3844 posts</span>
                        </div>

                    </div>
                    <div className={`px-4 hover:bg-[#25323f30] transition cursor-pointer`}>

                        <div className={`flex justify-between items-baseline`}>
                            <span className={`text-[#71767b]`}>Trending</span>
                            <div className={`hover:bg-sky-600/20 hover:text-sky-500 cursor-pointer flex justify-center items-center p-2 rounded-full transition`}>
                                <HiOutlineDotsHorizontal/>
                            </div>
                        </div>

                        <div className={`flex flex-col`}>
                            <span>Programing is nice</span>
                            <span className={`text-[#71767b]`}>3844 posts</span>
                        </div>

                    </div>
                    <div className={`px-4 hover:bg-[#25323f30] transition cursor-pointer`}>

                        <div className={`flex justify-between items-baseline`}>
                            <span className={`text-[#71767b]`}>Trending</span>
                            <div className={`hover:bg-sky-600/20 hover:text-sky-500 cursor-pointer flex justify-center items-center p-2 rounded-full transition`}>
                                <HiOutlineDotsHorizontal/>
                            </div>
                        </div>

                        <div className={`flex flex-col`}>
                            <span>Programing is nice</span>
                            <span className={`text-[#71767b]`}>3844 posts</span>
                        </div>

                    </div>
                </div>

            </div>

            <div>
                <h1>Who to follow</h1>

                <div>
                    <div>
                        <div>
                            <FaRegCircleUser/>
                        </div>

                        <div>
                            <span>Mohamed Ashour</span>
                            <span>@MohamedAsh</span>
                        </div>
                    </div>

                    <button>Follow</button>

                </div>
            </div>
        </div>
    )
}

export default TrendingSidebar
