"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IoMdLocate } from "react-icons/io";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useAuthenticatedApi } from "@/context/AuthContext";

interface FormData {
    job_description: string;
    job_title: string;
    location: string;
    employment_type: string;
    required_skills: string;
    salary_range: string;
    is_active: string;
    about_role: string;
    experience: string;
    role: string;
    skill_set: string;
}

const StepForm = () => {
    const { api } = useAuthenticatedApi();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        job_description: "",
        job_title: "",
        location: "",
        employment_type: "",
        required_skills: "",
        salary_range: "",
        is_active: "open",
        about_role: "",
        experience: "",
        role: "",
        skill_set: ""
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        try {
            const response = await api.post("/company/app/job-posting/", formData);
            console.log("Job posted successfully:", response.data);
            // Handle success (e.g., show success message, redirect)
        } catch (error) {
            console.error("Error posting job:", error);
            // Handle error (e.g., show error message)
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter" && formData.job_title.trim() !== "" && currentStep === 1) {
                nextStep();
            }
        };
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [formData.job_title, currentStep]);

    const StepOne = () => (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md overflow-y-auto h-[570px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add the Role</h2>
            <p className="flex justify-between items-center">
                Mention the role you are looking for
                <span className="text-xs text-gray-500">{formData.job_title.length}/120</span>
            </p>
            <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Web Designer"
                maxLength={120}
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value, role: e.target.value })}
            ></textarea>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Role Type</h3>
                {["Full Time", "Part Time", "Contract", "Internship"].map((type) => (
                    <label
                        key={type}
                        className="flex items-center space-x-2 mb-3 h-12 border p-2 rounded-xl cursor-pointer"
                    >
                        <input
                            type="radio"
                            name="roleType"
                            className="form-radio text-purple-500"
                            checked={formData.employment_type === type}
                            onChange={() => setFormData({ ...formData, employment_type: type })}
                        />
                        <span className="text-gray-600">{type}</span>
                    </label>
                ))}
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Compensation</h3>
                <p className="text-xs text-gray-500">Provide the Pay amount to attract applicants</p>
                <div className="flex items-center mt-5 gap-2">
                    <div>
                        <p>Salary Range</p>
                        <input
                            type="number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="₹20000"
                            value={formData.salary_range}
                            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const StepTwo = () => (
        <div className="w-full max-w-md p-6 bg-white rounded-lg overflow-y-auto h-[570px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Skills</h2>
            <p className="text-gray-500 text-xs">Mention the skill set you are looking for</p>
            <input
                type="text"
                className="w-full p-3 mt-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., python, react"
                value={formData.required_skills}
                onChange={(e) => setFormData({ ...formData, required_skills: e.target.value, skill_set: e.target.value })}
            />
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Workplace Location</h3>
                <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your city"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <p className="text-[#7052FF] flex items-center gap-2 cursor-pointer"><IoMdLocate />Auto-detect my city</p>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Experience Required</h3>
                <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 2 years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="">
                    <FaLongArrowAltLeft />
                </button>
            </div>
        </div>
    );

    const StepThree = () => (
        <div className="w-full p-6 bg-white rounded-lg overflow-y-auto h-[570px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Description</h2>
            <div>
                <p className="text-gray-400 text-xs">
                    Provide the description for your project <span>{formData.job_description.length}/1200</span>
                </p>
                <textarea
                    className="w-full p-3 border rounded-xl h-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type here"
                    maxLength={1200}
                    value={formData.job_description}
                    onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                ></textarea>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">About Role</h3>
                <textarea 
                    className="w-full p-3 border rounded-xl h-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe the role and responsibilities"
                    value={formData.about_role}
                    onChange={(e) => setFormData({ ...formData, about_role: e.target.value })}
                ></textarea>
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={prevStep} className="mt-5">
                    <FaLongArrowAltLeft />
                </button>
            </div>
            <button 
                className="w-full mt-7 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600"
                onClick={handleSubmit}
            >
                Post Job
            </button>
        </div>
    );

    return (
        <div className="flex justify-center items-center bg-gray-50 px-4">
            <div className="flex gap-6 w-full max-w-[1250px]">
                <div className={`transition-all duration-300 ${currentStep === 1 ? "opacity-100 blur-0" : "opacity-50 blur-sm"}`}>
                    <StepOne />
                </div>
                <div className={`transition-all duration-300 ${currentStep === 2 ? "opacity-100 blur-0" : "opacity-50 blur-sm"}`}>
                    <StepTwo />
                </div>
                <div className={`transition-all duration-300 ${currentStep === 3 ? "opacity-100 blur-0" : "opacity-50 blur-sm"}`}>
                    <StepThree />
                </div>
            </div>
        </div>
    );
};

export default StepForm;