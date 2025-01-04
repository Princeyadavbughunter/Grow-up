'use client'
import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaLinkedin } from 'react-icons/fa'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { redirect, useSearchParams } from 'next/navigation'

interface GoogleAuthResponse {
    authorization_url?: string;
    access_token?: string;
    refresh_token?: string;
}

const AccountCreation = () => {
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        if (code && state) {
            // handleGoogleCallback(code, state)
            redirect('/')
        }
    }, [searchParams])

    const handleGoogleAuth = async () => {
        setLoading(true)
        try {
            const response = await axios.get<GoogleAuthResponse>('https://rz5dd1tf-8000.inc1.devtunnels.ms/api/auth/o/google-oauth2/?redirect_uri=http://localhost:3000/auth/google')
            if (response.data.authorization_url) {
                window.location.href = response.data.authorization_url
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleCallback = async (code: string, state: string): Promise<GoogleAuthResponse | undefined> => {
        try {
            const response = await axios.post<GoogleAuthResponse>(
                `https://rz5dd1tf-8000.inc1.devtunnels.ms/api/auth/o/google-oauth2/?state=${state}&code=${code}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            // Handle successful authentication
            if (response.data.access_token) {
                // Store token or redirect user
                localStorage.setItem('access_token', response.data.access_token)
                // Redirect to dashboard or home page
                window.location.href = '/dashboard'
            }
            return response.data
        } catch (error) {
            console.error(error)
            return undefined
        }
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
                                Explore Oppurtunities
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
                                Connect with top student and freelancers and project driven recruiters
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

                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                                    <FaApple className="text-xl" />
                                    <span>Continue with Apple ID</span>
                                </button>

                                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-colors">
                                    <FaLinkedin className="text-xl" />
                                    <span>Continue with LinkedIn</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountCreation