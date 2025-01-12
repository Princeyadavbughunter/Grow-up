import React, { useState } from 'react';
import { LuShare2 } from "react-icons/lu";
import { HiDotsVertical } from "react-icons/hi";
import { HomeIcon } from 'lucide-react';
import { IoMdOptions } from "react-icons/io";

const GigsDetails = () => {
    // Sample dynamic data
    const gigDetails = {
        jobTitle: "Web Developer",
        jobType: "Internship",
        company: "Cat Group",
        location: "India",
        profile: {
            name: "Aryan Trivedi",
            skills: "4 of 10",
            profileImage: "https://randomuser.me/api/portraits/men/1.jpg", // Random profile image link
        },
        filters: ["Relevance", "Latest", "Has Proof of Work", "Matching Skill", "Rating"],
        languages: ["javascript", "next.js", "react.js", "Angular", "node.js"],
    };

    // State for managing dropdown visibility
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const toggleEditMenu = () => setIsEditMenuOpen(prev => !prev);
    const toggleFilterMenu = () => setIsFilterMenuOpen(prev => !prev);

    return (
        <div className='w-full px-2 border rounded-xl'>
            <div className="flex items-center justify-between py-5">
                <div>
                    <p className='text-xl font-semibold'>{gigDetails.jobTitle}</p>
                    <button className='rounded-full px-4 border text-md'>{gigDetails.jobType}</button>
                </div>
                <div className="flex">
                    <div>
                        <p className='text-lg font-semibold'>{gigDetails.company}</p>
                        <p className='text-xs'>{gigDetails.location}</p>
                    </div>
                    <HomeIcon />
                </div>
                <div className="flex gap-10 items-center">
                    <LuShare2 size={30} className='cursor-pointer' />
                    <div className="relative">
                        <HiDotsVertical size={30} className='cursor-pointer' onClick={toggleEditMenu} />
                        {isEditMenuOpen && (
                            <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-40">
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-200">Edit Gigs</button>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-200">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="description bg-[#F9FAFF] p-10 rounded-xl">
                <p className='font-semibold text-xl'>Description</p>
            </div>

            {/* Filter section */}
            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-4">
                    {gigDetails.filters.map((filter, index) => (
                        <button key={index} className='rounded-full p-2 border bg-gray-400 px-4'>
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <IoMdOptions className='cursor-pointer' size={30} onClick={toggleFilterMenu} />
                    {isFilterMenuOpen && (
                        <div className="flex absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-64">
                            <div className="p-4">
                                <p className="font-semibold">Filters</p>
                                <div className="flex flex-col gap-2 mt-2">
                                    <button className="text-left w-full px-4 py-2 hover:bg-gray-200">Skills</button>
                                    <button className="text-left w-full px-4 py-2 hover:bg-gray-200">Proof of Work</button>
                                    <button className="text-left w-full px-4 py-2 hover:bg-gray-200">Rating</button>
                                    <button className="text-left w-full px-4 py-2 hover:bg-gray-200">Status</button>
                                </div>
                            </div>
                            <div className="border-t border-gray-200"></div>
                            <div className="p-4">
                                <p className="font-semibold">Languages</p>
                                <div className="flex flex-col gap-2 mt-2">
                                    {gigDetails.languages.map((lang, index) => (
                                        <button key={index} className="text-left w-full px-4 py-2 hover:bg-gray-200">
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 border-[#E4DEFF] border-[1px] rounded-xl">
                <div className="flex items-center gap-5 bg-[#F9FAFF] p-5 justify-between">
                    <div className="flex gap-5 items-center">
                        <img src={gigDetails.profile.profileImage} className='rounded-full h-10 w-10' alt="Profile" />
                        <div>
                            <p className='text-black font-semibold'>{gigDetails.profile.name}</p>
                            <p className='text-xs font-thin text-gray-400'>Skills {gigDetails.profile.skills}</p>
                        </div>
                    </div>

                    <div className="flex gap-10">
                        <div className="p-4 rounded-xl bg-white px-20 text-[#7052FF]">Proof of work</div>
                        <div className="p-4 rounded-xl bg-white px-20 text-[#7052FF]">Message</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigsDetails;
