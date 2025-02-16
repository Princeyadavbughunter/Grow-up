import React from 'react'
import { CiCreditCard1 } from 'react-icons/ci'
import { IoMdAdd } from 'react-icons/io'

const Myskills = () => {
    return (
        <div>
            {/* My Skills */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg font-bold">My Skills</h2>
                    <div className="flex items-center gap-2">
                        <IoMdAdd className="text-xl cursor-pointer" />
                        <CiCreditCard1 className="text-xl cursor-pointer" />
                    </div>
                </div>
                {[
                    { category: "Getting Started", skills: ["Premiere Pro", "Operation", "Flutter", "Social Media"] },
                    { category: "Soft Skills", skills: ["Communication", "Leadership", "Problem-Solving"] },
                ].map((group) => (
                    <div key={group.category}>
                        <h3 className="font-semibold text-gray-600">{group.category}</h3>
                        <div className="flex flex-wrap gap-2 mt-2 border-b py-2">
                            {group.skills.map((skill) => (
                                <span key={skill} className="px-3 py-1 text-xs font-medium border rounded-full bg-[#E4DEFF]">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Myskills