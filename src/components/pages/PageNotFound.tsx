import {Link} from "react-router-dom";

function PageNotFound() {
    return (
        <div className={`text-neutral-100 w-[60%] py-14 bg-sky-600 absolute top-1/2 -translate-y-1/2 flex flex-col items-center rounded-xl`}>
            <h1 className={`text-4xl font-semibold`}>Page not found</h1>
            <p className={`text-xl mt-3`}>Go to home page</p>
            <Link to={`/`} className={`mt-4 bg-[#f5f5f5] text-sky-600 py-3 px-10 rounded font-semibold hover:bg-white transition`}>
                <span>Home</span>
            </Link>
        </div>
    )
}

export default PageNotFound
