import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { TokenContext } from '../../context/Token.Context'

export default function GestRoute({children}) {

    const {token} = useContext(TokenContext)
    
    if(token){
        return <Navigate to='/' />
    }else{
        return children
    }

}
