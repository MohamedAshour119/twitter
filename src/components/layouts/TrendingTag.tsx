import {HiOutlineDotsHorizontal} from "react-icons/hi";

function TrendingTag() {
    return (
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
    )
}

export default TrendingTag
