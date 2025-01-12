import React from 'react';
import { HiOutlineStar } from "react-icons/hi2";

const ProgressProfile = () => {
    const steps = [
        { label: "Profile", completed: true },
        { label: "Bio", completed: true },
        { label: "Work experience", completed: false },
        { label: "Education", completed: false },
    ];

    const completedSteps = steps.filter((step) => step.completed).length;
    const totalSteps = steps.length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

    return (
        <div className="px-5 border-gray-500 border-[1px] p-4 rounded-xl">
            <p className="font-semibold text-lg">Complete Your Profile</p>
            <p className="text-xs text-gray-400">
                {progressPercentage}% completed ({totalSteps - completedSteps} steps left)
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-lg mt-2 mb-4">
                <div
                    className="h-2 rounded-lg"
                    style={{ width: `${progressPercentage}%`, backgroundColor: "#7052FF" }}
                ></div>
            </div>
            <div>
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <HiOutlineStar
                            className={`mr-2 ${step.completed ? "text-[#7052FF]" : "text-gray-400"
                                }`}
                        />
                        <p className={`${step.completed ? "text-black" : "text-gray-400"}`}>
                            {step.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressProfile;
