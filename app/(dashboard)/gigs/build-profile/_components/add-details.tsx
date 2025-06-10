// @ts-nocheck
import { Avatar } from '@/components/ui/avatar'
import React, { useState } from 'react'
import { IoMdLocate } from 'react-icons/io';

const AddDetails = () => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('Current location');
    const [website, setWebsite] = useState('');

    const handleSubmit = () => {
        console.log({
            fullName,
            phoneNumber,
            location,
            website,

        });
    };

    return (
        <div className=' p-6 bg-white rounded-lg overflow-y-auto h-[570px] border w-[400px]'>
            <p className='text-xl font-semibold'>Welcome Aryan!</p>
            <p>Let’s build your profile together </p>

            <div className="py-10">
                <Avatar className='bg-black h-32 w-32 ' />
            </div>

            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Full name</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="johny"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
            </div>

            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Phone number</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 Enter your number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
            </div>

            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Your location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Current location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <p className="text-[#7052FF] flex items-center gap-2 cursor-pointer mt-3"><IoMdLocate />Auto-detect my city</p>

            </div>

            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Website</label>
                <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://flixrave.to"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
            </div>

            <div className="flex items-center mb-6">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">I don’t have a website</span>
            </div>
        </div>
    )
}

export default AddDetails