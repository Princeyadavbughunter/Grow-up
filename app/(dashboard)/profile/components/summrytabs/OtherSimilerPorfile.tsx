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

const OtherSimilarProfile: React.FC = () => {
    const [similarProfiles, setSimilarProfiles] = useState<SimilarProfile[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { api } = useAuthenticatedApi()
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const fetchSimilarProfiles = async (): Promise<void> => {
            try {
                setLoading(true)
                const response = await api.get('/freelancer/unfollowed-freelancers/')
                
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
                
                // Limit to 5 profiles
                setSimilarProfiles(processedProfiles.slice(0, 5))
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
    }, [isAuthenticated])

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
        <div className="max-w-full overflow-hidden">
                <div className="my-8 w-full">
                    <h3 className="text-lg font-semibold mb-4">Other similar profiles</h3>
                    <div className="grid gap-4 w-full">
                        {similarProfiles.length > 0 ? (
                            similarProfiles.map((profile) => (
                                <div
                                    key={profile.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 w-full cursor-pointer"
                                    onClick={() => handleProfileClick(profile.id)}
                                >
                                    <div className="flex items-start gap-4 max-w-full">
                                        {profile.img ? (
                                            <img
                                                src={profile.img}
                                                alt={profile.name}
                                                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                <FaUser className="text-gray-500 text-xl" />
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1 min-w-0 max-w-full overflow-hidden">
                                            <p className="text-sm text-gray-600 truncate max-w-full">{profile.name}</p>
                                            <p className="text-sm text-gray-600 mt-2 overflow-hidden" 
                                               style={{
                                                   display: '-webkit-box',
                                                   WebkitLineClamp: 2,
                                                   WebkitBoxOrient: 'vertical',
                                                   textOverflow: 'ellipsis'
                                               }}>
                                               {profile.location}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-2 overflow-hidden" 
                                               style={{
                                                   display: '-webkit-box',
                                                   WebkitLineClamp: 2,
                                                   WebkitBoxOrient: 'vertical',
                                                   textOverflow: 'ellipsis'
                                               }}>
                                               {profile.summary}
                                            </p>
                                            {profile.followerCount > 0 && (
                                                <p className="text-sm text-gray-500 mt-1 truncate">{profile.followerCount} followers</p>
                                            )}
                                            <div className="flex items-center mt-4">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleConnect(profile.id)
                                                    }}
                                                    disabled={profile.requestSent}
                                                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 border rounded-full transition-colors whitespace-nowrap ${
                                                        profile.requestSent 
                                                            ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed" 
                                                            : "border-blue-500 text-blue-500 hover:bg-blue-50"
                                                    }`}
                                                >
                                                    <FaUserPlus className="text-sm flex-shrink-0" />
                                                    {profile.requestSent ? "Request Sent" : "Connect"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No similar profiles found.</p>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    )
}

export default OtherSimilarProfile