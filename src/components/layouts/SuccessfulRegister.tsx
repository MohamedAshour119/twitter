import {MdOutlineDoneOutline} from "react-icons/md";
import {Link, useNavigate} from "react-router-dom";
import {HiMiniXMark} from "react-icons/hi2";
import {FaXTwitter} from "react-icons/fa6";

function SuccessfulRegister() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login')
    }

    return (
        <div className={`flex flex-col justify-center items-center pb-3`}>
            <header className="flex justify-center">
                <div
                    className="absolute left-0 top-2 cursor-pointer mx-3 hover:bg-neutral-600/30 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition"
                    onClick={handleClick}
                >
                    <div className={``}>
                        <HiMiniXMark/>
                    </div>
                </div>
                <div className={`text-4xl`}>
                    <FaXTwitter/>
                </div>
            </header>
            <h1 className={`text-3xl mt-8 text-center font-semibold`}>You successfully created account</h1>
            <div className={`bg-green-600 mt-8 p-6 rounded-full`}>
                <MdOutlineDoneOutline className={`size-16`}/>
            </div>
            <div className={`flex gap-x-4`}>
                <Link to={'/login'} className={`mt-8 bg-neutral-100 text-sky-600 py-3 px-10 text-xl font-bold rounded-lg hover:bg-sky-600 hover:text-neutral-100 transition`}>
                    <span>Login</span>
                </Link>
                <Link to={'/'} className={`mt-8 bg-neutral-100 text-sky-600 py-3 px-10 text-xl font-bold rounded-lg hover:bg-sky-600 hover:text-neutral-100 transition`}>
                    <span>Home</span>
                </Link>
            </div>

        </div>
    )
}

export default SuccessfulRegister
