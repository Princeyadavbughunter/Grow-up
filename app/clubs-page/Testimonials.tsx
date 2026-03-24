'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'

const Testimonials = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(300) // 5:00 duration as shown in design
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Fixed waveform heights to avoid hydration mismatch (Math.random differs between server & client)
  const WAVEFORM_HEIGHTS = [
    20, 35, 15, 42, 28, 48, 12, 38, 25, 44, 18, 32, 47, 22, 41, 14, 36, 29,
    50, 19, 43, 27, 16, 39, 24, 46, 13, 33, 48, 21, 37, 26, 49, 17, 40, 30,
    15, 44, 23, 45, 11, 34, 28, 47, 20, 38, 25, 43, 18, 36, 29, 50, 14, 41,
    22, 46, 16, 35, 27, 48,
  ];

  // Create visual waveform bars (simplified representation)
  const createWaveformBars = () => {
    return WAVEFORM_HEIGHTS.map((height, i) => (
      <div
        key={i}
        className="bg-[#7052FF] rounded-full transition-all duration-200"
        style={{
          width: '3px',
          height: `${height}px`,
          opacity: i < (currentTime / duration) * 60 ? 1 : 0.3,
        }}
      />
    ));
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
      
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#4A4A4A] leading-tight mb-6 sm:mb-8">
          Why Choose GrowUp Buddy?
        </h1>
        <p className="text-[#4A4A4A] text-lg sm:text-xl md:text-2xl font-normal max-w-2xl mx-auto leading-relaxed">
          Hear from Our Community
        </p>
      </div>

      {/* Audio Player Card */}
      <div className="bg-gradient-to-r from-[#E9DAFF] to-[#F3EFFF] rounded-3xl sm:rounded-[40px] p-8 sm:p-12 md:p-16 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 md:gap-16">
          
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/p.png" // Using existing profile image
                width={160}
                height={160}
                alt="Community member testimonial"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Audio Player Content */}
          <div className="flex-1 w-full">
            
            {/* Waveform and Controls */}
            <div className="flex items-center gap-4 sm:gap-6 mb-6">
              
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#7052FF] hover:bg-[#5a42d4] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group"
              >
                {isPlaying ? (
                  // Pause Icon
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                ) : (
                  // Play Icon
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* Waveform Visualization */}
              <div className="flex-1 flex items-center justify-center gap-1 h-12 sm:h-14 md:h-16">
                {createWaveformBars()}
              </div>

              {/* Duration */}
              <div className="flex-shrink-0 text-[#4A4A4A] text-lg sm:text-xl font-medium">
                {formatTime(duration)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mb-4">
              <div 
                className="bg-[#7052FF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Testimonial Text Preview */}
            <div className="text-[#4A4A4A] text-base sm:text-lg leading-relaxed">
              <p className="italic">
                "GrowUp Buddy has completely transformed how I approach my career. The community support and networking opportunities are incredible..."
              </p>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onEnded={() => setIsPlaying(false)}
        >
          {/* Add actual audio source when available */}
          {/* <source src="/audio/testimonial.mp3" type="audio/mpeg" /> */}
        </audio>
      </div>
    </div>
  )
}

export default Testimonials