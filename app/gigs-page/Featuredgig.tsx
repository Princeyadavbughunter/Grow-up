// @ts-nocheck
'use client'
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'

const Featuredgig = () => {
  const [activeCategory, setActiveCategory] = useState('Developer')

  const categories = ['Developer', 'Design', 'Marketing', 'Data Scientist']
  
  const jobsByCategory = {
    Developer: [
      {
        id: 1,
        company: 'Amazon',
        logo: '/amazon-logo.png',
        role: 'Senior Full Stack Developer',
        time: '2h ago',
        description: 'Join our dynamic team to build scalable web applications using React, Node.js, and AWS services. Experience with microservices architecture preferred.',
        appliedCount: 127,
        type: 'Full-time',
        salary: '$80k - $120k',
        location: 'Remote',
        tags: ['React', 'Node.js', 'AWS']
      },
      {
        id: 2,
        company: 'Google',
        logo: '/amazon-logo.png',
        role: 'Frontend Developer',
        time: '5h ago',
        description: 'Create stunning user interfaces for our next-generation products. Work with cutting-edge technologies and collaborate with world-class designers.',
        appliedCount: 89,
        type: 'Contract',
        salary: '$60k - $90k',
        location: 'San Francisco',
        tags: ['Vue.js', 'TypeScript', 'CSS3']
      },
      {
        id: 3,
        company: 'Microsoft',
        logo: '/amazon-logo.png',
        role: 'Backend Engineer',
        time: '1d ago',
        description: 'Build robust APIs and server-side applications. Experience with C#, .NET Core, and Azure cloud services required.',
        appliedCount: 156,
        type: 'Full-time',
        salary: '$90k - $130k',
        location: 'Seattle',
        tags: ['C#', '.NET', 'Azure']
      },
      {
        id: 4,
        company: 'Meta',
        logo: '/amazon-logo.png',
        role: 'Mobile App Developer',
        time: '2d ago',
        description: 'Develop cross-platform mobile applications using React Native. Join our team building the future of social connectivity.',
        appliedCount: 203,
        type: 'Full-time',
        salary: '$85k - $125k',
        location: 'New York',
        tags: ['React Native', 'iOS', 'Android']
      }
    ],
    Design: [
      {
        id: 5,
        company: 'Apple',
        logo: '/amazon-logo.png',
        role: 'Senior UX Designer',
        time: '3h ago',
        description: 'Lead design initiatives for our consumer products. Create intuitive user experiences that delight millions of users worldwide.',
        appliedCount: 78,
        type: 'Full-time',
        salary: '$95k - $140k',
        location: 'Cupertino',
        tags: ['Figma', 'Sketch', 'Prototyping']
      },
      {
        id: 6,
        company: 'Adobe',
        logo: '/amazon-logo.png',
        role: 'Visual Designer',
        time: '6h ago',
        description: 'Create compelling visual designs for digital products. Work with brand guidelines and contribute to our design system.',
        appliedCount: 65,
        type: 'Contract',
        salary: '$70k - $100k',
        location: 'Remote',
        tags: ['Photoshop', 'Illustrator', 'After Effects']
      }
    ],
    Marketing: [
      {
        id: 7,
        company: 'Spotify',
        logo: '/amazon-logo.png',
        role: 'Digital Marketing Manager',
        time: '4h ago',
        description: 'Drive growth through innovative digital marketing campaigns. Manage social media, email marketing, and paid advertising.',
        appliedCount: 92,
        type: 'Full-time',
        salary: '$65k - $95k',
        location: 'Stockholm',
        tags: ['SEO', 'Google Ads', 'Analytics']
      }
    ],
    'Data Scientist': [
      {
        id: 8,
        company: 'Netflix',
        logo: '/amazon-logo.png',
        role: 'Senior Data Scientist',
        time: '1h ago',
        description: 'Analyze user behavior and recommendation algorithms. Work with big data to improve content discovery and user engagement.',
        appliedCount: 134,
        type: 'Full-time',
        salary: '$110k - $160k',
        location: 'Los Angeles',
        tags: ['Python', 'ML', 'TensorFlow']
      }
    ]
  }

  const currentJobs = jobsByCategory[activeCategory] || jobsByCategory.Developer

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
          Featured{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Gigs
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover exciting opportunities from top companies in your field
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
        <div className="w-full max-w-2xl">
          {/* Desktop Filter */}
          <div className="hidden sm:flex justify-center">
            <div className="inline-flex border-2 rounded-full border-gray-300 bg-gray-50 p-1 shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filter */}
          <div className="sm:hidden">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        {currentJobs.map((job) => (
          <div
            key={job.id}
            className="group bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
          >
            
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                    {job.company}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium line-clamp-1">
                    {job.role}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 relative bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300">
                    <Image
                      src={job.logo}
                      alt={`${job.company} logo`}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Time and Location */}
              <div className="flex items-center justify-between mb-4 text-xs sm:text-sm text-gray-500">
                <span>{job.time}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full">{job.location}</span>
              </div>

              {/* Salary */}
              <div className="mb-4">
                <span className="text-lg sm:text-xl font-bold text-green-600">{job.salary}</span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3">
                {job.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs sm:text-sm bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span className="font-medium">{job.appliedCount} applied</span>
                </div>
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-medium">
                  {job.type}
                </span>
              </div>

              {/* Apply Button */}
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl group">
                <span>Apply Now</span>
                <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-12 sm:mt-16 md:mt-20">
        <button className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 hover:border-purple-700 font-semibold text-base sm:text-lg px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl">
          <span>View All Opportunities</span>
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default Featuredgig