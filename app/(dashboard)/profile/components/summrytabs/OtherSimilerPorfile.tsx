import React, { useEffect, useState } from 'react'
import { FaUserPlus, FaLaptopCode } from 'react-icons/fa'
import { ImMail4 } from 'react-icons/im'
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext"

interface Freelancer {
  freelancer_id?: string;
  id?: string;
  freelancer_username?: string;
  name?: string;
  title?: string;
  location?: string;
  summary?: string;
  imageUrl?: string;
  follower_count?: number;
}

interface SimilarProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  summary: string;
  img: string;
  followerCount?: number;
  requestSent?: boolean;
}

const OtherSimilarProfile: React.FC = () => {
    const [similarProfiles, setSimilarProfiles] = useState<SimilarProfile[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { api } = useAuthenticatedApi()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        const fetchSimilarProfiles = async (): Promise<void> => {
            try {
                setLoading(true)
                const response = await api.get('/freelancer/unfollowed-freelancers/')
                
                // Assuming the API returns an array of freelancer objects
                const processedProfiles: SimilarProfile[] = response.data.map((freelancer: Freelancer) => ({
                    id: freelancer.freelancer_id || freelancer.id || '',
                    name: freelancer.freelancer_username || freelancer.name || '',
                    title: freelancer.title || "Freelancer",
                    location: freelancer.location || "Unknown",
                    summary: freelancer.summary || "Freelancer profile",
                    img: freelancer.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
                    followerCount: freelancer.follower_count
                }))
                
                setSimilarProfiles(processedProfiles)
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

    if (loading) {
        return <div className="flex justify-center items-center">Loading similar profiles...</div>
    }

    console.log(similarProfiles);

    return (
        <div>
            <div className="mt-12">
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Other similar profiles</h3>
                    <div className="space-y-4">
                        {similarProfiles.length > 0 ? (
                            similarProfiles.map((profile) => (
                                <div
                                    key={profile.id}
                                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    <img
                                        src={profile.img}
                                        alt={profile.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <h4 className="text-sm font-bold">{profile.name}</h4>
                                        <p className="text-xs text-gray-500">{profile.title}</p>
                                        <p className="text-xs text-gray-400">{profile.location}</p>
                                        <p className="text-xs text-gray-400 truncate">{profile.summary}</p>
                                        {profile.followerCount && (
                                            <p className="text-xs text-gray-400">{profile.followerCount} followers</p>
                                        )}

                                        <div className="flex items-center gap-2 mt-2">
                                            <button 
                                                onClick={() => handleConnect(profile.id)}
                                                disabled={profile.requestSent}
                                                className={`flex items-center gap-2 text-sm font-semibold px-4 py-1 border rounded-full transition-colors ${
                                                    profile.requestSent 
                                                        ? "border-gray-300 text-gray-300 cursor-not-allowed" 
                                                        : "border-gray-400 text-gray-400 hover:bg-gray-50"
                                                }`}
                                            >
                                                <FaUserPlus />
                                                {profile.requestSent ? "Request Sent" : "Connect"}
                                            </button>
                                            <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                                <ImMail4 className="text-2xl cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No similar profiles found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtherSimilarProfile