'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const ClubPreview = () => {
  const router = useRouter()
  
  const clubs = [
    {
      name: 'Marketing Club',
      description: 'Connect with marketing professionals and share growth strategies.',
      members: 1247,
      posts: 89,
      category: 'Business'
    },
    {
      name: 'Finance Club',
      description: 'Investment insights, financial planning, and market discussions.',
      members: 892,
      posts: 156,
      category: 'Finance'
    },
    {
      name: 'Tech Club',
      description: 'Latest technology trends, coding insights, and innovation.',
      members: 2134,
      posts: 234,
      category: 'Technology'
    },
    {
      name: 'Design Club',
      description: 'UI/UX design, creative inspiration, and portfolio feedback.',
      members: 678,
      posts: 145,
      category: 'Design'
    },
    {
      name: 'Startup Club',
      description: 'Entrepreneurship, funding, and building successful startups.',
      members: 1532,
      posts: 198,
      category: 'Business'
    },
    {
      name: 'Web3 Club',
      description: 'Blockchain, cryptocurrency, and decentralized technologies.',
      members: 945,
      posts: 167,
      category: 'Technology'
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="text-center mt-16 sm:mt-24 md:mt-32 lg:mt-40 mb-12 sm:mb-16 md:mb-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#4A4A4A] leading-tight max-w-4xl mx-auto mb-8 sm:mb-12">
          Join Professional{' '}
          <span className="bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text-[#7052FF] px-4 py-2">
            Communities
          </span>
        </h1>
        <p className="text-[#696C78] text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Connect with like-minded professionals, share knowledge, and grow your network in specialized communities.
        </p>
      </div>

      {/* Club Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-20">
        {clubs.map((club, index) => (
          <motion.div
            key={club.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border-2 border-[#7052FF]/10 hover:border-[#7052FF]/30 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Club Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-[#4A4A4A] group-hover:text-[#7052FF] transition-colors">
                  {club.name}
                </h3>
                <span className="text-xs font-medium text-[#696C78] bg-gray-100 px-2 py-1 rounded-full">
                  {club.category}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#696C78] mb-3">
                <span>{club.members.toLocaleString()} members</span>
                <span className="w-1 h-1 bg-[#696C78] rounded-full"></span>
                <span>{club.posts} posts</span>
              </div>
            </div>

            {/* Club Description */}
            <p className="text-[#696C78] text-sm leading-relaxed mb-6">
              {club.description}
            </p>

            {/* Join Button */}
            <button 
              onClick={() => router.push('/clubs')}
              className="w-full py-3 px-4 rounded-xl font-medium text-[#7052FF] border-2 border-[#7052FF]/20 hover:bg-[#7052FF] hover:text-white transition-all duration-300"
            >
              View Community
            </button>
          </motion.div>
        ))}
      </div>

      {/* Simple Feature Highlight */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#4A4A4A] mb-4">
          Built for Professional Growth
        </h2>
        <p className="text-[#696C78] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
          Each community features structured discussions, networking opportunities, knowledge sharing, 
          and exclusive events designed to accelerate your professional development.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-[#7052FF] rounded-sm"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Discussions</h4>
            <p className="text-sm text-[#696C78]">Structured forums</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-[#7052FF] rounded-full"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Networking</h4>
            <p className="text-sm text-[#696C78]">Connect with peers</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-4 h-6 bg-[#7052FF] rounded-sm"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Events</h4>
            <p className="text-sm text-[#696C78]">Exclusive workshops</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-4 bg-[#7052FF] rounded-sm"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Resources</h4>
            <p className="text-sm text-[#696C78]">Curated content</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubPreview