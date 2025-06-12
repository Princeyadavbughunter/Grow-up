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

interface GoogleAuthResponse {
    authorization_url?: string;
    access?: string;
    refresh?: string;
    user?: string;
}

const AccountCreationContent = () => {
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    const COOKIE_OPTIONS = {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/'
    };

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
            const response = await axios.get<GoogleAuthResponse>('https://backend.growupbuddy.com/api/auth/o/google-oauth2/?redirect_uri=https://growupbuddy.com/auth/google')

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

                router.push('/');
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
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#E9DAFF] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="GrowUp Buddy"
                        width={60}
                        height={20}
                        className="cursor-pointer"
                    />
                    <h2 className='text-2xl font-semibold'>GrowUp Buddy</h2>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Left Section */}
                    <div className="flex-1 flex flex-col gap-10 items-center justify-center">
                        <Image
                            src="/images/illustration.svg"
                            alt="Opportunities Illustration"
                            width={300}
                            height={250}
                        />
                        <div>
                            <h2 className="text-2xl font-bold mt-6 mb-3 text-center">
                                Explore Opportunities
                            </h2>
                            <p className="text-gray-600 text-center max-w-md mx-auto">
                                Welcome to a world of opportunities, where every corner holds the potential for growth and discovery.
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 max-w-md w-full">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-3">Create Your Account</h1>
                            <p className="text-gray-600 mb-8">
                                Connect with top students, freelancers, and project-driven recruiters
                            </p>

                            {/* Social Login Buttons */}
                            <div className="space-y-4 bg-[#F1F1F1] p-8 rounded-2xl shadow-lg">
                                <button
                                    className="w-full flex items-center bg-white justify-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                                    onClick={handleGoogleAuth}
                                    disabled={loading}
                                >
                                    <FcGoogle className="text-xl" />
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
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#E9DAFF] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="GrowUp Buddy"
                        width={60}
                        height={20}
                        className="cursor-pointer"
                    />
                    <h2 className='text-2xl font-semibold'>GrowUp Buddy</h2>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
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