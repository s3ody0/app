import { createContext, useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode'

export const TokenContext = createContext(null)

export default function TokenProvider({children}){

    const [token , setToken] = useState(localStorage.getItem('token'))
    const [userId , setUserId] = useState(null)

    
    useEffect(()=>{
        if(token){
            const userId = jwtDecode(token).user
            setUserId(userId)
            
        }
    },[token])

    function logout (){
        localStorage.removeItem('token')
        setToken(null)
        setUserId(null)
    }

    return <TokenContext.Provider value={{token, setToken , logout ,userId}}>
        {children}
    </TokenContext.Provider>
}