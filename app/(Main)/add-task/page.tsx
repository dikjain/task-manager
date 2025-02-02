'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PanelLeftClose, Loader2 } from 'lucide-react'
import { sampleProjects, sampleCategories } from '../../../Configs/data'
import axios from 'axios'
import { useUserStore } from '../../../Stores/user-store'

interface TaskData {
  title: string;
  description: string;
  status: string;
  projectId: number | null;
  categoryId: number | null;
  userId: number;
  dueDate: string | null;
  priority: string;
}

const AddTask = () => {
  const router = useRouter()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { setUserId , userId } = useUserStore()

  const dummyCategories = sampleCategories
  const dummyProjects = sampleProjects

  useEffect(() => {
    if (user) {
      const checkUser = async () => {
        try {
          const response = await axios.post('/api/user', {
            name: user.firstName,
            email: user.emailAddresses[0].emailAddress
          });
          setUserId(response.data.id);
          return response.data;
        } catch (error) {
          console.error('Error checking user:', error);
          throw error;
        }
      }
      checkUser()
    }
  }, [user, setUserId])

  // Get today's date in YYYY-MM-DDThh:mm format for min attribute
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  const minDate = today.toISOString().slice(0,16)

  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    status: 'pending',
    projectId: null,
    categoryId: null,
    userId: userId || 0,
    dueDate: null,
    priority: 'low'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
    e.preventDefault()
    setError('')

    if (!taskData.title || !taskData.description || !userId) {
      setError('Title, description and user ID are required fields')
      setIsSubmitting(false)
      return
    }

    try {
      const parsedData = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        status: taskData.status,
        userId: userId,
        projectId: taskData.projectId,
        categoryId: taskData.categoryId,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        priority: taskData.priority
      }

      const response = await axios.post('/api/tasks', parsedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        router.push('/tasks')
        router.refresh()
      } else {
        throw new Error('Failed to create task')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to create task. Please try again.')
        console.error('Error creating task:', error.response?.data?.error || error.message)
      } else {
        setError('An unexpected error occurred')
        console.error('Error creating task:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 max-[768px]:ml-10">Add New Task</h1>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            <PanelLeftClose className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-semibold text-indigo-900 mb-2">Title</label>
            <input
              type="text"
              required
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-indigo-900 mb-2">Description</label>
            <textarea
              rows={4}
              required
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-indigo-900 mb-2">Project</label>
              <select
                value={taskData.projectId || ''}
                onChange={(e) => setTaskData({...taskData, projectId: e.target.value ? parseInt(e.target.value) : null})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              >
                <option value="">No Project</option>
                {dummyProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-semibold text-indigo-900 mb-2">Category</label>
              <select
                value={taskData.categoryId || ''}
                onChange={(e) => setTaskData({...taskData, categoryId: e.target.value ? parseInt(e.target.value) : null})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              >
                <option value="">No Category</option>
                {dummyCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-indigo-900 mb-2">Status</label>
              <select
                value={taskData.status}
                onChange={(e) => setTaskData({...taskData, status: e.target.value})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-semibold text-indigo-900 mb-2">Due Date</label>
              <input
                type="datetime-local"
                value={taskData.dueDate || ''}
                min={minDate}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-indigo-900 mb-2">Priority</label>
            <select
              value={taskData.priority}
              onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-indigo-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTask