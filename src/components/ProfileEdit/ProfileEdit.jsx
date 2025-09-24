import React, { useState, useContext, useRef } from 'react'
import { TokenContext } from '../../context/Token.Context'
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoaderPage from '../LoaderPage/LoaderPage';
import ErrorPage from '../../pages/ErrorPage/ErrorPage';
import moment from 'moment';

export default function ProfileEdit() {
    const {token , userId} = useContext(TokenContext)
    
    const imgUpdaterElement = useRef(null)

    const [showPasswordModal, setShowPasswordModal]= useState(false)
    const [oldPassword,setOldPassword]= useState('')
    const [newPassword,setNewPassword]= useState('')

    function getUserlogged(){
        return axios.get('https://linked-posts.routemisr.com/users/profile-data', {
            headers:{ 
                token: token 
            }
        })
    }

    const {data , isLoading , isError} = useQuery({
        queryKey: ['userData',userId],
        queryFn: getUserlogged
    })
    
    const user = data?.data?.user    

    function handleEditProfile() {
        const formData = new FormData();
        if (imgUpdaterElement.current.files[0]) {
            formData.append('photo', imgUpdaterElement.current.files[0]);
        }
        return axios.put('https://linked-posts.routemisr.com/users/upload-photo', formData, {
            headers:{ 
                token: token 
            }
        });
    }
    
    const {mutate} = useMutation({
        mutationFn:  handleEditProfile,
        onSuccess:() => {
            toast.success("Profile photo updated successfully!");
        },
        onError:() => {
            toast.error("Failed to update photo.");
        }        
    })

    function handleChangePassword() {
        if(!oldPassword || !newPassword){
            toast.error("Please fill both fields");
            return;
        }

        axios.patch('https://linked-posts.routemisr.com/users/change-password', {
            password: oldPassword,
            newPassword: newPassword
        }, {
            headers: { token }
        })
        .then(() => {
            toast.success("Password updated successfully!");
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
        })
        .catch(() => toast.error("Failed to update password."));
    }

    if(isLoading){
        return <LoaderPage />
    }
    if(isError){
        return <ErrorPage />
    }

    return (
        <>
        <div className="post flex justify-center py-5 container w-[70%]">
            <div className="bg-gray-100 w-full h-fit rounded-xl p-10 items-center relative">
                <div className="flex items-center">
                    <img className="max-h-40 rounded-3xl" src={user.photo} alt="" />
                    <div className='px-5 font-semibold text-lg text-gray-600 gap-2 flex flex-col'>
                        <p>Name : <span className='text-xl text-gray-900'>{user.name}</span></p>
                        <p>Email : <span className='text-xl text-gray-900'>{user.email}</span></p>
                        <p>Gender : <span className='text-xl text-gray-900'>{user.gender}</span></p>
                        <p>Date of birth : <span className='text-xl text-gray-900'>{moment(user.dateOfBirth).calendar()}</span></p> 
                        <p>Join : <span className='text-xl text-gray-900'>{moment(user.createdAt).calendar()}</span> </p>
                    </div>
                </div>
                <div className='flex absolute bottom-5 right-5 gap-5'>
                    <label className='text-white font-semibold cursor-pointer bg-blue-600 p-2 rounded-lg hover:bg-blue-700'>
                        <input ref={imgUpdaterElement} onChange={mutate} className='hidden' type="file"  />
                        <p>Update Photo</p>
                    </label>
                    <button onClick={()=>setShowPasswordModal(true)} className='text-white font-semibold cursor-pointer bg-blue-600 p-2 rounded-lg hover:bg-blue-700'>Update Password</button>
                </div>
            </div>
        </div>

            {showPasswordModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl w-[400px] flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
                    <input type="text" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="border p-2 rounded" />
                    <input type="text" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-2 rounded" />
                    <div className='flex justify-end gap-3'>
                        <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
                        <button onClick={handleChangePassword} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
                    </div>
                </div>
            </div>
            }
        </>
    )
}
