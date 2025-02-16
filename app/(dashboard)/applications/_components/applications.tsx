import React, { useState } from 'react';
import { CiLinkedin } from 'react-icons/ci';
import { IoIosTimer } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Button } from '@/components/ui/button';
import YourBioHeader from '../../_components/YourBioHeader';

const Applications = () => {
    const applications = [
        {
            title: "Growth - Intern",
            company: "Shipsy",
            location: "Bengaluru (On-site)",
            status: "Actively recruiting",
            lastModified: "1w ago",
            applyType: "Easy apply"
        },
        {
            title: "Software Engineer",
            company: "Google",
            location: "Hyderabad (Hybrid)",
            status: "Actively recruiting",
            lastModified: "3d ago",
            applyType: "Easy apply"
        },
        {
            title: "UI/UX Designer",
            company: "Adobe",
            location: "Noida (Remote)",
            status: "Applications closed",
            lastModified: "2w ago",
            applyType: "LinkedIn apply"
        },
        {
            title: "Marketing Analyst",
            company: "Swiggy",
            location: "Bengaluru (On-site)",
            status: "Actively recruiting",
            lastModified: "4d ago",
            applyType: "Easy apply"
        },
        {
            title: "Data Scientist",
            company: "Amazon",
            location: "Pune (Hybrid)",
            status: "Actively recruiting",
            lastModified: "5d ago",
            applyType: "Easy apply"
        },
        {
            title: "Product Manager",
            company: "Flipkart",
            location: "Bengaluru (On-site)",
            status: "Actively recruiting",
            lastModified: "6d ago",
            applyType: "Easy apply"
        }
    ];

    return (
        <div>
            <YourBioHeader />
            {applications.map((app, index) => (
                <div key={index} className="flex px-1 py-5 border-b border-gray-300 w-[370px]">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        Photo
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-bold">{app.title}</p>
                        <p className="text-gray-600">{app.company}</p>
                        <p className="text-gray-500 text-sm">{app.location}</p>
                        <p className='flex items-center text-sm text-green-600'><IoIosTimer className="mr-1" />{app.status}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                            Last modified {app.lastModified} . <CiLinkedin className="mx-1" /> {app.applyType}
                        </p>
                    </div>
                    <div className="ml-4">
                        <HiOutlineDotsVertical />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Applications;
