import React, { useContext, useState } from 'react'
import PostHeader from '../postHeader/PostHeader'
import { FadeLoader } from 'react-spinners'
import { Send } from 'lucide-react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { TokenContext } from '../../context/Token.Context'
import toast from 'react-hot-toast'

export default function CommentCard({commentDetails}) {

  const [update,setUpdate] = useState(false)
  const [content,setContent] = useState(commentDetails.content)
  const [displayContent, setDisplayContent] = useState(commentDetails.content)
  const {token} = useContext(TokenContext)



  function updateComment(){
    return axios.put(`https://linked-posts.routemisr.com/comments/${commentDetails._id}`,
  { content: content },
  { headers: { token: token } }
)
  }

  const {mutate , isLoading} = useMutation({
    mutationFn: updateComment,

    onSuccess: () => {
      toast.success('Comment updated')
      setUpdate(false)
      setDisplayContent(content)
    }
    ,onError: () => {
      toast.error('Something went wrong')
    }
  })

  return (
    <>
    <div className='aitems-center mt-8  bg-gray-200  p-5 rounded-xl'>

      <PostHeader id={commentDetails._id} name={commentDetails.commentCreator.name}  
      photo={commentDetails.commentCreator.photo} createdAt={commentDetails.commentCreator.createdAt} isPost={false} 
      postUserId={commentDetails.commentCreator._id}
      update={update} setUpdate={setUpdate} 
      content={content} setContent={setContent} />

        {update ?  <div className='w-full py-5'>
          <div className="relative flex justify-center items-center w-full">
            <input type="search" value={content} onChange={(e)=>setContent(e.target.value)} id="comment" name="comment" className=" w-full p-4 font-semibold text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="comment" />
            <button type="submit" disabled={isLoading} onClick={()=>mutate()} className="text-white absolute right-2.5 end-2 bottom-2 bg-blue-700 hover:bg-blue-800 focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 cursor-pointer">
              {isLoading ? <FadeLoader size={20} /> : <Send />}
            </button>
          </div>
        </div> :<p className='w-[80%] pt-5 px-5 '>{displayContent}</p>}
    </div>
    </>
  )
}
