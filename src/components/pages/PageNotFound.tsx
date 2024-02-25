import {Link} from "react-router-dom";

function PageNotFound() {
    return (
        <div className={`text-neutral-100 w-full h-screen bg-black flex flex-col items-center justify-center`}>
            <div className={`bg-black shadow-[0px_0px_12px_seashell] container flex flex-col gap-y-3 items-center justify-center py-14 rounded-xl`}>
                <h1 className={`text-4xl font-semibold`}>Page not found</h1>
                <p className={`text-xl mt-3`}>Go to home page</p>
                <Link to={`/`} className={`mt-2 bg-[#f5f5f5] text-sky-600 py-3 px-10 rounded font-semibold hover:bg-sky-600 hover:text-neutral-100 transition`}>
                    <span>Home</span>
                </Link>
            </div>
        </div>
    )
}

export default PageNotFound
