import {FaRegCircleUser} from "react-icons/fa6";

function FollowUser() {
    return (
        <div className={`flex justify-between hover:bg-[#25323f30] px-4 py-3 cursor-pointer`}>
            <div className={`flex gap-x-2`}>

                <FaRegCircleUser className={`size-10`}/>

                <div className={`flex flex-col`}>
                    <span>Mohamed Ashour</span>
                    <span className={`text-[#71767b]`}>@MohamedAsh</span>
                </div>
            </div>

            <button className={`bg-neutral-100 text-black px-6 max-h-10 hover:bg-gray-200 transition font-semibold flex justify-center items-center rounded-full cursor-pointer`}>Follow</button>

        </div>
    )
}

export default FollowUser
