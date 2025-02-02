'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserStore } from '../../Stores/user-store'
import { useUser, useClerk } from '@clerk/nextjs'
import { 
  HomeIcon, 
  ClipboardDocumentListIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { tasks, fetchTasks } = useUserStore()
  const { user } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    if (user) {
        fetchTasks(user.emailAddresses[0].emailAddress)
    }
  }, [user, fetchTasks])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <HomeIcon className="w-6 h-6" />,
      path: '/dashboard'
    },
    {
      title: 'Tasks',
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      path: '/tasks',
      count: tasks.length
    },
    {
      title: 'Add Task',
      icon: <PlusIcon className="w-6 h-6" />,
      path: '/add-task'
    }
  ]

  const renderMenuContent = () => (
    <div className="flex flex-col h-full">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="text-gray-600 group-hover:text-gray-800">
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="ml-3 flex-1 text-gray-700 group-hover:text-gray-900 font-medium">
                  {item.title}
                </span>
              )}
              {!isCollapsed && item.count !== undefined && (
                <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-sm font-semibold">
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <button
          onClick={() => signOut()}
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
        >
          <div className="text-gray-600 group-hover:text-gray-800">
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-gray-700 group-hover:text-gray-900 font-medium">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg text-gray-600 hover:text-gray-800"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar for Mobile */}
      <div className={`md:hidden fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">TaskMaster</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 h-[calc(100%-73px)] flex flex-col">
          {renderMenuContent()}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block bg-white h-screen shadow-lg transition-all duration-300 border-r border-gray-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 tracking-tight">TaskMaster</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="p-4 h-[calc(100%-73px)] flex flex-col">
          {renderMenuContent()}
        </nav>
      </div>
    </>
  )
}

export default SideBar
