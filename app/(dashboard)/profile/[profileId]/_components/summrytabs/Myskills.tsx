import React from 'react'
import { CiCreditCard1 } from 'react-icons/ci'
import { IoMdAdd } from 'react-icons/io'

interface MyskillsProps {
    profileData: any;
}

const Myskills: React.FC<MyskillsProps> = ({ profileData }) => {
    const skillsArray = profileData?.skills ? profileData.skills.split(',').map(skill => skill.trim()) : [];
    const softSkillsArray = profileData?.soft_skills ? profileData.soft_skills.split(',').map(skill => skill.trim()) : [];

    return (
        <div>
            {/* My Skills */}
            <div className="py-10">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Skills</h2>
                </div>
                
                {skillsArray.length > 0 || softSkillsArray.length > 0 ? (
                    <div className="space-y-6">
                        {skillsArray.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Technical Skills</h3>
                                <div className="flex flex-wrap gap-[7.16px]">
                                    {(Array.from(new Set(skillsArray)) as string[]).map((skill, index) => (
                                        <span 
                                            key={`${skill}-${index}`} 
                                            className="inline-flex items-center justify-center min-w-[115px] h-[32px] text-xs font-medium bg-[#E4DEFF] text-black rounded-[14.33px] px-[8.6px] py-[1.43px]"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {softSkillsArray.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Soft Skills</h3>
                                <div className="flex flex-wrap gap-[7.16px]">
                                    {(Array.from(new Set(softSkillsArray)) as string[]).map((skill, index) => (
                                        <span 
                                            key={`${skill}-${index}`} 
                                            className="inline-flex items-center justify-center min-w-[115px] h-[32px] text-xs font-medium bg-[#E4DEFF] text-black rounded-[14.33px] px-[8.6px] py-[1.43px]"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/50">
                        <p className="text-sm">No skills added yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Myskills