// @ts-nocheck
'use client'
import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaLinkedin } from 'react-icons/fa'
import axios from 'axios'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

interface GoogleAuthResponse {
    authorization_url?: string;
    access?: string;
    refresh?: string;
    user?: string;
}

const AccountCreationContent = () => {
    const [loading, setLoading] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const searchParams = useSearchParams()
    const router = useRouter()

    // Array of login page images
    const loginImages = [
        '/images/login_page.svg',
        '/images/login_page2.svg',
        '/images/login_page3.svg'
    ]

    const COOKIE_OPTIONS = {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/'
    };

    // Auto-rotate images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % loginImages.length)
        }, 4000) // Change image every 4 seconds

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        if (code && state) {
            handleGoogleCallback(code, state)
        }
    }, [searchParams])

    const handleGoogleAuth = async () => {
        setLoading(true)
        try {
            
            const isDevelopment = process.env.NODE_ENV === 'development';
            let redirectUri = 'https://growupbuddy.com/auth/google';
            
            if (isDevelopment && process.env.NEXT_PUBLIC_FRONTEND_URL) {
                redirectUri = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/google`;
            }
            
            console.log('Using redirect URI:', redirectUri);
            
            let response;
            try {
                response = await axios.get<GoogleAuthResponse>(`https://backend.growupbuddy.com/api/auth/o/google-oauth2/?redirect_uri=${encodeURIComponent(redirectUri)}`);
            } catch (localError) {
                if (isDevelopment) {
                    console.warn('Failed with localhost, falling back to production URL:', localError);
                    redirectUri = 'https://growupbuddy.com/auth/google';
                    response = await axios.get<GoogleAuthResponse>(`https://backend.growupbuddy.com/api/auth/o/google-oauth2/?redirect_uri=${encodeURIComponent(redirectUri)}`);
                } else {
                    throw localError;
                }
            }

            if (response.data.authorization_url) {
                window.location.href = response.data.authorization_url
            }
        } catch (error) {
            console.error("Google auth error:", error)
        } finally {
            setLoading(false)
        }
    }

    // Function to update user role
    const updateUserRole = async (email: string, token:string) => {
        try {
            const response = await axios.patch(
                'https://backend.growupbuddy.com/api/auth/update-user-role/?pk=' + encodeURIComponent(email),
                {
                    role: "freelancer",
                    verify: true
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("Role updated successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    };

    const handleGoogleCallback = async (code: string, state: string) => {
        setLoading(true);
        try {
            const encodedCode = encodeURIComponent(code);

            const response = await axios.post<GoogleAuthResponse>(
                `https://backend.growupbuddy.com/api/auth/o/google-oauth2/?state=${state}&code=${encodedCode}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.access && response.data.refresh) {
                console.log(response.data);
                
                Cookies.set('access_token', response.data.access, COOKIE_OPTIONS);
                Cookies.set('refresh_token', response.data.refresh, COOKIE_OPTIONS);

                if (response.data.user) {
                    Cookies.set('user_id', response.data.user, COOKIE_OPTIONS);

                    const emailMatch = response.data.user.match(/email - ([^\s]+)/) || [];
                    const userEmail = emailMatch[1];

                    if (userEmail) {
                        await updateUserRole(userEmail, response.data.access);
                    }

                    const idMatch = response.data.user.match(/id - ([0-9a-f-]+)/);
                    if (idMatch && idMatch[1]) {
                        Cookies.set('user_id_value', idMatch[1], COOKIE_OPTIONS);
                    }
                }

                router.push('/explore');
            } else {
                console.error("Authentication response missing tokens:", response.data);
            }
        } catch (error) {
            console.error("Google callback error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Apple and LinkedIn handlers would be implemented similarly
    const handleAppleAuth = () => {
        alert("Apple authentication not implemented yet")
    }

    const handleLinkedInAuth = () => {
        alert("LinkedIn authentication not implemented yet")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#E9DAFF] px-6 py-8">
            <div className="max-w-7xl mx-auto h-full">
                {/* Header */}
                <div className="mb-16 flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="GrowUp Buddy"
                        width={60}
                        height={20}
                        className="cursor-pointer"
                    />
                    <h2 className='text-2xl font-semibold ml-3'>GrowUp Buddy</h2>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 min-h-[calc(100vh-200px)]">
                    {/* Left Section - Image Carousel */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-4 lg:px-0">
                        <div className="w-full flex justify-center relative min-h-[280px] sm:min-h-[350px] md:h-[400px] lg:h-[500px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="absolute inset-0 flex items-center justify-center w-full h-full"
                                >
                                    <Image
                                        src={loginImages[currentImageIndex]}
                                        alt={`Opportunities Illustration ${currentImageIndex + 1}`}
                                        width={600}
                                        height={500}
                                        className="w-full h-full max-w-xl object-contain"
                                        priority={currentImageIndex === 0}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 max-w-lg w-full flex flex-col justify-center px-4 lg:px-0">
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">Create Your Account</h1>
                            <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base leading-relaxed px-2">
                                Connect with top students, freelancers, and project-driven recruiters
                            </p>

                            {/* Social Login Buttons */}
                            <div className="space-y-4 bg-[#F1F1F1] p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
                                <button
                                    className="w-full flex items-center bg-white justify-center gap-3 px-2 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium text-base sm:text-lg"
                                    onClick={handleGoogleAuth}
                                    disabled={loading}
                                >
                                    <FcGoogle className="text-xl sm:text-2xl" />
                                    <span>{loading ? 'Loading...' : 'Continue with Google'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LoadingFallback = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#E9DAFF] px-6 py-8">
            <div className="max-w-7xl mx-auto h-full">
                <div className="mb-16 flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="GrowUp Buddy"
                        width={60}
                        height={20}
                        className="cursor-pointer"
                    />
                    <h2 className='text-2xl font-semibold ml-3'>GrowUp Buddy</h2>
                </div>
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg">Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AccountCreation = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AccountCreationContent />
        </Suspense>
    )
}

export default AccountCreation