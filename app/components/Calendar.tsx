'use client'

import { useState } from 'react'
import { useUserStore } from '../../Stores/user-store'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns'
import Link from 'next/link'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { tasks } = useUserStore()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const tasksInMonth = tasks.filter(task => {
    const taskDate = new Date(task.createdAt)
    return isSameMonth(taskDate, currentDate)
  })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={previousMonth}
            className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
          >
            ←
          </button>
          <button
            onClick={nextMonth}
            className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-1 sm:p-2 text-center font-semibold text-gray-600 text-xs sm:text-sm">
            {window.innerWidth < 640 ? day.charAt(0) : day}
          </div>
        ))}

        {daysInMonth.map(day => {
          const dayTasks = tasksInMonth.filter(task => 
            format(new Date(task.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          )

          return (
            <div
              key={day.toString()}
              className={`p-1 sm:p-2 border rounded-lg min-h-[60px] sm:min-h-[100px] ${
                isToday(day) ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
              }`}
            >
              <div className="text-right text-xs sm:text-sm text-gray-600">
                {format(day, 'd')}
              </div>
              <div className="mt-0.5 sm:mt-1">
                {dayTasks.map(task => (
                  <Link href={`/task/${task.id}`} key={task.id}>
                    <div
                      className="text-[10px] sm:text-xs p-0.5 sm:p-1 mb-0.5 sm:mb-1 rounded bg-blue-100 text-blue-800 break-words whitespace-pre-wrap hover:bg-blue-200 transition-colors"
                    >
                      {window.innerWidth < 640 
                        ? task.title.length > 10 
                          ? task.title.substring(0, 10) + '...' 
                          : task.title
                        : task.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
