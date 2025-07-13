'use client'
import React, { useState, useEffect, useRef } from 'react'

const Counter = () => {
  const [counters, setCounters] = useState({
    members: 0,
    projects: 0,
    earnings: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef(null)

  const stats = [
    {
      id: 'members',
      finalValue: 50000,
      label: 'Community Members',
      suffix: '+',
      icon: '👥'
    },
    {
      id: 'projects',
      finalValue: 25000,
      label: 'Projects Completed',
      suffix: '+',
      icon: '🚀'
    },
    {
      id: 'earnings',
      finalValue: 1200000,
      label: 'Total Earnings',
      suffix: '+',
      icon: '💰',
      prefix: '$'
    }
  ]

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
  }

  // Animate counter
  const animateCounter = (id, finalValue) => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = finalValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= finalValue) {
        current = finalValue
        clearInterval(timer)
      }
      
      setCounters(prev => ({
        ...prev,
        [id]: Math.floor(current)
      }))
    }, duration / steps)
  }

  // Intersection Observer to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          stats.forEach(stat => {
            animateCounter(stat.id, stat.finalValue)
          })
        }
      },
      {
        threshold: 0.3
      }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [isVisible])

  return (
    <div className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
      
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#4A4A4A] leading-tight max-w-4xl mx-auto">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Some Numbers That Matter
          </span>
        </h1>
      </div>

      {/* Counter Background Section */}
      <div 
        ref={counterRef}
        className="relative bg-cover bg-center bg-no-repeat min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/counter-bg.png')" }}
      >
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
            {stats.map((stat, index) => (
              <div 
                key={stat.id}
                className="text-center group transform hover:scale-105 transition-all duration-300"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                
                {/* Icon */}
                <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.icon}
                </div>
                
                {/* Number */}
                <div className="mb-3 sm:mb-4 md:mb-6">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#7052FF] leading-none group-hover:text-[#5a42d4] transition-colors duration-300">
                    {stat.prefix && <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">{stat.prefix}</span>}
                    {formatNumber(counters[stat.id])}
                    {stat.suffix}
                  </h2>
                </div>
                
                {/* Label */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium leading-relaxed group-hover:text-gray-200 transition-colors duration-300 max-w-xs mx-auto">
                  {stat.label}
                </p>
                
                {/* Animated underline */}
                <div className="w-0 group-hover:w-16 h-1 bg-[#7052FF] mx-auto mt-3 sm:mt-4 transition-all duration-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full opacity-30 animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-300 rounded-full opacity-20 animate-ping delay-500"></div>
      </div>

      {/* Additional spacing after component */}
      <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24"></div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Counter