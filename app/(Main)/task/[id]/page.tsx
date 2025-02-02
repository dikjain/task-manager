'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUserStore } from '../../../../Stores/user-store'
import { format } from 'date-fns'
import { Loader2, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'

interface Task {
  id: number
  title: string
  description: string
  dueDate: string
  createdAt: string
  status: string
  priority: string
  projectId?: number
  categoryId?: number
}

const TaskPage = () => {
  const router = useRouter()
  const { id } = useParams()
  const { tasks } = useUserStore()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (typeof id === 'string') {
      const taskId = parseInt(id)
      const foundTask = tasks.find(t => t.id === taskId)
      setTask(foundTask || null)
      setIsLoading(false)
    }
  }, [id, tasks])

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return

    try {
      setIsUpdating(true)
      const response = await axios.patch(`/api/task`, {
        id: task.id,
        status: newStatus
      })

      if (response.status === 200) {
        setTask({
          ...task,
          status: newStatus
        })
        router.refresh()
      } else {
        throw new Error('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!task) return

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await axios.delete(`/api/task`, {
          params: { id: task.id }
        })
        router.push('/tasks')
        if (response.status !== 200) {
          throw new Error('Failed to delete task')
        }
        router.push('/tasks')
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center flex-1 h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Task not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900">{task.title}</h1>
              <p className="text-gray-500 mt-1">Task #{task.id}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority} Priority
                </span>
                <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Link
                  href={`/edit/${task.id}`}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 className="w-5 h-5 text-gray-600" />
                </Link>
                <button 
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-indigo-900 mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">Due Date</h2>
                <p className="text-gray-700">
                  {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date set'}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">Created At</h2>
                <p className="text-gray-700">
                  {format(new Date(task.createdAt), 'PPP')}
                </p>
              </div>

              {task.projectId && (
                <div>
                  <h2 className="text-lg font-semibold text-indigo-900 mb-2">Project</h2>
                  <p className="text-gray-700">Project #{task.projectId}</p>
                </div>
              )}

              {task.categoryId && (
                <div>
                  <h2 className="text-lg font-semibold text-indigo-900 mb-2">Category</h2>
                  <p className="text-gray-700">Category #{task.categoryId}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-6 mt-8">
              <h2 className="text-lg font-semibold text-indigo-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Mark as Complete
                  </button>
                )}
                {task.status === 'completed' && (
                  <button
                    onClick={() => handleStatusChange('pending')}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    Mark as Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskPage
