import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        {/* Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Professional Growth Platform</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center text-gray-900 max-w-4xl mx-auto leading-tight mb-6 sm:mb-8">
          Empower your journey to{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
              grow
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </span>
          {' '}with
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg sm:text-xl md:text-2xl text-center leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
          Unlock your potential and accelerate your professional growth with our comprehensive platform designed for modern careers.
        </p>
      </div>
    </div>
  )
}

export default Hero