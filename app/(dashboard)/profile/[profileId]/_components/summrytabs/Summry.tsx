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
    is_diploma: boolean;
    diploma_name: string;
    is_disabled: boolean;
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

            <div className="flex justify-between flex-col md:flex-row gap-10">
                <div className='md:w-1/2'>
                    {activeJobTypeTab === "About" && (
                    <div className='flex flex-col'>
                        <div>
                            <p className='flex items-center py-4 font-semibold gap-5'>Summary </p>
                            <div className="bg-[#F6F8FF] shadow-sm rounded-lg p-4">
                                <p>MY Journey</p>

                                <div className='py-2'>
                                    <p className="flex flex-wrap gap-2 font-semibold">
                                        {skillsArray.length > 0 ? (
                                            skillsArray.map((skill, index) => (
                                                <button key={index} className="font-medium rounded-full px-3 py-1 text-xs sm:text-sm border">
                                                    {skill}
                                                </button>
                                            ))
                                        ) : null}
                                    </p>
                                </div>

                                <p className='text-[#6A737D]'>{profileData?.bio || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}</p>
                            </div>
                        </div>
                        <MyExperience id={profileData?.id} />
                        <MyEducation profileData={profileData} />
                    </div>
                    )}
                    {activeJobTypeTab === "Skills" && (
                        <div className="my-8">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-lg font-bold">My Skills</h2>
                            </div>

                            {skillsArray.length > 0 ? (
                                <div>
                                    <h3 className="font-semibold text-gray-600">Skills</h3>
                                    <div className="flex flex-wrap gap-2 mt-2 border-b py-2">
                                        {skillsArray.map((skill) => (
                                            <span key={skill} className="px-3 py-1 text-xs font-medium border rounded-full bg-[#E4DEFF]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4 text-gray-500 text-center">
                                    No skills added. Click to add some.
                                </div>
                            )}
                        </div>
                    )}

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