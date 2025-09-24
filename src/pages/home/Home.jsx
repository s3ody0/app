import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { TokenContext } from '../../context/Token.Context'
import Posts from '../../components/posts/Posts'
import LoaderPage from '../../components/LoaderPage/LoaderPage'
import { useQuery } from '@tanstack/react-query'
import ErrorPage from './../ErrorPage/ErrorPage';
import CreatePost from '../../components/CreatePost/CreatePost'

export default function Home() {

  const {token} = useContext(TokenContext)

  function getAllPosts(){
    return axios.get('https://linked-posts.routemisr.com/posts?limit=20' , {
      headers: {
        token: token
      }
    })}

  const {data , isLoading, isError} = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  })

  if(isLoading) return <LoaderPage />
  if(isError) return <ErrorPage />



  return (
    <>
      <title>Home</title>
      <div className="min-h-screen w-full bg-gray-200 space-y-6 pb-5">
        <CreatePost data={data.data.posts} />
        { data.data.posts .map( post => <Posts post={post} key={post.id} isInSinglePage={false} />)}
      </div>
    </>
  );}
