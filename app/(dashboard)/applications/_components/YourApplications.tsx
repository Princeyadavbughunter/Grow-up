"use client"
import React, { useState } from 'react';
import ProfileData from '../../profile/components/ProfileData';
import Applications from './applications';

const YourApplications = () => {
    const [activeMainTab, setActiveMainTab] = useState<string>("Your Application");

    return (
        <div className='w-4/12'>
            <ProfileData />

            <div className="flex space-x-8  border-gray-200 mb-4">
                {["Your Application", "Your Listing"].map((tab) => (
                    <p
                        key={tab}
                        className={`pb-2 cursor-pointer ${activeMainTab === tab ? "border-b-2 border-black text-black" : "text-gray-400"}`}
                        onClick={() => setActiveMainTab(tab)}
                    >
                        {tab}
                    </p>
                ))}
            </div>

            <Applications />
        </div>
    );
};

export default YourApplications;
