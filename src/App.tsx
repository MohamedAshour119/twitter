import './App.css'
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from './components/pages/Home'
import Register from "./components/pages/Register.tsx";
import PageNotFound from "./components/pages/PageNotFound.tsx";
import Login from "./components/pages/Login.tsx";
import {useContext, useEffect, useState} from "react";
import ApiClient from "./components/services/ApiClient.tsx";
import {AppContext} from "./components/appContext/AppContext.tsx";
import AuthRoute from "./components/auth/AuthRoute.tsx";
import {useLocation} from "react-router";
import UserHomePage from "./components/pages/UserHomePage.tsx";


function App() {

    const {setUser} = useContext(AppContext)
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    // Check if user still logged in or not
    useEffect( ()=> {
        ApiClient().get('/info')
            .then(res => {
                setUser(res.data)
                setLoading(false);
            })
            .catch(() => {
                setUser(null)
                setLoading(false);
            })
    }, [])

    useEffect(() => {
        const handleScroll = () => {

            if (window.scrollY >= 191) {
                console.log('Reached')
            } else {
                console.log('reached')
            }
        };

        window.addEventListener('scroll', handleScroll);


        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    useEffect(() => {
        // Redirect to home if user exists and when trying to access '/' or '/register' or '/login'
        if (token && (location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login')) {
            navigate('/home');
        }

    }, [location.pathname, navigate]);

    // Render nothing if the loading state === true to prevent components to being visible for milliseconds when trying to access it
    if (loading) {
        return null;
    }

    return (
        <Routes>

            <Route element={<AuthRoute />}>
                <Route path={`/home`} element={<UserHomePage />}/>
            </Route>

            <Route path={`/`} element={<Home />}/>
            <Route path={`/register`} element={<Register />}/>
            <Route path={`/login`} element={<Login />}/>

            <Route path={"*"} element={<PageNotFound />}/>
        </Routes>
    )
}

export default App
