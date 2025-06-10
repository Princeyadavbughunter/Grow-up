// @ts-nocheck
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { MdOutlineAddHomeWork } from 'react-icons/md';

const LogoDetails = () => {
    const [logo, setLogo] = useState(null);

    const handleLogoChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(URL.createObjectURL(file)); // Create a URL for the uploaded image
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg overflow-y-auto h-[570px] border w-[400px]">
            <p className="text-xl font-semibold mb-4">Logo</p>

            <div className="flex items-center space-x-4">
                {/* Left side: Display the selected logo */}
                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    {logo ? (
                        <img src={logo} alt="Selected Logo" className="w-full h-full object-cover" />
                    ) : (
                        <MdOutlineAddHomeWork className="text-4xl text-gray-600" />
                    )}
                </div>

                {/* Right side: Text and file input */}
                <div className="flex-1">
                    <label
                        htmlFor="logo-upload"
                        className="cursor-pointer text-blue-600 hover:underline font-medium"
                    >
                        Upload Logo
                    </label>
                    <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                    />
                </div>

            </div>
            <div className="mt-10">
                <Label>Company/Project Name</Label>
                <Input type='text' placeholder='Ex. bluelearn' />
            </div>

            <div className="mt-5">
                <Label className='mt-20'>Company/Project description</Label>
                <Textarea placeholder='Write a brirf about your company' />
            </div>
        </div>
    );
};

export default LogoDetails;
