import Navbar from '@/components/ui/mainComponents/NavBar'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className='h-full w-full'>
        <Navbar/>
        <div className='mt-[5rem] text-black'>
             {children}
        </div>
    </div>
  )
}

export default layout