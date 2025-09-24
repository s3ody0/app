import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { TokenContext } from '../../context/Token.Context'
import LoaderPage from '../LoaderPage/LoaderPage'
import ErrorPage from '../../pages/ErrorPage/ErrorPage'
import Post from '../posts/Posts'

export default function PostDetails() {

    const {token} = useContext(TokenContext)

    const {id} = useParams()

    function getPostDetails(){
        return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
            headers: {
                token: token
            }
        })
    }

    
    
    const {data , isLoading, isError} = useQuery({
        queryKey: ['getSinglePost',id],
        queryFn: getPostDetails,
    })
    
    if(isLoading) return <LoaderPage />
    if(isError) return <ErrorPage />
    

    return (
    <>
    <title>Post Details</title>
    <div className='min-h-screen w-full bg-gray-200 '>
        <Post post={data.data.post} isInSinglePage={true} />
    </div>
    </>
  )
}
