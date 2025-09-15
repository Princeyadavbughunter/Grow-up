import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

const Hero = () => {
  return (
    <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7052FF]/5 via-white to-blue-50"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#7052FF]/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-[#7052FF]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#7052FF]/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#7052FF]" />
            <span className="text-sm font-medium text-[#7052FF]">Professional Growth Platform</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#4A4A4A] text-center max-w-4xl mx-auto leading-tight mb-6 sm:mb-8">
          Empower your journey to grow with
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-md sm:text-lg md:text-xl text-center leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
          Unlock your potential and accelerate your professional growth with our comprehensive platform designed for modern careers.
        </p>
      </div>
    </div>
  )
}

export default Hero