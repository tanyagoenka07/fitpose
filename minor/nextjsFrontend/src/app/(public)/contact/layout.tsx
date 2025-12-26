"use client"
import React from 'react'
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/mainComponents/NavBar';
type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div>
        <Navbar/>
        <motion.div initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }} className='mt-[4rem]'>
                {children}
            </motion.div>
    </div>
  )
}

export default layout