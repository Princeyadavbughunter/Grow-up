'use client'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import AddBio from '../profile/create/_components/AddBio'

interface ProfileRequiredProps {
    children: React.ReactNode
}

const ProfileRequired: React.FC<ProfileRequiredProps> = ({ children }) => {
    const { profileData, profileLoading, isAuthenticated, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    // Show loading state while checking authentication and profile
    if (loading || profileLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // If not authenticated, let the auth system handle it
    if (!isAuthenticated) {
        return <>{children}</>
    }

    // If user is on profile creation page, don't show the overlay
    if (pathname.includes('/profile/create')) {
        return <>{children}</>
    }

    // If profile data doesn't exist, show blurred overlay with profile creation
    if (!profileData) {
        return (
            <div className="relative h-full">
                {/* Blurred background content */}
                <div className="absolute inset-0 filter blur-md pointer-events-none">
                    {children}
                </div>
                
                {/* Overlay backdrop */}
                <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
                
                {/* Profile creation modal */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                                    Complete Your Profile
                                </h2>
                                <p className="text-sm text-gray-600 hidden sm:block">
                                    Please fill in your profile information to continue
                                </p>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="px-4 py-6 sm:px-6">
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Profile Required
                                        </h3>
                                        <div className="mt-1 text-sm text-blue-700">
                                            <p>You need to complete your profile to access the dashboard features.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Profile form */}
                            <div className="max-w-none">
                                <AddBio />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // If profile exists, show normal content
    return <>{children}</>
}

export default ProfileRequired 