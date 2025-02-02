'use client'

import Link from 'next/link'
import { useUserStore } from '../../../Stores/user-store'
import Calendar from '../../components/Calendar'
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface Task {
  id: number
  title: string
  description: string
  userId: number
  projectId: number | null
  categoryId: number | null
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string | null
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

interface Project {
  id: number
  name: string
  description: string
  userId: number
  createdAt: Date
}

interface Category {
  id: number
  name: string
  description: string
  createdAt: Date
}

const Dashboard = () => {
  const { tasks } = useUserStore()
  console.log(tasks)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task: Task) => task.status === 'completed').length
  const urgentTasks = tasks.filter((task: Task) => task.priority === 'high').length
  const inProgressTasks = tasks.filter((task: Task) => task.status === 'in_progress').length

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Urgent',
      value: urgentTasks,
      icon: <ExclamationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-red-100 text-red-800'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ]

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen overflow-y-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 max-[768px]:ml-10 ">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div 
            key={stat.title}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Recent Tasks</h2>
          <div className="space-y-3 sm:space-y-4">
            {tasks.slice(0, 5).map((task: Task) => (
              <div 
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0"
              >
                <div>
                  <Link href={`/task/${task.id}`}>
                    <h3 className="font-medium text-sm sm:text-base text-gray-800 hover:text-blue-600">{task.title}</h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-600">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                </div>
                <span 
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Calendar />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
