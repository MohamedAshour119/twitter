import {Outlet} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import Cookies from "universal-cookie";
import axios from "axios";

function StayLoggedIn() {
    const { token, setToken } = useContext(AppContext)
    const cookie = new Cookies()
    cookie.set('bearer_token', token)
    const getToken = cookie.get('bearer_token')
    useEffect(() => {
        const refreshToken = async () => {
            axios.post('http://api.twitter.test/api/refresh-token', null, {headers:{
                'Authorization': 'Bearer' + getToken
                }})
                .then(res => {
                    const newToken = res.data.data.token
                    cookie.set('bearer_token', newToken)
                    setToken(newToken)
                    console.log('running')
                    return newToken
                })
        }
        !token && refreshToken()
    }, []);


    return <Outlet/>

}

export default StayLoggedIn
