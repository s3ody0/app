import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { TokenContext } from '../../context/Token.Context'

export default function ProtectedRoute({children}) {

    const {token} = useContext(TokenContext)

    if(token){
        return children
    }else{
        return <Navigate to='/login' />
    }
}
