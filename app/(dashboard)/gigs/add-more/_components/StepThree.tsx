import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";

interface StepThreeProps {
    onPrev: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ onPrev }) => {
    const [description, setDescription] = useState("");

    return (
        <div className="w-full p-6 bg-white rounded-lg overflow-y-auto h-[570px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Description</h2>
            <div>
                <p className="text-gray-400 text-xs">
                    Provide the description for your project <span>{description.length}/1200</span>
                </p>
                <textarea
                    className="w-full p-3 border rounded-xl h-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type here"
                    maxLength={1200}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>


            <div className="flex items-center justify-between p-2 border bg-[#F6F8FF] rounded-xl">
                <p className="text-sm">Generate a gig description using growth AI</p>
                <Button className="bg-transparent hover:bg-transparent border-[#7052FF] border-[1px] text-[#7052FF]">Auto Generate</Button>
            </div>
            <ul className="list-disc pl-5 mt-4 text-gray-700">
                <li>Roles and responsibilities</li>
                <li>Qualifications or pre-requisites</li>
                <li>Perks of joining (if any)</li>
            </ul>
            <div className="flex justify-between mt-6">
                <button
                    onClick={onPrev}
                    className="mt-5"
                >
                    <FaLongArrowAltLeft />

                </button>
            </div>
            <button className="w-full mt-7 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600">
                Post
            </button>
        </div>
    );
};

export default StepThree;
