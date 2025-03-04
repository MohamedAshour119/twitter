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
import {TweetContext} from "./components/appContext/TweetContext.tsx";
import {Hashtag, UserDefaultValues, UserInfo} from "./Interfaces.tsx";
function AuthLayout() {
    const {isModalOpen, isCommentOpen, isShowEditInfoModal, setDisplayNotResultsFound, setUser} = useContext(AppContext)
    const {setTweets, tweets} = useContext(TweetContext)

    const [pageUrl, setPageUrl] = useState('');
    const [displayNotFoundMsg, setDisplayNotFoundMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [app_hashtags, setAppHashtags] = useState<Hashtag[]>([])
    const [suggested_users_to_follow, setSuggested_users_to_follow] = useState<UserInfo[]>([])

    useEffect(() => {
        const bodyEl = document.body;
        if (isModalOpen || isCommentOpen) {
            bodyEl.style.overflow = 'hidden';
        } else {
            bodyEl.style.overflow = 'auto';
        }
    }, [isModalOpen, isCommentOpen]);

    useEffect(() => {
        if (location.pathname !== '/explore') {
            setDisplayNotResultsFound(false)
        }
    }, [location.pathname]);

    useEffect(() => {
        if (tweets.length === 0 && location.pathname === '/home') {
            setIsLoading(true)
            apiClient().get('/home-tweets')
                .then(res => {
                    setTweets(prevState => ([
                        ...prevState,
                        ...res.data.data.tweets
                    ]))
                    res.data.data.tweets.length === 0 ? setDisplayNotFoundMsg(true) : null
                    setPageUrl(res.data.data.pagination.next_page_url)

                    setAppHashtags(res.data.data.hashtags)
                    setSuggested_users_to_follow(res.data.data.suggested_users)
                })
                .catch(() => {

                })
                .finally(() => setIsLoading(false))
        }

        if (location.pathname !== '/explore') {
            localStorage.removeItem('tweets_results')
            localStorage.removeItem('tweets_results_next_page_url')
        }
    }, [location.pathname]);

    const token = localStorage.getItem('token')

    // Check if user still logged in or not
    useEffect( ()=> {
        if (token) {
            ApiClient().get('/info')
                .then(res => {
                    setUser(prevState => ({
                        ...prevState,
                        user_info: res.data.data.user_info
                    }))
                    if (res.data.data.notifications) {
                        setUser((prevState) : UserInfo => ({
                            ...prevState,
                            allNotifications: res.data.data.notifications,
                            originalNotifications: res.data.data.notifications.notifications_info
                        }))
                    }
                })
                .catch(() => {
                    setUser(UserDefaultValues)
                })
        }
    }, [token])

    return (
        <div className={`flex justify-center ${isModalOpen || isCommentOpen || isShowEditInfoModal ? 'bg-[#1d252d]' : 'bg-black'}`}>
            <div className={`container max-w-screen-xl sm:px-2 md:px-4 xl:gap-x-2 md:gap-x-2 lg:gap-x-8 2xl:gap-x-8 grid xl:grid-cols-[1fr,2fr,1.2fr] lg:grid-cols-[0.1fr,2fr,1.3fr] md:grid-cols-[1.7fr,3fr] sm:grid-cols-[0.5fr,5fr] grid-cols-1`}>
                <div className={`sm:flex justify-end hidden`}>
                    <Sidebar />
                </div>
                <Routes>
                    <Route
                        path={`/home`}
                        element={
                        <UserHomePage
                            pageUrl={pageUrl}
                            notFoundMsg={displayNotFoundMsg}
                            is_loading={isLoading}
                        />}
                    />
                    <Route path={`/users/:username`} element={<Profile />} />
                    <Route path={`/tweets/:slug`} element={<ShowTweet />} />
                    <Route path={`/notifications`} element={<Notifications />} />
                    <Route path={`/:hashtag`} element={<HashtagTweets />} />
                    <Route path={`/explore`} element={<Explore />} />
                </Routes>
                <div>
                    <TrendingSidebar
                        app_hashtags={app_hashtags}
                        is_loading={isLoading}
                        suggested_users_to_follow={suggested_users_to_follow}
                    />
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
        if (token && location.pathname === '/') {
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
