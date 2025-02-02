import SideBar from '../components/SideBar'
import React from 'react'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <div className='flex w-screen'>
            <SideBar />
            {children}
        </div>
    </div>  
  )
}

export default MainLayout