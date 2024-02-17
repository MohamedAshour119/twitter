import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from './components/pages/Home'
import Register from "./components/pages/Register.tsx";
// import {useContext} from "react";
// import {AppContext} from "./components/appContext/AppContext.tsx";
import PageNotFound from "./components/pages/PageNotFound.tsx";
import Login from "./components/pages/Login.tsx";


function App() {

    return (
        <Routes>
            <Route path={`/`} element={<Home />}/>
            <Route path={`/register`} element={<Register />}/>
            <Route path={`/login`} element={<Login />}/>

            <Route path={"*"} element={<PageNotFound />}/>
        </Routes>
    )
}

export default App
