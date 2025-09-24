import React, { useContext } from 'react'
import PostHeader from '../../components/postHeader/PostHeader'
import { TokenContext } from '../../context/Token.Context';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoaderPage from './../../components/LoaderPage/LoaderPage';
import ErrorPage from './../ErrorPage/ErrorPage';
import Post from '../../components/posts/Posts';
import ProfileEdit from '../../components/ProfileEdit/ProfileEdit';


export default function Profile() {

  const {token,userId} = useContext(TokenContext)
  

  function getUserPosts(){
    return axios.get(`https://linked-posts.routemisr.com/users/${userId}/posts`,{
      headers:{
        token:token
      }
    })
  }

const {data , isLoading , isError} = useQuery({
  queryKey:['getUserPosts',userId],
  queryFn:getUserPosts
})


if(isLoading){
  return <LoaderPage />
}
if(isError){
  return <ErrorPage />
}

  return (
    <>
    <ProfileEdit />
    <title>Profile</title>
      <div>
        {data.data.posts.map(post => <Post post={post} key={post._id} />)}
      </div>
    </>
  )
}
