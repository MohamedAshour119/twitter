import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from './components/pages/Home'
import Register from "./components/pages/Register.tsx";
import {useContext} from "react";
import {AppContext} from "./components/appContext/AppContext.tsx";
import PageNotFound from "./components/pages/PageNotFound.tsx";
import Login from "./components/pages/Login.tsx";


function App() {

    const appContext = useContext(AppContext)

    return (
        <div className={`${appContext.isRegisterOpen ? 'bg-gradient-to-br from-blue-600 to-[#a8dbf9]' : 'bg-black'} flex flex-col items-center ${!appContext.isRegisterOpen ? 'h-screen' : ''}`}>
            <div className={` ${appContext.isRegisterOpen ? 'py-3' : 'pt-10'} w-screen container bg-transparent flex flex-col justify-center items-center`}>
                <Routes>
                    <Route path={`/`} element={<Home />}/>
                    <Route path={`/register`} element={<Register />}/>
                    <Route path={`/login`} element={<Login />}/>

                    <Route path={"*"} element={<PageNotFound />}/>
                </Routes>
            </div>
        </div>

    )
}

export default App
