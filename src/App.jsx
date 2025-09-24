import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layout/Layout';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import { Toaster } from 'react-hot-toast';
import Profile from './pages/profile/Profile';
import '../node_modules/flowbite/dist/flowbite.min.js'
import ProtectedRoute from './pages/pr/ProtectedRoute.jsx';
import GestRoute from './pages/pr/GestRoute.jsx';
import TokenProvider from './context/Token.Context.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostDetails from './components/PostDetails/PostDetails.jsx';
import Notfound from './pages/notfound/Notfound.jsx';


function App() {
  
  
  const router = createBrowserRouter([

    {path:'',element: <ProtectedRoute> <Layout /> </ProtectedRoute>, children:[
      {path:'/',element: <Home /> },
      {path:'/profile',element:<Profile />},
    ]},

    {path:'',element: <ProtectedRoute> <Layout /> </ProtectedRoute>, children:[
      {path:'PostDetails/:id',element:<PostDetails />},
    ]},

    {path:'', element:<GestRoute> <Layout /> </GestRoute>, children:[
      {path:'/register',element:<Register />},
      {path:'/login',element:<Login />},
    ]},
    {path:'*',element:<Notfound />}

  ])
  
  
  const queryClient = new QueryClient();
  
  
  return (
    <>
      <TokenProvider>
        <QueryClientProvider client={queryClient}>

          <RouterProvider router={router} />
          <Toaster />  

        </QueryClientProvider>
      </TokenProvider>
    </>
  )
}

export default App