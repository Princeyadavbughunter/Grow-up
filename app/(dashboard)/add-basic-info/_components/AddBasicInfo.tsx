import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { FiEdit2 } from "react-icons/fi";
import Applications from '../../applications/_components/applications';

const AddBasicInfo = () => {
    return (
        <div className="p-6 h-screen max-w-md">

            <div className="relative">
                <img src='/images/youtube.png' className='rounded-full h-20 w-20 flex justify-center mx-auto' />
                <FiEdit2 size={20} className='absolute bottom-2 right-32 bg-[#7052FF] h-8 w-8 rounded-full p-2' />
            </div>
            <h2 className="text-xl font-bold mb-4 mt-5">Basic Info</h2>

            <Input
                type="text"
                placeholder="Enter your name"
                className="w-full mb-4 h-12 border-black"
            />

            <Input
                type="text"
                placeholder="Enter your title"
                className="w-full mb-4 h-12 border-black"
            />

            <Input
                type="text"
                placeholder="Enter your location"
                className="w-full mb-4 h-12 border-black"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Current Organisation</label>
            <Select>
                <SelectTrigger className="w-full h-12 border-black">
                    <SelectValue placeholder="Select Current Organisation" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">BITS Pilani</SelectItem>
                    <SelectItem value="dark">IIT Delhi</SelectItem>
                    <SelectItem value="system">NIT Trichy</SelectItem>
                </SelectContent>
            </Select>

            <p className="text-sm text-gray-500 mb-4">
                Add your current experience to make that your default company on Groupup Buddy
            </p>

            <h3 className="text-lg font-bold mb-2">Social Media</h3>
            <Input
                type="text"
                placeholder="Enter your LinkedIn URL"
                className="w-full mb-2 h-12 border-black"
            />
            <Input
                type="text"
                placeholder="Enter your Twitter URL"
                className="w-full mb-2 h-12 border-black"
            />
            <Input
                type="text"
                placeholder="Enter your Instagram URL"
                className="w-full mb-4 h-12 border-black"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Summary</label>
            <Textarea
                placeholder="Enter a short summary about yourself"
                className="w-full mb-4  border-black"
                rows={4}
            />

            <Input
                type="text"
                placeholder="Enter your profession"
                className="w-full mb-4 h-12 border-black"
            />

            <div className="flex justify-end gap-20">
                <Button
                    type="button"
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full "
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="bg-[#7052FF] text-white hover:bg-blue-600 rounded-full px-12"
                >
                    Save
                </Button>
            </div>


            <div className="mt-10 pb-40">
                <Applications />
            </div>
        </div>
    );
};

export default AddBasicInfo;
