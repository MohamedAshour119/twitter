import {Navigate, Outlet} from "react-router-dom";

function AuthRoute() {
    const token = localStorage.getItem('token')

    return (
        token ? <Outlet/> : <Navigate to={`/login`}/>
    )
}

export default AuthRoute
