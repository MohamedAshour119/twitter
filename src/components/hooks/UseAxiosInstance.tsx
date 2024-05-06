import axios from "axios";
import {useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";


const useAxiosInstance = () => {
    const { token} = useContext(AppContext)

    const instance = axios.create({
        baseURL: "http://api.twitter.test/api",
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer ' + token
        }
    });

    instance.interceptors.request.use(config => {
        config.headers.Authorization = "Bearer" + token
        return config
    })

    return instance

}

export default useAxiosInstance;

