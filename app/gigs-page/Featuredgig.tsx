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
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Featured{' '}
          <span className="bg-gradient-to-r from-[#7052FF] to-blue-600 bg-clip-text text-transparent">
            Gigs
          </span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Discover exciting opportunities from top companies in your field
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
        <div className="w-full max-w-3xl">
          {/* Desktop Filter */}
          <div className="hidden sm:flex justify-center">
            <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-2 shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-6 py-3 mx-1 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-102 min-w-[120px] ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-[#7052FF] to-[#5a42d4] text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:text-[#7052FF] hover:bg-[#7052FF]/10'
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
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/30 focus:border-[#7052FF] shadow-sm"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {currentJobs.map((job) => (
          <div
            key={job.id}
            className="group bg-white border border-black/20 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:border-[#7052FF] transition-all duration-200 transform hover:-translate-y-0.5 relative overflow-hidden"
          >
            
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7052FF]/5 via-transparent to-blue-50 opacity-0 group-hover:opacity-30 transition-opacity duration-200 rounded-xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-[#7052FF] transition-colors duration-200 line-clamp-1">
                    {job.company}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium line-clamp-1">
                    {job.role}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 relative bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#7052FF]/10 transition-colors duration-200">
                    <Image
                      src={job.logo}
                      alt={`${job.company} logo`}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Time and Location */}
              <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                <span>{job.time}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{job.location}</span>
              </div>

              {/* Salary */}
              <div className="mb-3">
                <span className="text-base sm:text-lg font-bold text-green-600">{job.salary}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                {job.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-[#7052FF]/10 text-[#7052FF] px-2 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-3 h-3 bg-gray-200 rounded-full flex items-center justify-center mr-1.5">
                    <svg className="w-2 h-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span className="font-medium">{job.appliedCount} applied</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-2 py-1 font-medium">
                  {job.type}
                </span>
              </div>

              {/* Apply Button */}
              <button className="w-full bg-gradient-to-r from-[#7052FF] to-[#5a42d4] hover:from-[#5a42d4] hover:to-[#4a36b8] text-white py-2.5 px-4 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/30 shadow-md hover:shadow-lg group">
                <span>Apply Now</span>
                <svg className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-8 sm:mt-12 md:mt-16">
        <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#7052FF] border border-[#7052FF] hover:border-[#5a42d4] font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/30 shadow-md hover:shadow-lg">
          <span>View All Opportunities</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
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