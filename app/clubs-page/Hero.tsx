"use client"

import { useState, useEffect, useRef } from "react"
import { motion, LayoutGroup, AnimatePresence } from "framer-motion"

// Roles and colors
const roles = ["Founder", "Designer", "Developer", "Investor", "Marketer"] as const
type Role = (typeof roles)[number]

const roleColors: Record<Role, string> = {
  Founder: "#FF6B6B",
  Designer: "#4ECDC4",
  Developer: "#7052FF",
  Investor: "#FFD93D",
  Marketer: "#FF8B94",
}

const roleClubs: Record<Role, string> = {
  Founder: "Startup Club",
  Designer: "Design Club", 
  Developer: "Coding Club",
  Investor: "Investor's Club",
  Marketer: "Growth Club",
}

function useScaleToFit() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const c = containerRef.current
      const d = contentRef.current
      if (!c || !d) return
      const cw = c.clientWidth
      const dw = d.scrollWidth
      // Improved scaling with more generous padding and better minimum scale
      const next = cw && dw ? Math.min(1, Math.max(0.5, (cw - 64) / dw)) : 1
      setScale(next)
    }
    
    // Debounce the update function for better performance
    let timeoutId: NodeJS.Timeout
    const debouncedUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(update, 100)
    }
    
    update()
    const ro = new ResizeObserver(debouncedUpdate)
    if (containerRef.current) ro.observe(containerRef.current)
    if (contentRef.current) ro.observe(contentRef.current)
    window.addEventListener("resize", debouncedUpdate)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", debouncedUpdate)
      clearTimeout(timeoutId)
    }
  }, [])

  return { containerRef, contentRef, scale }
}

export default function Hero() {
  const [selectedRole, setSelectedRole] = useState<Role>("Developer")
  const { containerRef, contentRef, scale } = useScaleToFit()

  // Auto-rotate roles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedRole((current) => {
        const currentIndex = roles.indexOf(current)
        const nextIndex = (currentIndex + 1) % roles.length
        return roles[nextIndex]
      })
    }, 3000) // Change role every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const otherRoles = roles.filter((r) => r !== selectedRole)
  const topRoles = otherRoles.slice(0, 2)
  const bottomRoles = otherRoles.slice(2)

  // Animation config
  const spring = { type: "spring" as const, stiffness: 500, damping: 40, mass: 0.6 }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 mt-8">
      <section className="bg-[#23282C] w-full min-h-[400px] sm:min-h-[550px] lg:min-h-[500px] rounded-[20px] sm:rounded-[40px] lg:rounded-[80px] flex flex-col justify-center items-center relative">
        {/* Hidden reference image (design guidance) - removed to prevent potential 404 */}
        {/* <img src="/images/hero-reference.png" alt="Reference design for the hero section" className="hidden" /> */}

        <div className="flex flex-col items-center justify-center h-full w-full py-8 sm:py-12 lg:py-16 px-4">
          <LayoutGroup>
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              {/* Top roles - smaller and more faded */}
              <div className="flex flex-col items-center space-y-2 sm:space-y-3 mb-6 sm:mb-8 lg:mb-12">
                {topRoles.map((role, index) => (
                  <motion.button
                    key={role}
                    onClick={() => setSelectedRole(role as Role)}
                    aria-pressed={false}
                    className="cursor-pointer transition-colors hover:text-white text-sm sm:text-base md:text-lg"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    style={{
                      fontSize: index === 0 ? "0.9rem" : "0.8rem",
                      color: "rgba(255,255,255," + (index === 0 ? 0.65 : 0.5) + ")",
                    }}
                  >
                    {role}
                  </motion.button>
                ))}
              </div>

              {/* Headline - single line enforced with better mobile handling */}
              <div
                ref={containerRef}
                className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 lg:px-6 mb-6 sm:mb-8 lg:mb-12"
              >
                <motion.div
                  ref={contentRef}
                  style={{ scale }}
                  transition={spring}
                  className="inline-flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 will-change-transform whitespace-nowrap w-full"
                >
                  <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white">You are a</span>

                  <motion.div
                    key={`role-pill-${selectedRole}`}
                    layoutId="role-pill"
                    transition={spring}
                    className="rounded-xl sm:rounded-2xl bg-[#4A4A4A] px-2 sm:px-3 lg:px-5 py-1 sm:py-2"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={selectedRole}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={spring}
                        className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white"
                      >
                        {selectedRole}
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>

                  <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white">join</span>

                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`club-${selectedRole}`}
                      className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={spring}
                      style={{
                        background: `linear-gradient(45deg, ${roleColors[selectedRole]}, #6F4DF6, ${roleColors[selectedRole]})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {roleClubs[selectedRole]}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Bottom roles - smaller and more faded */}
              <div className="flex flex-col items-center space-y-2 sm:space-y-3 mt-6 sm:mt-8">
                {bottomRoles.map((role, index) => (
                  <motion.button
                    key={role}
                    onClick={() => setSelectedRole(role as Role)}
                    aria-pressed={false}
                    className="cursor-pointer transition-colors hover:text-white text-sm sm:text-base md:text-lg"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.25, delay: (topRoles.length + index) * 0.05 }}
                    style={{
                      fontSize: index === 0 ? "0.8rem" : "0.7rem",
                      color: "rgba(255,255,255," + (index === 0 ? 0.5 : 0.4) + ")",
                    }}
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </div>
          </LayoutGroup>
        </div>

        {/* Decorative elements (kept subtle) - with careful positioning to avoid text overlap */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#7052FF] rounded-full opacity-20 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-[#B19CD9] rounded-full opacity-15 animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white rounded-full opacity-40 animate-ping" />
          <div className="absolute top-1/4 left-1/3 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-[#7052FF] rounded-full opacity-30 animate-ping delay-700" />
          <div className="absolute top-16 right-16 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-16 left-16 w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10 border-2 border-[#7052FF]/30 rounded-full" />
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
