'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PanelLeftClose, Loader2 } from 'lucide-react'
import { sampleProjects, sampleCategories } from '../../../../Configs/data'
import axios from 'axios'
import { useUserStore } from '../../../../Stores/user-store'

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

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const EditTask = async ({ params, searchParams }: PageProps) => {
  const router = useRouter()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { setUserId, userId } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  const dummyCategories = sampleCategories
  const dummyProjects = sampleProjects

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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/task`, {
          params: {
            id: params.id
          }
        })
        const task = response.data
        setTaskData({
          title: task.title,
          description: task.description,
          status: task.status,
          projectId: task.projectId,
          categoryId: task.categoryId,
          userId: task.userId,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : null,
          priority: task.priority
        })
      } catch (error) {
        console.error('Error fetching task:', error)
        setError('Failed to load task')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [params.id])
  
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

  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  const minDate = today.toISOString().slice(0,16)

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

      const response = await axios.put(`/api/edit?id=${params.id}`, parsedData)

      if (response.status === 200) {
        router.push('/tasks')
        router.refresh()
      } else {
        throw new Error('Failed to update task')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to update task. Please try again.')
        console.error('Error updating task:', error.response?.data?.error || error.message)
      } else {
        setError('An unexpected error occurred')
        console.error('Error updating task:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center bg-gray-100 min-h-screen justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-indigo-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">Edit Task</h1>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            <PanelLeftClose className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-indigo-900 mb-2">Title</label>
            <input
              type="text"
              required
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-indigo-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-indigo-900 mb-2">Description</label>
            <textarea
              rows={4}
              required
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-indigo-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-indigo-900 mb-2">Project</label>
              <select
                value={taskData.projectId || ''}
                onChange={(e) => setTaskData({...taskData, projectId: e.target.value ? parseInt(e.target.value) : null})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-4 py-3 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
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
              <label className="block text-base font-semibold text-indigo-900 mb-2">Category</label>
              <select
                value={taskData.categoryId || ''}
                onChange={(e) => setTaskData({...taskData, categoryId: e.target.value ? parseInt(e.target.value) : null})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-4 py-3 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-indigo-900 mb-2">Status</label>
              <select
                value={taskData.status}
                onChange={(e) => setTaskData({...taskData, status: e.target.value})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-4 py-3 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-indigo-900 mb-2">Due Date</label>
              <input
                type="datetime-local"
                value={taskData.dueDate || ''}
                min={minDate}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                className="mt-1 block w-full rounded-lg border border-indigo-200 px-4 py-3 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-indigo-900 mb-2">Priority</label>
            <select
              value={taskData.priority}
              onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-indigo-200 px-4 py-3 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTask
