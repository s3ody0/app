import { Ellipsis } from 'lucide-react'
import { Dropdown, DropdownItem } from "flowbite-react";
import moment from 'moment'
import React, {  useContext, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { TokenContext } from '../../context/Token.Context';
import toast from 'react-hot-toast';
import axios from 'axios';
import { is } from 'zod/v4/locales';

export default function PostHeader({photo,name,createdAt,postUserId,isPost, id , update , setUpdate , setIsEditing , isEditing}) {
  
  const {token,userId}= useContext(TokenContext)
  
  function deleteProcess(){
    return axios.delete(`https://linked-posts.routemisr.com/${isPost ? 'posts' : 'comments'}/${id}`,{
      headers:{
        token:token
      }}
    )
  }

  const {mutate:handelDeletePost} = useMutation({
    mutationFn: deleteProcess,
    onSuccess: function(res){
      toast.success('Post Deleted Successfully')
    },
    onError: function(err){
      toast.error('Something went wrong')
    }
  })
  
  return (
    <div className="post-header flex justify-between items-center ">
        <div className=" flex w-full items-center">
            <img className="h-15 w-15 rounded-full" src={photo}  alt="" />
            <div className="px-5 ">
                <p className='font-semibold text-xl'>{name}</p>
                <p className='text-gray-500 text-sm'>{moment(createdAt).calendar()}</p>
            </div>
        </div>
          
          {postUserId === userId &&  <Dropdown label={<div className="flex cursor-pointer"><Ellipsis /></div>} arrowIcon={false}  >
          {!isPost && <DropdownItem onClick={()=> {setUpdate(!update)} } >Update</DropdownItem>}
          {isPost && <DropdownItem onClick={() => setIsEditing(!isEditing) }>Update</DropdownItem>}
          <DropdownItem onClick={handelDeletePost} >Delete</DropdownItem>
          </Dropdown>}
          
    </div>

  )
}
