import {LuArrowBigUp} from "react-icons/lu";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import TweetModel from "../layouts/TweetModel.tsx";
import {useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";

function Profile() {

    const {isModelOpen} = useContext(AppContext)

    return (
        <div className={`${isModelOpen ? 'bg-[#1d252d]' : 'bg-black'} h-screen w-screen flex flex-col items-center`}>
            <div className={`${isModelOpen ? 'opacity-20 pointer-events-none' : 'z-50'} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>

                {/* Scroll to top button */}
                <div className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>

                <div>
                    dfgdf
                </div>

                <TrendingSidebar/>
            </div>
            <TweetModel />
        </div>
    )
}

export default Profile
