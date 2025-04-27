import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoMdAdd } from 'react-icons/io'

const MyEducation = () => {
    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-4  mb-4">
                    <h2 className="text-lg font-bold">My Education</h2>
                    <div className="flex items-center gap-2">
                        <IoMdAdd className="text-xl cursor-pointer" />
                        <CiEdit className="text-xl cursor-pointer" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4">
                        <h3 className="font-semibold">Bachelor in Science</h3>
                        <p className="text-sm text-gray-500">University of Florida</p>
                        <p className="text-sm text-gray-400">Apr 2010 – Apr 2023</p>
                    </div>
                    <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4">
                        <h3 className="font-semibold">Bachelor in Science</h3>
                        <p className="text-sm text-gray-500">University of Florida</p>
                        <p className="text-sm text-gray-400">Apr 2010 – Apr 2023</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MyEducation