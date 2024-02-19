import {FaRegCircleUser} from "react-icons/fa6";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {FaRegComment, FaRegHeart} from "react-icons/fa";
import {BsRepeat} from "react-icons/bs";
import {TbBrandGoogleAnalytics} from "react-icons/tb";

function Post() {
    return (
        <div className={`py-3 px-6 flex gap-x-2 border-b border-zinc-700/70`}>
            <div className={`text-4xl cursor-pointer`}>
                <FaRegCircleUser/>
            </div>

            <div>
                <div className={`flex gap-x-2 justify-between`}>
                    <div className={`flex gap-x-2`}>
                        <h1 className={`font-semibold cursor-pointer`}>Mohamed Ashour</h1>
                        <h1 className={`font-light text-[#71767b] cursor-pointer`}>@MohamedAsh119 .</h1>
                        <span className={`font-light text-[#71767b] cursor-pointer`}>Feb 17</span>
                    </div>

                    <div className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}>
                        <HiOutlineDotsHorizontal />
                    </div>
                </div>


                <div className={`mt-4 grid grid-cols-1`}>
                    <h1>Post title Post title Post title Post title Post title Post title Post title title Post titletitle Post title</h1>
                    <div className={` mt-3`}>
                        <img className={`w-[40rem max-h-[35rem] rounded-2xl`} src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/>
                    </div>
                </div>

                <div className={`flex gap-x-14 mt-2 text-zinc-400/70`}>
                    <div className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-sky-500 transition group-hover:bg-sky-500/20 rounded-full p-2`}>
                            <FaRegComment />
                        </div>
                        <span className={`group-hover:text-sky-500 transition`}>314</span>
                    </div>

                    <div className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-emerald-400 transition group-hover:bg-emerald-400/20 rounded-full p-2`}>
                            <BsRepeat />
                        </div>
                        <span className={`group-hover:text-emerald-400 transition`}>47</span>
                    </div>

                    <div className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-rose-500 transition group-hover:bg-rose-500/20 rounded-full p-2`}>
                            <FaRegHeart />
                        </div>
                        <span className={`group-hover:text-rose-500 transition`}>12k</span>
                    </div>

                    <div className={`flex items-center cursor-pointer group`}>
                        <div className={`text-xl flex justify-center items-center group-hover:text-sky-500 transition group-hover:bg-sky-500/20 rounded-full p-2`}>
                            <TbBrandGoogleAnalytics />
                        </div>
                        <span className={`group-hover:text-sky-500 transition`}>6M</span>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Post
