import {useContext} from 'react'
import {AppContext} from "../appContext/AppContext.tsx";
import ApiClient from "../services/ApiClient.tsx";

function UseRefreshToken() {
    const { setToken} = useContext(AppContext)
    const refreshToken = async () => {
        ApiClient().post('/refresh-token')
            .then(res => {
                const newToken = res.data.data.token
                console.log(newToken)
                setToken(newToken)
                return newToken
            })
    }
    return refreshToken
}

export default UseRefreshToken
