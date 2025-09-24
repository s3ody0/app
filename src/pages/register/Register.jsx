import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from 'zod'
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

const schema = zod.object({
    name: zod.string().min(1, "Name is required").min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
    email: zod.string().min(1, "Email is required").email("Invalid email format"),
    password: zod.string().min(1, "Password is required").min(8, "Password must be at least 8 characters").regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/,"Password must contain at least one uppercase letter,lowercase letter,number,special character"),
    rePassword: zod.string().min(1, "Please confirm your password").regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/,"Password must contain at least one uppercase letter,lowercase letter,number,special character"),
    gender: zod.enum(['male', 'female'], { errorMap: () => ({ message: "Please select a gender" }) }),
    dateOfBirth:zod.coerce.date("invalid date").refine((value)=>{
        return new Date().getFullYear() - value.getFullYear() >= 18 ? true : false;
    },"age must be 18+")

}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"]
});

export default function Register() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, register, formState: { errors } ,reset} = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            gender: '',
            dateOfBirth: ''
        },
        mode: 'onChange',
        resolver: zodResolver(schema)
    });

async function sendData(values){

    setIsLoading(true)
    const loadingToastId = toast.loading('loading...')
    

    try{
        const options ={
        method:'POST',
        url:"https://linked-posts.routemisr.com/users/signup",
        data:values
    }
    const {data} =await axios.request(options) 
    toast.success('Successfully')
    
    } catch(error){
        toast.error(error.response.data.error)
    }finally{
        setIsLoading(false)
        toast.dismiss(loadingToastId)
    }
    reset()
    navigate('/login')
}

return (
    <>
    <title>Register</title>

    <div className='bg-gray-200'>
        <div className='container min-h-screen  flex justify-center items-center '>
            <div className='h-[60%] w-[70%] bg-gray-800 rounded-4xl py-10 my-20'>
                <h1 className='font-semibold text-center text-5xl text-white p-15 drop-shadow-lg drop-shadow-blue-600'>register</h1>
                <div className=' w-[80%] mx-auto'>
                    <form onSubmit={handleSubmit(sendData)} className="mx-auto ">
                    <div className="relative z-0 w-full mb-5 group py-2">
                        <input {...register("name")} type="text" name="name" id="name" className=" block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                        <label htmlFor="name" className="peer-focus:font-medium absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                        {errors.name && (<span className="text-red-400 text-sm mt-1 block"> {errors.name.message}</span>)}
                    </div>
                    <div className="relative z-0 w-full mb-5 group py-2">
                        <input {...register("email")} type="email" name="email" id="email" className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                        <label htmlFor="email" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                        {errors.email&& (<span className="text-red-400 text-sm mt-1 block"> {errors.email.message}</span>)}
                    </div>
                    <div className="relative z-0 w-full mb-5 group py-2">
                        <input {...register("password")} type="text" name="password" id="password" className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                        <label htmlFor="password" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        {errors.password&& (<p className="text-red-400 text-sm mt-1 block"> {errors.password.message}</p>)}
                    </div>
                    <div className="relative z-0 w-full mb-2 group pt-2 ">
                        <input {...register("rePassword")} type="text" name="rePassword" id="rePassword"  className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                        <label htmlFor="rePassword" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                        {errors.rePassword&& (<span className="text-red-400 text-sm mt-1 block"> {errors.rePassword.message}</span>)}
                    </div>
                    <div className='flex items-center justify-between h-[180px] flex-col sm:flex-row sm:h-[100px]'>
                        <div className='w-[60%] sm:w-[40%] md:w-[50%] lg:w-[40%]'>
                            <ul className="items-center w-full  font-medium text-gray-900 bg-white border border-gray-200 rounded-lg  md:flex  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <input {...register("gender")} id="horizontal-list-radio-license" type="radio" value="male" name="gender" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                        <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2  font-medium text-gray-900 dark:text-gray-300">Male</label>
                                    </div>
                                </li>
                                <li className="w-full">
                                    <div className="flex items-center ps-3">
                                        <input {...register("gender")} id="horizontal-list-radio-id" type="radio" value="female" name="gender" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                        <label htmlFor="horizontal-list-radio-id" className="w-full py-3 ms-2  font-medium text-gray-900 dark:text-gray-300">Female</label>
                                    </div>
                                </li>
                            </ul>
                            {errors.gender && (<span className="text-red-400 text-sm mt-1 block"> {errors.gender.message}</span>)}
                        </div>
                        <div>
                            <input {...register("dateOfBirth")} type="date" className='bg-gray-700 rounded-lg text-white border-gray-600 h-12.5'/>
                            {errors.dateOfBirth&& (<span className="text-red-400 text-sm mt-1 block"> {errors.dateOfBirth.message}</span>)}
                        </div>
                    </div>
                        <button disabled={isLoading ? true : false} type="submit" className=" mt-4  sm:mt-0 cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {isLoading ?<BeatLoader size={5} />:'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </>
)
}