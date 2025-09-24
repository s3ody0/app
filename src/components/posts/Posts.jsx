import React, { useContext, useRef, useState, useEffect } from 'react'
import { TokenContext } from '../../context/Token.Context'
import { Image, SquareX } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import PostHeader from '../postHeader/PostHeader'
import CommentCard from '../comments/commentCard'
import { Link } from 'react-router-dom'

export default function Post({ post, isInSinglePage = false }) {
    const { token, userId } = useContext(TokenContext)
    const postUserId = post.user._id
    const queryClient = useQueryClient()

    const [isEditing, setIsEditing] = useState(false)
    const [postBody, setPostBody] = useState(post.body)
    const [imgPreview, setImgPreview] = useState(post.image || null)
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    const postPhotoRef = useRef(null)

    useEffect(() => {
        setUnsavedChanges(postBody !== post.body || (postPhotoRef.current?.files[0] ?? null))
    }, [postBody, imgPreview])

    function handleImgChange(e) {
        const url = URL.createObjectURL(e.target.files[0])
        setImgPreview(url)
    }

    function handleImgCancel() {
        setImgPreview(post.image || null)
        if (postPhotoRef.current) postPhotoRef.current.value = ''
    }

    function handleUpdatePost() {
        const formData = new FormData()
        formData.append('body', postBody)
        if (postPhotoRef.current?.files[0]) {
            formData.append('image', postPhotoRef.current.files[0])
        }

        return axios.put(
            `https://linked-posts.routemisr.com/posts/${post._id}`,
            formData,
            { headers: { token, 'Content-Type': 'multipart/form-data' } }
        )
    }

    const { mutate: triggerUpdatePost, isLoading: isUpdating } = useMutation({
        mutationFn: handleUpdatePost,
        onSuccess: () => {
            toast.success('Post updated')
            setIsEditing(false)
            post.body = postBody
            if (postPhotoRef.current?.files[0]) {
                post.image = imgPreview
            }
            queryClient.invalidateQueries(['getPosts'])
        },
        onError: () => toast.error('Something went wrong')
    })

    const firstComment = post.comments?.[0]
    const allCommentsReversed = structuredClone(post).comments?.reverse()

    function handleCancelEdit() {
        if (unsavedChanges && !window.confirm('There are unsaved changes. Discard them?')) return
        setIsEditing(false)
        setPostBody(post.body)
        setImgPreview(post.image || null)
    }

    const [contentOfComment, setContentOfComment] = useState('')
    const [isCommentLoading, setIsCommentLoading] = useState(false)

    function handleAddComment() {
        setIsCommentLoading(true)
        return axios.post(
            'https://linked-posts.routemisr.com/comments',
            { content: contentOfComment, post: post._id },
            { headers: { token } }
        )
    }

    const { mutate: addComment } = useMutation({
        mutationFn: handleAddComment,
        onSuccess: () => {
            setContentOfComment('')
            queryClient.invalidateQueries({ queryKey: ['getSinglePost', post._id] })
            toast.success('Comment added')
        },
        onError: () => toast.error('Something went wrong'),
        onSettled: () => setIsCommentLoading(false)
    })

    return (
        <div key={post._id} className="post flex justify-center py-5 container w-[70%]">
            <div className="bg-gray-100 w-full h-fit rounded-xl p-10">
                <PostHeader id={post._id} name={post.user.name} photo={post.user.photo} createdAt={post.createdAt} postUserId={post.user._id} 
                isPost isEditing={isEditing} setIsEditing={setIsEditing}/>

                {isEditing && postUserId === userId ? (
                    <div className='flex flex-col gap-3 px-5 py-2'>
                        <input type="text" value={postBody} onChange={(e) => setPostBody(e.target.value)} className='w-full p-4 font-semibold border border-gray-300 rounded-lg bg-gray-50 resize-none' placeholder="Edit your post..."/>
                        <label className='cursor-pointer font-semibold text-blue-500'>
                            <input type="file" className='hidden' ref={postPhotoRef} onChange={handleImgChange} />
                            <div className='flex gap-3 items-center pt-2'>
                                <Image />
                                <p>Upload</p>
                            </div>
                        </label>

                        {imgPreview && (
                            <div className='relative w-full flex justify-center items-center'>
                                <img src={imgPreview} className=' mt-2' alt="" />
                                <div onClick={handleImgCancel} className='absolute top-2 right-2 cursor-pointer text-red-500'>
                                    <SquareX />
                                </div>
                            </div>
                        )}

                        <div className='flex gap-3'>
                            <button onClick={triggerUpdatePost} disabled={isUpdating} className='px-3 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center'>
                                {isUpdating ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={handleCancelEdit} className='px-3 py-2 bg-red-500 text-white rounded-lg'>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="post-body">
                        <p className="p-8">{post.body}</p>
                        {post.image && <img className="m-auto" src={post.image} alt="" />}
                    </div>
                )}

                <div className='w-full py-5'>
                    <div className="relative flex justify-center items-center w-full">
                        <input
                            type="text" placeholder="Write a comment..." className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50" value={contentOfComment} onChange={(e) => setContentOfComment(e.target.value)}/>
                        <button onClick={() => addComment()} disabled={isCommentLoading} className="text-white absolute right-2 bottom-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2">
                            {isCommentLoading ? 'Posting...' : 'Send'}
                        </button>
                    </div>
                </div>

                {!isInSinglePage && <Link to={`/PostDetails/${post._id}`} className='ps-2 text-blue-500 font-semibold'>{post.comments?.length} Comment</Link>}
                {isInSinglePage && allCommentsReversed.map(comment => (<CommentCard key={comment._id} commentDetails={comment} post={post} />))}
                {!isInSinglePage && firstComment && <CommentCard commentDetails={firstComment} post={post} />}
            </div>
        </div>
    )
}
