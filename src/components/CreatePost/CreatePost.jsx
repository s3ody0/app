import React, { useContext, useRef, useState } from 'react'
import { TokenContext } from '../../context/Token.Context'
import { Image, SquareX } from 'lucide-react'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreatePost() {
    const {token}= useContext(TokenContext)


    const [isOpened, setIsOpened] = useState(false)
    const [imgPreview, setimgPreview] = useState(null)

    const obj = useRef(null)
    const imgInputElement = useRef(null)

    const isImgPreview = !!imgPreview

    const {isPending , mutate:triggerHandleCreatePost} = useMutation({
      mutationFn: handleCreatePost,
      
      onSuccess: function(res){
        toast.success('Successfully')
        setIsOpened(false)
        setimgPreview(null)
        obj.current.value = ''
        imgInputElement.current.value = ''
      },
      
      onError: function(err){
        console.log(err.response.data);
      }
    })

    function handleModalOpen(){
      setIsOpened(true)
    }

    
    function handleCreatePost(){

      const formDataObj = new FormData()
      
      if(obj.current.value){
        formDataObj.append('body',obj.current.value)
      }

      if(imgInputElement.current.files[0]){
        formDataObj.append('image',imgInputElement.current.files[0])
      }

      return axios.post('https://linked-posts.routemisr.com/posts',formDataObj,{
        headers:{
          token:token
        }
      })
    }

    function handleImgChange(e){
      console.log(e.target.files[0]);

      const url = URL.createObjectURL(e.target.files[0])
      setimgPreview(url)
      
    }

    function handleImgCancle(){
      setimgPreview(null)
      imgInputElement.current.value = ''
    }

  return (
    <>
    <div className='flex justify-center container w-[70%] pt-5 '>
        <div className='bg-gray-100 w-full min-h-fit rounded-xl p-5'>
          <div>
            {handleCreatePost && <input ref={obj} onClick={handleModalOpen } className='w-full my-5 p-4 font-semibold  border border-gray-300 rounded-lg bg-gray-50 ' type="text" placeholder='3ayz eh' />}
          </div>

          {isImgPreview && <div className='flex justify-center items-center relative'>
            <img src={imgPreview} alt="" />
            <div onClick={handleImgCancle} className='absolute top-5 right-5 cursor-pointer text-red-500'>
              <SquareX  />
            </div>
          </div>}

        {isOpened && <div className='flex justify-between items-center px-5'>
            <div>

              <label className='cursor-pointer font-semibold text-blue-500 '>
                <input onChange = {handleImgChange} ref={imgInputElement} type="file" className='hidden' />
                <div className='flex gap-3 items-center'>
                  <Image />
                  <p>Upload</p>
                </div>
              </label>
            </div>
            <div className='flex gap-5'>
              <button disabled={isPending} onClick={triggerHandleCreatePost} className='px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer'>post</button>
              <button disabled={isPending} onClick={()=>(setIsOpened(false) , setimgPreview(null) , obj.current.value = '' )}  className='px-3 py-2 bg-red-500 text-white rounded-lg cursor-pointer'>cancle</button>
            </div>
          </div>}          
        </div>
    </div>
    </>
  )
}