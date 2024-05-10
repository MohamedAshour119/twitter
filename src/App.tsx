import './App.css'
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from './components/pages/Home'
import PageNotFound from "./components/pages/PageNotFound.tsx";
import {useContext, useEffect, useState} from "react";
import ApiClient from "./components/services/ApiClient.tsx";
import {AppContext} from "./components/appContext/AppContext.tsx";
import AuthRoute from "./components/auth/AuthRoute.tsx";
import UserHomePage from "./components/pages/UserHomePage.tsx";
import Profile from "./components/pages/Profile.tsx";
import ShowTweet from "./components/pages/ShowTweet.tsx";
import Notifications from "./components/pages/Notifications.tsx";
import HashtagTweets from "./components/pages/HashtagTweets.tsx";
import Explore from "./components/pages/Explore.tsx";
import NavbarSmScreens from "./components/partials/NavbarSmScreens.tsx";
import {LuArrowBigUp} from "react-icons/lu";
import {animateScroll as scroll} from "react-scroll";
import {ToastContainer} from "react-toastify";


function App() {

    const {setUser} = useContext(AppContext)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const options = {
        duration: 700,
        smooth: true,
    }
    const scrollToTop = () => {
        scroll.scrollToTop(options)
    }


    // Check if user still logged in or not
    useEffect( ()=> {
        ApiClient().get('/info')
            .then(res => {
                setUser(res.data.data)
                setLoading(false);
            })
            .catch(() => {
                setUser(null)
                setLoading(false);
            })
    }, [])

    // Refresh Token
    const refreshToken = () => {
        const expiresDate = localStorage.getItem('expires_at');
        if (expiresDate !== null) {
            const callAfter = (new Date(expiresDate).getTime() - new Date().getTime()) - 300000;
            console.log('called')
            // Call this setTimeOut before token expiration date by 5 minutes
            setTimeout(() => {
                ApiClient().post('/refresh-token')
                    .then(res => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('expires_at')
                        localStorage.setItem('token', res.data.data.token)
                        localStorage.setItem('expires_at', res.data.data.expires_at)
                    })
            }, callAfter)
        }
    }

    useEffect(() => {
        refreshToken()
    }, []);


    useEffect(() => {
        // Redirect to home if user exists and when trying to access '/'
        if (token && (location.pathname === '/')) {
            navigate('/home');
        }

    }, [location.pathname, navigate]);

    // Render nothing if the loading state === true to prevent components to being visible for milliseconds when trying to access it
    if (loading) {
        return null;
    }


    return (
        <>
            <Routes>
                <Route element={<AuthRoute />}>
                    <Route path={`/home`} element={<UserHomePage />}/>
                    <Route path={`/users/:username`} element={<Profile />}/>
                    <Route path={`/tweets/:id`} element={<ShowTweet />}/>
                    <Route path={`/notifications`} element={<Notifications />}/>
                    <Route path={`/:hashtag`} element={<HashtagTweets />} />
                    <Route path={`/explore`} element={<Explore />} />
                </Route>


                <Route path={`/`} element={<Home />}/>
                <Route path={"*"} element={<PageNotFound />}/>
            </Routes>
            <NavbarSmScreens/>
            {/* Scroll to top button */}
            {location.pathname !== '/' && <div
                onClick={scrollToTop}
                className={`bg-sky-500 z-50 fixed bottom-24 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                <LuArrowBigUp className={`size-7 text-white/90`}/>
            </div>}
            <ToastContainer/>
        </>

    )
}

export default App
