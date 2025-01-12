import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoMdAdd } from 'react-icons/io'

const MyExperience = () => {
    return (
        <div>
            <div className="py-10">
                <div className="flex items-center gap-4  mb-4">
                    <h2 className="text-lg font-bold">My Experience</h2>
                    <div className="flex items-center gap-2">
                        <IoMdAdd className="text-xl cursor-pointer" />
                        <CiEdit className="text-xl cursor-pointer" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <img src='./images/ex1.png' className='h-10' />
                        <div className="div">
                            <h3 className="font-semibold">Founder & CEO</h3>
                            <p className="text-sm text-gray-500">Memorisely - Full-time</p>
                            <p className="text-sm text-gray-400">Oct 2020 – Present · 3 yrs 8 mos</p>
                            <p className="text-sm text-gray-400">London</p>
                            <p className="text-sm text-gray-600 mt-2">Memorisely is a remote UX/UI Bootcamp...</p>
                            <div className="flex items-center gap-2 py-4">
                                <img src='./images/p.png' className='h-10' />
                                <img src='./images/p.png' className='h-10' />
                                <img src='./images/p.png' className='h-10' />

                            </div>
                        </div>

                    </div>
                    <div className="flex gap-2">
                        <img src='./images/p1.png' className='h-10' />
                        <div className="div">
                            <h3 className="font-semibold">UX Designer & Product Manager</h3>
                            <p className="text-sm text-gray-500">Figma - Part-time</p>
                            <p className="text-sm text-gray-400">Nov 2021 – Present · 2 yrs 7 mos</p>
                            <p className="text-sm text-gray-400">London, England, United Kingdom</p>
                            <p className="text-sm text-gray-600 mt-2">Founding member of the Figma Educator...</p>
                            <div className="flex items-center gap-2 py-4">
                                <img src='./images/p.png' className='h-10' />
                                <img src='./images/p2.png' className='h-10' />
                                <img src='./images/p.png' className='h-10' />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyExperience