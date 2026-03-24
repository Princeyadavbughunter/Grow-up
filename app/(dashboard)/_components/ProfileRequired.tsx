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

    // If profile data doesn't exist, show overlay with profile creation
    // NOTE: We render a plain gray background instead of actual children to prevent
    // dashboard components from mounting and firing 404 API calls unnecessarily.
    if (!profileData) {
        return (
            <div className="relative h-screen w-screen overflow-hidden">
                {/* Static gray background — no real components mount here */}
                <div className="absolute inset-0 bg-gray-100 pointer-events-none" />
                
                {/* Overlay backdrop */}
                <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
                
                {/* Profile creation modal */}
                <div className="absolute inset-0 z-20 flex items-start justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl lg:max-w-3xl my-4 sm:my-6">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 rounded-t-lg z-30">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                    Complete Your Profile
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Fill in your profile to continue
                                </p>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 8rem)' }}>
                            <div className="px-3 py-3 sm:px-4 sm:py-4 pb-12 sm:pb-16">
                                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <div className="flex items-start gap-2">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xs sm:text-sm font-medium text-blue-800">
                                                Profile Required
                                            </h3>
                                            <p className="mt-0.5 text-xs sm:text-sm text-blue-700">
                                                You need to complete your profile to access the dashboard features.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Profile form - with scale reduction */}
                                <div className="w-full scale-95 sm:scale-100 origin-top pb-6 sm:pb-8">
                                    <AddBio />
                                </div>
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