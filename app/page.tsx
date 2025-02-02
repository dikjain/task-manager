'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1"
    >
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-blue-600"
            >
              TaskMaster
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/Auth" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="block"
              >
                Manage Your Tasks
              </motion.span>
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="block text-blue-600"
              >
                Like Never Before
              </motion.span>
            </h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            >
              TaskMaster helps you organize your daily tasks, manage projects, and boost your productivity with powerful features and intuitive design.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
            >
              <div className="rounded-md shadow">
                <Link href="/Auth" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Get Started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to stay organized
            </h2>
          </motion.div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Smart Task Management',
                description: 'Create, organize and track your tasks with ease. Set priorities and due dates to stay on top of your work.'
              },
              {
                title: 'Project Organization',
                description: 'Group related tasks into projects. Get a clear overview of project progress and upcoming deadlines.'
              },
              {
                title: 'Calendar Integration',
                description: 'View your tasks in a calendar format. Plan your schedule effectively with our intuitive calendar interface.'
              },
              {
                title: 'Team Collaboration',
                description: 'Share tasks and projects with team members. Keep everyone aligned and productive.'
              },
              {
                title: 'Progress Analytics',
                description: 'Track your productivity with detailed insights and progress reports.'
              },
              {
                title: 'Mobile Access',
                description: 'Access your tasks anywhere with our mobile-friendly interface.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-blue-900">{feature.title}</h3>
                <p className="mt-3 text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to transform your productivity?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of users who are already managing their tasks better.
            </p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Link href="/Auth" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300">
                Start for free
                <ArrowRightIcon className="ml-3 h-5 w-5"/>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 pt-8 border-t border-gray-800"
          >
            <p className="text-gray-400 text-center">
              &copy; 2024 TaskMaster. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </footer>
    </motion.div>
  )
}