import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import {FaXTwitter} from "react-icons/fa6";
import {IoSettingsOutline} from "react-icons/io5";
import {LuArrowBigUp} from "react-icons/lu";
import TweetModel from "../layouts/TweetModel.tsx";
import {useContext, useEffect} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import ApiClient from "../services/ApiClient.tsx";
import {RiArrowLeftLine} from "react-icons/ri";
import * as React from "react";

function ShowTweet() {

    const {isModelOpen, baseUrl, user, location} = useContext(AppContext)
    const {id} = useParams();

    useEffect( () => {
        ApiClient().get(`/tweets/${id}`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })

    }, [id])


    return (
        <div
            className={`${isModelOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-screen flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header
                    className={`w-full grid grid-cols-1 border-b border-zinc-700/70 2xl:max-w-[38.46rem] xl:max-w-[33.3rem] lg:max-w-[33.7rem] md:max-w-[39.34rem] sm:max-w-[31.2rem] xs:max-w-[31.15rem] xxs:max-w-[27.6rem] backdrop-blur-sm`}>
                    {/* Header but only on small screens */}
                    <div className={`flex sm:hidden justify-between px-6 py-5 pb-1`}>
                        <img className={`size-11 rounded-full object-cover`}
                             src={`${baseUrl}/storage/${user?.avatar}`} alt=""/>
                        <FaXTwitter className={`size-9`}/>
                        <IoSettingsOutline className={`size-9`}/>
                    </div>
                    {/* Header for the rest of screens */}
                    <div className={`flex items-center gap-x-7 px-4 w-full text-neutral-200 z-[100] cursor-pointer`}>
                        <Link to={'/home'} className={`hover:bg-neutral-600/30 flex justify-center items-center p-2 rounded-full transition cursor-pointer`}>
                            <RiArrowLeftLine className={`size-5`}/>
                        </Link>
                        <div className={`py-4 text-xl font-semibold`}>Post</div>
                    </div>
                </header>
                <div></div>
            </div>

            <div
                className={`${isModelOpen ? 'opacity-20 pointer-events-none' : 'z-50'} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Scroll to top button */}
                <div
                    className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                {/* Middle content */}
                <div className={`z-10 text-neutral-200 border border-t-0 border-zinc-700/70 w-full relative animate-slide-down`}>

                </div>

                <TrendingSidebar/>

            </div>

            {/* Tweet model  */}
            <TweetModel/>
        </div>

    )
}

export default ShowTweet
