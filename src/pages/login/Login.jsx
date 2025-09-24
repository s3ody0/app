import axios from 'axios';
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import * as zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { TokenContext } from '../../context/Token.Context';



const schema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email format"),
  password: zod.string().min(1, "Password is required").min(8, "Password must be at least 8 characters").regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/,"Password must contain at least one uppercase letter,lowercase letter,number,special character"),
})

export default function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const {setToken} = useContext(TokenContext)


    const { handleSubmit, register, formState: { errors } ,reset} = useForm({
        defaultValues: {
          email: '',
          password: '',
        },
        mode: 'onChange',
        resolver: zodResolver(schema)
    });

  
  async function sendDataToLogin(values){
    
    setIsLoading(true)
    const loadingToastId = toast.loading('loading...')
    
    try{
      const options ={
      method:'POST',
      url:"https://linked-posts.routemisr.com/users/signin",
      data:values
    }

    const {data} =await axios.request(options) 

    toast.success('Successfully')
    setToken(data.token)
    localStorage.setItem('token',data.token)
    console.log(token);

    reset()
    navigate('/')

    } catch(error){
      toast.error(error.response.data.error)

    }finally{
      setIsLoading(false)
      toast.dismiss(loadingToastId)
    }
}

  return (
  <>
    <title>Login</title>
    <div className='bg-gray-200'>
        <div className='container min-h-screen flex justify-center items-center '>
            <div className='h-[40%] w-[70%] bg-gray-800 rounded-4xl py-10 my-20'>
              <h1 className='font-semibold text-center text-5xl text-white p-15 drop-shadow-lg drop-shadow-blue-600'>Login</h1>
              <div className=' w-[80%] mx-auto'>
                  <form onSubmit={handleSubmit(sendDataToLogin)} className="mx-auto ">
                    <div className="relative z-0 w-full mb-5 group py-2">
                      <input {...register('email')} type="email" name="email" id="email" className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                      <label htmlFor="email" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                      {errors.email&& (<span className="text-red-400 text-sm mt-1 block"> {errors.email.message}</span>)}
                    </div>
                    <div className="relative z-0 w-full mb-5 group py-2">
                      <input {...register('password')} type="text" name="password" id="password" className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                      <label htmlFor="password" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                      {errors.password&& (<span className="text-red-400 text-sm mt-1 block"> {errors.password.message}</span>)}
                    </div>
                    <div className='flex items-center justify-between h-[150px] flex-col sm:flex-row'>
                      <div >
                        <button disabled={isLoading ? true : false} type="submit" className=" mt-4  sm:mt-0 cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          {isLoading ?<BeatLoader size={5} />:'Login'}
                        </button>
                      </div>
                      <div><p className='text-white'>if u don't have one <Link className='text-blue-500 underline text-lg font-semibold' to="/register">register</Link></p></div>
                    </div>
                    
                  </form>
              </div>
          </div>
        </div>
    </div>
  </>
  )
}
