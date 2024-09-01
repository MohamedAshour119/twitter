import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from './components/pages/Home';
import PageNotFound from "./components/pages/PageNotFound.tsx";
import {useContext, useEffect, useState} from "react";
import ApiClient from "./components/ApiClient.tsx";
import { AppContext } from "./components/appContext/AppContext.tsx";
import AuthRoute from "./components/auth/AuthRoute.tsx";
import UserHomePage from "./components/pages/UserHomePage.tsx";
import Profile from "./components/pages/Profile.tsx";
import ShowTweet from "./components/pages/ShowTweet.tsx";
import Notifications from "./components/pages/Notifications.tsx";
import HashtagTweets from "./components/pages/HashtagTweets.tsx";
import Explore from "./components/pages/Explore.tsx";
import NavbarSmScreens from "./components/partials/NavbarSmScreens.tsx";
import Sidebar from "./components/layouts/Sidebar.tsx";
import TrendingSidebar from "./components/layouts/TrendingSidebar.tsx";
import { LuArrowBigUp } from "react-icons/lu";
import { animateScroll as scroll } from "react-scroll";
import {toast, ToastContainer} from "react-toastify";
import {useLocation} from "react-router";
import apiClient from "./components/ApiClient.tsx";
import {toastStyle} from "./components/helper/ToastifyStyle.tsx";
function AuthLayout() {
    const {isModalOpen, isCommentOpen, isShowEditInfoModal} = useContext(AppContext)

    useEffect(() => {
        const bodyEl = document.body;
        if (isModalOpen || isCommentOpen) {
            bodyEl.style.overflow = 'hidden';
        } else {
            bodyEl.style.overflow = 'auto';
        }
    }, [isModalOpen, isCommentOpen]);

    return (
        <div className={`flex justify-center ${isModalOpen || isCommentOpen || isShowEditInfoModal ? 'bg-[#1d252d]' : 'bg-black'}`}>
            <div className={`container sm:px-4 gap-x-8 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr] grid-cols-1`}>
                <div className={`sm:flex justify-end hidden`}>
                    <Sidebar />
                </div>
                <Routes>
                    <Route path={`/home`} element={<UserHomePage />} />
                    <Route path={`/users/:username`} element={<Profile />} />
                    <Route path={`/tweets/:slug`} element={<ShowTweet />} />
                    <Route path={`/notifications`} element={<Notifications />} />
                    <Route path={`/:hashtag`} element={<HashtagTweets />} />
                    <Route path={`/explore`} element={<Explore />} />
                </Routes>
                <div>
                    <TrendingSidebar />
                </div>
            </div>
        </div>
    );
}


const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}
function App() {

// Reset Password
    const [isResetPasswordFormOpen, setIsResetPasswordFormOpen] = useState(false)
    const query = useQuery()

    useEffect(() => {

        const token = query.get('token')
        const username = query.get('username') || ''

        if (token && username) {
            apiClient().get(`check-token/${token}/${username}`)
                .then(() => {
                    setIsResetPasswordFormOpen(true)
                    setUser(prevState => ({
                        ...prevState,
                        user_info: {...prevState.user_info, username: username}
                    }))
                })
                .catch((err) => {
                    if (err.response.data.errors) {
                        toast.error('Invalid token sent', toastStyle)
                    }
                })
        }
    }, []);
// End Reset Password
    const { setUser } = useContext(AppContext);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const options = {
        duration: 700,
        smooth: true,
    };

    const scrollToTop = () => {
        scroll.scrollToTop(options);
    };

    // Refresh Token
    const expiresDate = localStorage.getItem('expires_at');
    const refreshToken = () => {
        if (expiresDate) {
            const callAfter = (new Date(expiresDate).getTime() - new Date().getTime()) - 72000000;
            // Call this setTimeOut before token expiration date by 20 hours
            setTimeout(() => {
                ApiClient().post('/refresh-token')
                    .then(res => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('expires_at');
                        localStorage.setItem('token', res.data.data.token);
                        localStorage.setItem('expires_at', res.data.data.expires_at);
                        setUser(res.data.data.user);
                    });
            }, callAfter);
        }
    };
    useEffect(() => {
        if (expiresDate) {
            refreshToken();
        }
    }, []);

    useEffect(() => {
        const currentDate = new Date().getTime();
        if (expiresDate && (currentDate >= new Date(expiresDate).getTime())) {
            localStorage.removeItem('token');
            localStorage.removeItem('expires_at');
        }
    }, [expiresDate]);

    useEffect(() => {
        // Redirect to home if user exists and when trying to access '/'
        if (token && (location.pathname === '/')) {
            navigate('/home');
        }
    }, [location.pathname, navigate, token]);

    return (
        <>
            <Routes>
                <Route element={<AuthRoute />}>
                    <Route path="/*" element={<AuthLayout />} />
                </Route>
                <Route path={`/`} element={<Home isResetPasswordOpen={isResetPasswordFormOpen} setIsResetPasswordOpen={setIsResetPasswordFormOpen}/>} />
                <Route path={"*"} element={<PageNotFound />} />
            </Routes>
            <NavbarSmScreens />
            {/* Scroll to top button */}
            {location.pathname !== '/' && (
                <div
                    onClick={scrollToTop}
                    className={`bg-sky-500 z-50 fixed bottom-24 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}
                >
                    <LuArrowBigUp className={`size-7 text-white/90`} />
                </div>
            )}
            <ToastContainer />
        </>
    );
}

export default App;
