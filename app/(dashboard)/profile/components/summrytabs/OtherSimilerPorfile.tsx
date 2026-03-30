// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { FaUserPlus, FaLaptopCode, FaUser } from 'react-icons/fa'
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext"
import { useRouter } from 'next/navigation'

interface Freelancer {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_picture: string;
  address: string;
  city: string;
  state: string;
  skills: string;
  follower_count: number;
  is_following: boolean;
  follow_request_sent: boolean;
  position?: string;
}

interface SimilarProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  summary: string;
  img: string;
  followerCount: number;
  requestSent: boolean;
}

interface OtherSimilarProfileProps {
  freelancerId?: string;
}

const OtherSimilarProfile: React.FC<OtherSimilarProfileProps> = ({ freelancerId }) => {
    const [similarProfiles, setSimilarProfiles] = useState<SimilarProfile[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { api } = useAuthenticatedApi()
    const { isAuthenticated, profileData } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const fetchSimilarProfiles = async (): Promise<void> => {
            try {
                setLoading(true)
                
                // Use the freelancerId prop if provided, otherwise use the current user's ID
                const targetFreelancerId = freelancerId || profileData?.id
                
                if (!targetFreelancerId) {
                    console.error('No freelancer ID available')
                    setSimilarProfiles([])
                    return
                }

                const response = await api.get(`/freelancer/freelancers-similar/?freelancer_id=${targetFreelancerId}`)
                
                // Map the actual API response to our component structure
                const processedProfiles: SimilarProfile[] = response.data.map((freelancer: Freelancer) => ({
                    id: freelancer.id,
                    name: `${freelancer.first_name} ${freelancer.last_name}`.trim(),
                    location: `${freelancer.city || ''}, ${freelancer.state || ''}`.replace(/^,\s*|,\s*$/g, '') || freelancer.address || "Unknown",
                    summary: freelancer.bio || "No bio available",
                    img: freelancer.profile_picture || "",
                    followerCount: freelancer.follower_count || 0,
                    requestSent: freelancer.follow_request_sent || false
                }))

                // Filter out the current user's profile from similar profiles
                const filteredProfiles = processedProfiles.filter(profile => profile.id !== profileData?.id)

                // Limit to 5 profiles
                setSimilarProfiles(filteredProfiles.slice(0, 5))
            } catch (error) {
                console.error('Error fetching similar profiles:', error)
                setSimilarProfiles([])
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated) {
            fetchSimilarProfiles()
        }
    }, [isAuthenticated, freelancerId, profileData?.id])

    const handleConnect = async (freelancerId: string): Promise<void> => {
        try {
            await api.post(`/freelancer/follow/?freelancer_id=${freelancerId}`)
            
            setSimilarProfiles(prevProfiles => 
                prevProfiles.map(profile => 
                    profile.id === freelancerId 
                        ? { ...profile, requestSent: true } 
                        : profile
                )
            )
        } catch (error) {
            console.error('Error sending follow request:', error)
        }
    }

    const handleProfileClick = (profileId: string): void => {
        router.push(`/profile/${profileId}`)
    }

    if (loading) {
        return <div className="flex justify-center items-center">Loading similar profiles...</div>
    }

    return (
        <div className="max-w-full overflow-hidden font-poppins">
                <div className="my-8 w-full">
                    <h3 className="text-[16px] font-semibold mb-6 text-center leading-[100%]">Other similar profiles</h3>
                    <div className="grid gap-3 w-full">
                        {similarProfiles.length > 0 ? (
                            similarProfiles.map((profile) => (
                                <div
                                    key={profile.id}
                                    className="bg-[#F9FAFF] border border-gray-100 rounded-xl p-4 transition-all duration-200 w-full cursor-pointer hover:shadow-sm"
                                    onClick={() => handleProfileClick(profile.id)}
                                >
                                    <div className="flex items-center gap-3 max-w-full">
                                        {profile.img ? (
                                            <img
                                                src={profile.img}
                                                alt={profile.name}
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                <FaUser className="text-gray-500 text-sm" />
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1 min-w-0 max-w-full overflow-hidden">
                                            <p className="text-sm font-medium text-gray-900 truncate">{profile.name}</p>
                                            <p className="text-[11px] text-gray-500 truncate mt-0.5">{profile.location}</p>
                                            
                                            <div className="flex items-center justify-between mt-2">
                                                {profile.followerCount > 0 ? (
                                                     <p className="text-[10px] text-gray-400 truncate">{profile.followerCount} followers</p>
                                                ) : <div />}
                                                
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleConnect(profile.id)
                                                    }}
                                                    disabled={profile.requestSent}
                                                    className={`text-[10px] font-semibold px-3 py-1 border rounded-full transition-colors whitespace-nowrap ${
                                                        profile.requestSent 
                                                            ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed" 
                                                            : "border-[#7052FF] text-[#7052FF] hover:bg-[#7052FF] hover:text-white"
                                                    }`}
                                                >
                                                    {profile.requestSent ? "Sent" : "Connect"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">No similar profiles found.</p>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    )
}

export default OtherSimilarProfile