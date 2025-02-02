'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Loader2, Search } from 'lucide-react'
import { format } from 'date-fns'
import { useUserStore } from '../../../Stores/user-store'
import axios from 'axios'
import Link from 'next/link'

interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
  dueDate: string | null
}

const TasksPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  
  const { user } = useUser()
  const { tasks, fetchTasks, setUserId } = useUserStore()

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const response = await axios.post('/api/user', {
            name: user.firstName,
            email: user.emailAddresses[0].emailAddress
          })
          setUserId(response.data.id)
          await fetchTasks(user.emailAddresses[0].emailAddress)
        } catch (error) {
          console.error('Error loading data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    loadData()
  }, [user, fetchTasks, setUserId])

  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-6 flex-1 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-indigo-900 max-[768px]:ml-10">Tasks</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-purple-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-3 w-full border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white text-gray-800 placeholder-gray-500 transition-colors duration-200 hover:border-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              className="px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white text-gray-800 hover:border-purple-400 transition-colors duration-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white text-gray-800 hover:border-purple-400 transition-colors duration-200"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-indigo-600 bg-white rounded-xl shadow-lg border border-indigo-100">
            No tasks found
          </div>
        ) : (
          filteredTasks.map((task: Task) => (
            <div
              key={task.id}
              className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <Link href={`/task/${task.id}`} className="hover:text-indigo-600 text-gray-900">
                  <h3 className="font-semibold text-lg  ">{task.title}</h3>
                </Link>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{task.description}</p>
              {task.dueDate && (
                <div className="text-sm text-indigo-600 font-medium">
                  Due: {format(new Date(task.dueDate), 'PPP')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TasksPage
