import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = ({children}: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-full sm:w-[400px] mx-4">
        {children}
      </div>
    </div>
  )
}

export default layout