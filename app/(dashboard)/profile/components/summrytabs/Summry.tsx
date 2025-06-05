import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoMdAdd } from 'react-icons/io'
import { CiCreditCard1 } from 'react-icons/ci'
import OtherSimilerPorfile from './OtherSimilerPorfile'
import Clubs from './Clubs'
import Posts from './Posts'
import Portfolios from './Portfolios'
import MyExperience from './MyExperience'
import MyEducation from './MyEducation'

interface SummryProps {
  profileData: ProfileData | null;
}

const Summry: React.FC<SummryProps> = ({ profileData }) => {
    const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>('About');
    
    const skillsArray = profileData?.skills ? profileData.skills.split(',').map(skill => skill.trim()) : [];
    
    return (
        <div className='w-full mb-32'>
            <div className="flex space-x-4">
                {["About", "Skills", "Porfolio", "Post"].map((tab) => (
                    <Button
                        key={tab}
                        variant={activeJobTypeTab === tab ? "default" : "ghost"}
                        className={activeJobTypeTab === tab ? "bg-[#979797] hover:bg-[#dcdcdc] rounded-full" : "rounded-full bg-[#dcdcdc]"}
                        onClick={() => setActiveJobTypeTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            <div className="flex justify-between gap-10">
                <div className="">
                    <div>
                        <p className='flex items-center py-4 font-semibold gap-5'>Summary <CiEdit /></p>
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

                    <div className="py-10">
                        <MyExperience />
                    </div>

                    <MyEducation profileData={profileData} />

                    {activeJobTypeTab === "Skills" && (
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-lg font-bold">My Skills</h2>
                                <div className="flex items-center gap-2">
                                    <IoMdAdd className="text-xl cursor-pointer" />
                                    <CiCreditCard1 className="text-xl cursor-pointer" />
                                </div>
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
                    
                    {activeJobTypeTab === "Post" && <Posts />}
                </div>

                <div className="div">
                    <OtherSimilerPorfile />
                    <Clubs />
                </div>
            </div>
        </div>
    )
}

export default Summry