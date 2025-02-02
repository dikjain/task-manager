'use client'

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  if (user) {
    return redirect('/dashboard')
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6 lg:p-8">
          <div className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
