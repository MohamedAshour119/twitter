import {Navigate, Outlet} from "react-router-dom";
import {useLocation} from "react-router";
import {useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";

function AuthRoute() {
    const { user } = useContext(AppContext)
    const location = useLocation()

    return (
        user ? <Outlet/> : <Navigate to={`/`} state={{ from: location }} replace/>
    )
}

export default AuthRoute
