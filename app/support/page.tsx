'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import LandingNav from '@/components/LandingNav'
import LandingFooter from '@/components/LandingFooter'

const SupportPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    agreeToPolicy: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    // Check if it's a valid length (10-15 digits)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15
  }

  const validateName = (name: string) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim())
  }

  const validateField = (name: string, value: string | boolean) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || typeof value !== 'string') return `${name === 'firstName' ? 'First' : 'Last'} name is required`
        if (!validateName(value)) return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters and contain only letters`
        return ''
      case 'email':
        if (!value || typeof value !== 'string') return 'Email is required'
        if (!validateEmail(value)) return 'Please enter a valid email address'
        return ''
      case 'phone':
        if (value && typeof value === 'string' && !validatePhone(value)) return 'Please enter a valid phone number'
        return ''
      case 'topic':
        if (!value || typeof value !== 'string') return 'Please select a topic'
        return ''
      case 'message':
        if (!value || typeof value !== 'string') return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters long'
        return ''
      case 'agreeToPolicy':
        if (!value) return 'You must agree to the privacy policy'
        return ''
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
      
      // Validate checkbox field
      const error = validateField(name, checked)
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      // Validate field only if it has been touched
      if (touched[name]) {
        const error = validateField(name, value)
        setFieldErrors(prev => ({
          ...prev,
          [name]: error
        }))
      }
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    // Validate field on blur
    const error = validateField(name, value)
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const errors: {[key: string]: string} = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) errors[key] = error
    })

    setFieldErrors(errors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('https://formspree.io/f/mnngdenw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          topic: formData.topic,
          message: formData.message,
          fullName: `${formData.firstName} ${formData.lastName}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          topic: '',
          message: '',
          agreeToPolicy: false
        })
        setFieldErrors({})
        setTouched({})
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNav />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-24 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl">
            Contact Support
          </h1>
          <p className="text-lg sm:text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Got questions? Feedback? We're here to help.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-start lg:items-center min-h-[600px]">
          {/* Left Side - Illustration */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <div className="relative mb-6 sm:mb-8 lg:mb-12">
              <Image
                src="/objects-contact-page.png"
                alt="Contact Support Illustration"
                width={500}
                height={400}
                className="w-full h-auto max-w-sm sm:max-w-md lg:max-w-full mx-auto"
                priority
              />
            </div>
            <div className="text-center px-2 sm:px-4">
              <p className="text-gray-700 text-base sm:text-lg lg:text-xl font-medium max-w-md lg:max-w-lg mx-auto leading-relaxed">
                "Your Inquiries And Feedback Are Important To Us. We Look Forward To Connecting With You"
              </p>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end mb-8 lg:mb-0">
            <div className="bg-gradient-to-br from-[#7052FF] to-[#8B5CF6] rounded-3xl p-8 sm:p-10 shadow-2xl w-full max-w-md lg:max-w-lg">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-white text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="First Name"
                      className={`w-full px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none transition-all duration-200 ${
                        fieldErrors.firstName ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-white/50'
                      }`}
                      required
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-200 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-white text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Last name"
                      className={`w-full px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none transition-all duration-200 ${
                        fieldErrors.lastName ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-white/50'
                      }`}
                      required
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-200 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="+91 0000 000 000"
                    className={`w-full px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none transition-all duration-200 ${
                      fieldErrors.phone ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-white/50'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-200 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none transition-all duration-200 ${
                      fieldErrors.email ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-white/50'
                    }`}
                    required
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-200 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Topic Selection */}
                <div>
                  <label htmlFor="topic" className="block text-white text-sm font-medium mb-2">
                    What can we help you with?
                  </label>
                  <div className="relative">
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-900 focus:ring-2 focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
                        fieldErrors.topic ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-white/50'
                      }`}
                      required
                    >
                      <option value="" className="text-gray-500">Choose a topic...</option>
                      <option value="found-problem" className="text-gray-900 py-2">Found a problem</option>
                      <option value="feature-request" className="text-gray-900 py-2">Feature Request / Recommendation</option>
                      <option value="join-team" className="text-gray-900 py-2">Join Our Team</option>
                      <option value="club-community" className="text-gray-900 py-2">Club / Community Queries</option>
                      <option value="general" className="text-gray-900 py-2">General Inquiry</option>
                      <option value="other" className="text-gray-900 py-2">Other</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {fieldErrors.topic && (
                    <p className="mt-1 text-sm text-red-200 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.topic}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Leave us a message..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border-0 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none transition-all duration-200 resize-none ${
                        fieldErrors.message ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-white/50'
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.message && (
                    <p className="mt-1 text-sm text-red-200 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Privacy Policy Checkbox */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToPolicy"
                    name="agreeToPolicy"
                    checked={formData.agreeToPolicy}
                    onChange={handleInputChange}
                    className={`mt-1 h-4 w-4 text-[#7052FF] focus:ring-white/50 border-white/30 rounded bg-white/90 ${
                      fieldErrors.agreeToPolicy ? 'ring-2 ring-red-500' : ''
                    }`}
                    required
                  />
                  <div className="flex-1">
                    <label htmlFor="agreeToPolicy" className="text-white text-sm leading-relaxed">
                      You agree to our friendly{' '}
                      <a href="/privacy-policy" className="underline hover:text-white/80 transition-colors">
                        privacy policy
                      </a>
                      .
                    </label>
                    {fieldErrors.agreeToPolicy && (
                      <p className="mt-1 text-sm text-red-200 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.agreeToPolicy}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Message sent successfully!</span>
                    </div>
                    <p className="text-sm mt-1">Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Error sending message!</span>
                    </div>
                    <p className="text-sm mt-1">Please try again or contact us directly.</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg font-semibold focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 ${
                    isSubmitting 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-[#7052FF] hover:bg-gray-100'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-24 py-16 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-6 sm:px-8 md:px-12 rounded-2xl sm:rounded-3xl">
            Meet Our Team
          </h2>
          <p className="text-lg sm:text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            We believe that a great company is defined by its people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Team Member 1 */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300">
                <Image
                  src="/team members/Aryan_Parihar.jpg"
                  alt="Aryan Parihar"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aryan Parihar</h3>
            <p className="text-gray-500 mb-4">CEO</p>
            
            {/* Social Links */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/growup_aryan_official/" 
                  className="group flex items-center justify-center p-3 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 transition-all duration-300 border-r border-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 2.011c-2.7 0-3.04.012-4.1.06-1.064.049-1.791.218-2.427.465-.658.256-1.216.598-1.772 1.153-.555.556-.897 1.114-1.153 1.772-.247.636-.416 1.363-.465 2.427-.048 1.06-.06 1.4-.06 4.1 0 2.7.012 3.04.06 4.1.049 1.064.218 1.791.465 2.427.256.658.598 1.216 1.153 1.772.556.555 1.114.897 1.772 1.153.636.247 1.363.416 2.427.465 1.06.048 1.4.06 4.1.06 2.7 0 3.04-.012 4.1-.06 1.064-.049 1.791-.218 2.427-.465.658-.256 1.216-.598 1.772-1.153.555-.556.897-1.114 1.153-1.772.247-.636.416-1.363.465-2.427.048-1.06.06-1.4.06-4.1 0-2.7-.012-3.04-.06-4.1-.049-1.064-.218-1.791-.465-2.427-.256-.658-.598-1.216-1.153-1.772-.556-.555-1.114-.897-1.772-1.153-.636-.247-1.363-.416-2.427-.465-1.06-.048-1.4-.06-4.1-.06zm0 1.802c2.67 0 2.987.01 4.042.059.976.045 1.505.207 1.858.344.467.182.8.398 1.15.748.35.35.566.683.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.976-.207 1.505-.344 1.858-.182.466-.398.8-.748 1.15-.35.35-.683.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344-.466-.182-.8-.398-1.15-.748-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.182-.467.398-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.04-.058zm0 3.063c-2.794 0-5.058 2.264-5.058 5.058 0 2.794 2.264 5.058 5.058 5.058 2.794 0 5.058-2.264 5.058-5.058 0-2.794-2.264-5.058-5.058-5.058zm0 8.33c-1.81 0-3.272-1.462-3.272-3.272s1.462-3.272 3.272-3.272 3.272 1.462 3.272 3.272-1.462 3.272-3.272 3.272zm6.406-8.845c0 .653-.53 1.183-1.183 1.183-.653 0-1.183-.53-1.183-1.183 0-.653.53-1.183 1.183-1.183.653 0 1.183.53 1.183 1.183z"/>
                  </svg>
                </a>
                
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/919691762703" 
                  className="group flex items-center justify-center p-3 hover:bg-green-500 transition-all duration-300 border-r border-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/aryan-parihar-78ab1a250/" 
                  className="group flex items-center justify-center p-3 hover:bg-blue-600 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Team Member 2 */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-teal-200 to-cyan-300">
                <Image
                  src="/team members/Aryan_Gupta.jpg"
                  alt="Aryan Gupta"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aryan Gupta</h3>
            <p className="text-gray-500 mb-4">CTO</p>
            
            {/* Social Links */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/_aryan011__" 
                  className="group flex items-center justify-center p-3 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 transition-all duration-300 border-r border-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 2.011c-2.7 0-3.04.012-4.1.06-1.064.049-1.791.218-2.427.465-.658.256-1.216.598-1.772 1.153-.555.556-.897 1.114-1.153 1.772-.247.636-.416 1.363-.465 2.427-.048 1.06-.06 1.4-.06 4.1 0 2.7.012 3.04.06 4.1.049 1.064.218 1.791.465 2.427.256.658.598 1.216 1.153 1.772.556.555 1.114.897 1.772 1.153.636.247 1.363.416 2.427.465 1.06.048 1.4.06 4.1.06 2.7 0 3.04-.012 4.1-.06 1.064-.049 1.791-.218 2.427-.465.658-.256 1.216-.598 1.772-1.153.555-.556.897-1.114 1.153-1.772.247-.636.416-1.363.465-2.427.048-1.06.06-1.4.06-4.1 0-2.7-.012-3.04-.06-4.1-.049-1.064-.218-1.791-.465-2.427-.256-.658-.598-1.216-1.153-1.772-.556-.555-1.114-.897-1.772-1.153-.636-.247-1.363-.416-2.427-.465-1.06-.048-1.4-.06-4.1-.06zm0 1.802c2.67 0 2.987.01 4.042.059.976.045 1.505.207 1.858.344.467.182.8.398 1.15.748.35.35.566.683.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.976-.207 1.505-.344 1.858-.182.466-.398.8-.748 1.15-.35.35-.683.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344-.466-.182-.8-.398-1.15-.748-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.182-.467.398-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.04-.058zm0 3.063c-2.794 0-5.058 2.264-5.058 5.058 0 2.794 2.264 5.058 5.058 5.058 2.794 0 5.058-2.264 5.058-5.058 0-2.794-2.264-5.058-5.058-5.058zm0 8.33c-1.81 0-3.272-1.462-3.272-3.272s1.462-3.272 3.272-3.272 3.272 1.462 3.272 3.272-1.462 3.272-3.272 3.272zm6.406-8.845c0 .653-.53 1.183-1.183 1.183-.653 0-1.183-.53-1.183-1.183 0-.653.53-1.183 1.183-1.183.653 0 1.183.53 1.183 1.183z"/>
                  </svg>
                </a>
                
                {/* Telegram */}
                <a 
                  href="http://t.me/AryanGupta011" 
                  className="group flex items-center justify-center p-3 hover:bg-blue-500 transition-all duration-300 border-r border-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/aryangupta011" 
                  className="group flex items-center justify-center p-3 hover:bg-blue-600 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-purple-200 to-indigo-300">
                <Image
                  src="/team members/Antarip.jpg"
                  alt="Antarip Chatterjee"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Antarip Chatterjee</h3>
            <p className="text-gray-500 mb-4">Tech Head</p>

            {/* Social Links */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/antarip31?igsh=ZTlyMWE0MDF3YXdq" 
                  className="group flex items-center justify-center p-3 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 transition-all duration-300 border-r border-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 2.011c-2.7 0-3.04.012-4.1.06-1.064.049-1.791.218-2.427.465-.658.256-1.216.598-1.772 1.153-.555.556-.897 1.114-1.153 1.772-.247.636-.416 1.363-.465 2.427-.048 1.06-.06 1.4-.06 4.1 0 2.7.012 3.04.06 4.1.049 1.064.218 1.791.465 2.427.256.658.598 1.216 1.153 1.772.556.555 1.114.897 1.772 1.153.636.247 1.363.416 2.427.465 1.06.048 1.4.06 4.1.06 2.7 0 3.04-.012 4.1-.06 1.064-.049 1.791-.218 2.427-.465.658-.256 1.216-.598 1.772-1.153.555-.556.897-1.114 1.153-1.772.247-.636.416-1.363.465-2.427.048-1.06.06-1.4.06-4.1 0-2.7-.012-3.04-.06-4.1-.049-1.064-.218-1.791-.465-2.427-.256-.658-.598-1.216-1.153-1.772-.556-.555-1.114-.897-1.772-1.153-.636-.247-1.363-.416-2.427-.465-1.06-.048-1.4-.06-4.1-.06zm0 1.802c2.67 0 2.987.01 4.042.059.976.045 1.505.207 1.858.344.467.182.8.398 1.15.748.35.35.566.683.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.976-.207 1.505-.344 1.858-.182.466-.398.8-.748 1.15-.35.35-.683.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344-.466-.182-.8-.398-1.15-.748-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.182-.467.398-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.04-.058zm0 3.063c-2.794 0-5.058 2.264-5.058 5.058 0 2.794 2.264 5.058 5.058 5.058 2.794 0 5.058-2.264 5.058-5.058 0-2.794-2.264-5.058-5.058-5.058zm0 8.33c-1.81 0-3.272-1.462-3.272-3.272s1.462-3.272 3.272-3.272 3.272 1.462 3.272 3.272-1.462 3.272-3.272 3.272zm6.406-8.845c0 .653-.53 1.183-1.183 1.183-.653 0-1.183-.53-1.183-1.183 0-.653.53-1.183 1.183-1.183.653 0 1.183.53 1.183 1.183z"/>
                  </svg>
                </a>
                
                {/* Telegram */}
                <a 
                  href="http://t.me/antaripC" 
                  className="group flex items-center justify-center p-3 hover:bg-blue-500 transition-all duration-300 border-r border-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/antaripchatterjee10" 
                  className="group flex items-center justify-center p-3 hover:bg-blue-600 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 lg:mt-20">
        <LandingFooter />
      </div>
    </div>
  )
}

export default SupportPage