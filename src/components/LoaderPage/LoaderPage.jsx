import React from 'react'
import { BeatLoader } from 'react-spinners'

export default function LoaderPage() {
  return (
   <div className='flex justify-center items-center h-screen'><BeatLoader size={40} /></div>
  )
}
