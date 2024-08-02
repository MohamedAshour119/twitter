import {Navigate, Outlet} from "react-router-dom";
import {useLocation} from "react-router";

function AuthRoute() {
    const token = localStorage.getItem('token')
    const location = useLocation()

    return (
        token ? <Outlet/> : <Navigate to={`/`} state={{ from: location }} replace/>
    )
}

export default AuthRoute
