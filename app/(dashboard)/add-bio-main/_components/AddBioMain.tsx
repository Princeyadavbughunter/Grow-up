import React, { useState } from 'react'
import ProfileData from '../../profile/components/ProfileData'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react';

const AddBioMain = () => {
    const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>("About");

    return (
        <div className=''>
            <p className='underline font-semibold'>Your bio</p>
            <div className="flex space-x-4 py-4">
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


            <div className="py-10">
                <p className='text-black font-semibold'>Summary</p>
                <div className="bg-[#F6F8FF] rounded-lg p-20">
                    <p className='text-blue-500  text-center cursor-pointer text-lg flex justify-center items-center'>add<PlusIcon color='gray' /></p>
                </div>

            </div>
            <div className="py-10">
                <p className='text-black font-semibold'>My Experience</p>
                <div className="bg-[#F6F8FF] rounded-lg p-20">
                    <p className='text-blue-500  text-center cursor-pointer text-lg flex justify-center items-center'>add<PlusIcon color='gray' /></p>
                </div>

            </div>
            <div className="py-10">
                <p className='text-black font-semibold'>My Education</p>
                <div className="bg-[#F6F8FF] rounded-lg p-20">
                    <p className='text-blue-500  text-center cursor-pointer text-lg flex justify-center items-center'>add<PlusIcon color='gray' /></p>
                </div>

            </div>
            <div className="py-10">
                <p className='text-black font-semibold'>My Skills</p>
                <div className="bg-[#F6F8FF] rounded-lg p-20">
                    <p className='text-blue-500  text-center cursor-pointer text-lg flex justify-center items-center'>add<PlusIcon color='gray' /></p>
                </div>

            </div>

        </div>
    )
}

export default AddBioMain