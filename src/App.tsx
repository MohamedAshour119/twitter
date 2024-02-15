import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from './components/pages/Home'
import Footer from "./components/partials/Footer.tsx";
import Register from "./components/pages/Register.tsx";
import {useContext} from "react";
import {AppContext} from "./components/appContext/AppContext.tsx";
import PageNotFound from "./components/pages/PageNotFound.tsx";

function App() {

    const appContext = useContext(AppContext)

    return (
        <div className="bg-black flex justify-center md:items-center h-screen">
            {appContext.isRegisterOpen && <div className={`w-full h-full bg-[#4b6378bf] absolute z-50`}></div>}
            <div className={`container ${appContext.isRegisterOpen ? 'pt-3 md:pt-12' : 'pt-10'} h-screen flex flex-col justify-between items-center`}>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/register" element={<Register />}/>
                    <Route path={"*"} element={<PageNotFound />}/>
                </Routes>
            </div>
        </div>
    )
}

export default App
