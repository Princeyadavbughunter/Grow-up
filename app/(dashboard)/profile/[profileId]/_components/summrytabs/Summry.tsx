// @ts-nocheck
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import OtherSimilerPorfile from '../../../components/summrytabs/OtherSimilerPorfile'
import Posts from './Posts'
import Portfolios from './Portfolios'
import MyExperience from './MyExperience'
import MyEducation from './MyEducation'
import Clubs from '../../../components/summrytabs/Clubs'
import MyApplications from '../../../components/summrytabs/MyApplications'
import Myskills from './Myskills'
import { useAuth } from '@/context/AuthContext'



interface FreelancerProfile {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    bio: string;
    university_name: string;
    graduation_year_from: string;
    profile_picture: string;
    address: string;
    lat: number | null;
    long: number | null;
    city: string;
    district: string;
    pincode: number;
    state: string;
    interest_in: string;
    hobbies: string;
    highest_qualification: string;
    passing_year: string;
    created_at: string;
    degree_name: string;
    is_degree: boolean;
    resume: string | null;
    skills: string;
    gender: string;
    saved_jobs_count: number;
    follower_count: number;
    dribble_account: string | null;
    github_account: string | null;
    figma_account: string | null;
    youtube_account: string | null;
    medium_account: string | null;
    soft_skills: string;
    position: string;
    user: string;
    work_experience: any[];
    facebook_account?: string | null;
    linkedin_account?: string | null;
    instagram_account?: string | null;
    twitter_account?: string | null;
}

interface SummryProps {
    profileData: FreelancerProfile;
    profileId?: string;
}

const Summry: React.FC<SummryProps> = ({ profileData, profileId }) => {
    const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>("About");
    const { profileData: currentUser } = useAuth();
    
    // Check if this profile belongs to the currently logged-in user
    const isOwnProfile = !!(currentUser?.id && profileData?.id && 
      (currentUser.id === profileData.id || 
       currentUser.id === (profileData as any).user ||
       String(currentUser.id) === String(profileData.id)));

    const skillsArray = profileData?.skills ? profileData.skills.split(',').map(skill => skill.trim()) : [];

    return (
        <div className='w-full mb-10'>
            <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-4">
                {["About", "Skills", "Porfolio", "Post", "Applications"].map((tab) => (
                    <Button
                        key={tab}
                        variant={activeJobTypeTab === tab ? "default" : "ghost"}
                        className={activeJobTypeTab === tab ? "bg-[#979797] hover:bg-[#dcdcdc] rounded-full" : "rounded-full bg-[#dcdcdc]"}
                        // @ts-ignore
                        onClick={() => setActiveJobTypeTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            <div className="flex justify-between flex-col md:flex-row gap-8 lg:gap-16 mt-6">
                <div className='md:w-[60%] flex-1'>
                    {activeJobTypeTab === "About" && (
                    <div className='flex flex-col'>
                        <div>
                            <p className='flex items-center py-4 font-medium gap-5'>Summary </p>
                            <div className="bg-[#F6F8FF] p-4 rounded-xl">
                                <p className="font-medium mb-1">My Journey</p>

                                <div className='py-2'>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsArray.length > 0 ? (
                                            Array.from(new Set(skillsArray)).map((skill, index) => (
                                                <span key={`${skill}-${index}`} className="font-medium rounded-full px-3 py-1 text-xs sm:text-sm bg-white text-gray-700">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : null}
                                    </div>
                                </div>

                                <p className='text-[#6A737D] text-sm leading-relaxed'>{profileData?.bio || 'No bio available'}</p>
                            </div>
                        </div>
                        <MyExperience id={profileData?.id} workExperiences={profileData?.work_experience || profileData?.work_experiences} isOwnProfile={isOwnProfile} />
                        <MyEducation profileData={profileData} />
                        <Myskills profileData={profileData} />
                    </div>
                    )}
                    {activeJobTypeTab === "Skills" && <Myskills profileData={profileData} />}

                    {activeJobTypeTab === "Porfolio" && <Portfolios profileData={profileData} />}

                    {activeJobTypeTab === "Post" && <Posts profileId={profileId} />}

                    {activeJobTypeTab === "Applications" && <MyApplications profileId={profileId} isOwnProfile={false} />}
                </div>

                <div className="md:w-1/2">
                    <OtherSimilerPorfile freelancerId={profileId} />
                    <Clubs />
                </div>
            </div>
        </div>
    )
}

export default Summry