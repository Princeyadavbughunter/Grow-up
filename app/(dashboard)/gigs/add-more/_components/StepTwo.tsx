import React, { useEffect } from "react";
import { IoMdLocate } from "react-icons/io";
import { FaLongArrowAltLeft } from "react-icons/fa";

interface StepTwoProps {
    onNext: () => void;
    onPrev: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ onNext, onPrev }) => {
    // Handle Enter key press
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                onNext();
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [onNext]);

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg overflow-y-auto h-[570px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Skills Added</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                {["Flutter", "React", "Node.js", "TailwindCSS", "TailwindCSS"].map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                    </span>
                ))}
            </div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Skills Recommended</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                {["Flutter", "React", "Node.js", "TailwindCSS", "TailwindCSS"].map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                    </span>
                ))}
            </div>

            <label className="text-xl font-bold mb-4 text-gray-800">Add Skills</label>
            <p className="text-gray-500 text-xs">Mention the skill set you are looking for</p>
            <input
                type="text"
                className="w-full p-3 mt-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Mention the skill set you are looking for"
            />
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Workplace Location</h3>
                <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your city"
                />
                <p className="text-[#7052FF] flex items-center gap-2 cursor-pointer"><IoMdLocate />Auto-detect my city</p>

                <div className="flex items-center mt-2">
                    <input type="checkbox" id="remote" className="mr-2" />
                    <label htmlFor="remote" className="text-gray-600">
                        Remote gig
                    </label>
                </div>
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={onPrev}
                    className=""
                >
                    <FaLongArrowAltLeft />
                </button>
            </div>
        </div>
    );
};

export default StepTwo;
