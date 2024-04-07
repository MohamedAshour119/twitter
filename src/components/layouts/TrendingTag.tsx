
function TrendingTag() {
    return (
        <div className={`px-4 py-2 hover:bg-[#25323f30] transition cursor-pointer`}>

            <div className={`text-[#71767b]`}>Trending</div>

            <div className={`flex flex-col`}>
                <span>Programing is nice</span>
                <span className={`text-[#71767b]`}>3844 posts</span>
            </div>

        </div>
    )
}

export default TrendingTag
