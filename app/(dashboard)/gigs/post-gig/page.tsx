// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { IoMdLocate } from "react-icons/io";
import { FaLongArrowAltLeft, FaCheckCircle } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface FormData {
  job_description: string;
  job_title: string;
  location: string;
  work_type: string;
  job_type: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    job_description: "",
    job_title: "",
    location: "",
    work_type: "Remote",
    job_type: "Full Time",
    required_skills: "",
    salary_range: "",
    is_active: "open",
    about_role: "",
    experience: "",
    role: "",
    skill_set: ""
  });

  const { profileData } = useAuth()

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.job_title.trim() !== "" && formData.work_type !== "" && formData.job_type !== "";
      case 2:
        return formData.required_skills.trim() !== "";
      case 3:
        return formData.job_description.trim() !== "";
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    try {
      setIsSubmitting(true);
      
      // Ensure role and skill_set are set correctly before submission
      const dataToSubmit = {
        ...formData,
        role: formData.job_title,
        skill_set: formData.required_skills
      };
      
      const response = await api.post("/company/app/job-posting/", dataToSubmit);
      console.log("Job posted successfully:", response.data);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          job_description: "",
          job_title: "",
          location: "",
          work_type: "Remote",
          job_type: "Full Time",
          required_skills: "",
          salary_range: "",
          is_active: "open",
          about_role: "",
          experience: "",
          role: "",
          skill_set: ""
        });
        setCurrentStep(1);
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error posting job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This would typically involve a reverse geocoding API call
          // For demonstration, we'll set a placeholder value
          setFormData(prev => ({...prev, location: "Current Location"}));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const StepProgressBar = () => {
    const steps = [
      { id: 1, name: '' },
      { id: 2, name: '' },
      { id: 3, name: '' }
    ];

    return (
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-4 sm:pr-6 md:pr-8' : ''}`}>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-1/2 left-full w-4 sm:w-6 md:w-8 h-0.5 -translate-y-1/2" aria-hidden="true">
                    <div 
                      className={`h-0.5 w-full ${step.id < currentStep ? 'bg-purple-600' : 'bg-gray-200'}`}
                    />
                  </div>
                )}
                <div className="relative flex items-center justify-center">
                  <span className="flex flex-shrink-0 items-center justify-center">
                    <span 
                      className={`flex h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-medium ${
                        step.id < currentStep 
                          ? 'bg-purple-600 text-white'
                          : step.id === currentStep
                          ? 'bg-purple-500 text-white ring-1 sm:ring-2 ring-purple-200'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    );
  };

  if (submitSuccess) {
    return (
      <div className="flex justify-center items-center bg-gray-50 px-2 sm:px-4 h-screen">
        <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Job Posted Successfully!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Your job has been posted and is now live.</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div className="h-2 bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-y-auto pt-96 flex-col md:justify-center items-center ">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl">
        <StepProgressBar />
        
        <div className="flex justify-center overflow-hidden relative">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
          >
            {/* Step 1: Role Information */}
            <div className="w-full flex-shrink-0">
              <div className="w-full max-w-xs sm:max-w-md mx-auto p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Add the Role</h2>
                <div className="mb-3 sm:mb-4">
                  <p className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-1">
                    Role you are looking for
                    <span className="text-xs text-gray-500">{formData.job_title.length}/120</span>
                  </p>
                  <textarea
                    id="job_title"
                    name="job_title"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                    placeholder="e.g., Web Designer, Software Engineer"
                    maxLength={120}
                    value={formData.job_title}
                    onChange={handleInputChange}
                    rows={2}
                    autoFocus
                  ></textarea>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Select Work Type</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {["Remote", "Hybrid", "Onsite"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center p-2 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer ${
                          formData.work_type === type 
                            ? "border-purple-500 bg-purple-50" 
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="work_type"
                          className="form-radio text-purple-500 mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                          checked={formData.work_type === type}
                          onChange={() =>
                            setFormData({ ...formData, work_type: type })
                          }
                        />
                        <span className="text-xs sm:text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Select Job Type</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {["Freelance", "Collaboration", "Internship", "Contract", "Full Time", "Part Time"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center p-2 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer ${
                          formData.job_type === type 
                            ? "border-purple-500 bg-purple-50" 
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="job_type"
                          className="form-radio text-purple-500 mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                          checked={formData.job_type === type}
                          onChange={() =>
                            setFormData({ ...formData, job_type: type })
                          }
                        />
                        <span className="text-xs sm:text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Add Compensation</h3>
                  <p className="text-xs text-gray-500 mb-2">Provide the salary range to attract applicants</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                        <span className="text-gray-500 text-sm sm:text-base">₹</span>
                      </div>
                      <input 
                        type="text"
                        name="salary_range"
                        className="w-full pl-6 sm:pl-8 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                        placeholder="e.g., 20000-40000"
                        value={formData.salary_range}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base ${
                    validateStep(1)
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={nextStep}
                  disabled={!validateStep(1)}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Step 2: Skills and Requirements */}
            <div className="w-full flex-shrink-0">
              <div className="w-full max-w-xs sm:max-w-md mx-auto p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Add Skills</h2>
                <div className="mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Skills you are looking for</p>
                  <textarea
                    name="required_skills"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                    placeholder="e.g., Python, React, UI/UX Design (separate with commas)"
                    value={formData.required_skills}
                    onChange={handleInputChange}
                    rows={3}
                  ></textarea>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Add Workplace Location</h3>
                  <div className="relative">
                    <input
                      name="location"
                      type="text"
                      className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="e.g., Mumbai, Delhi, Remote"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    <button 
                      type="button"
                      onClick={detectLocation}
                      className="text-purple-600 flex items-center gap-1 mt-2 text-xs sm:text-sm hover:text-purple-700"
                    >
                      <IoMdLocate size={14} className="sm:w-4 sm:h-4" />
                      Auto-detect my location
                    </button>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Experience Required</h3>
                  <select
                    name="experience"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm sm:text-base"
                    value={formData.experience}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>

                <div className="flex justify-between mt-4 sm:mt-6 space-x-2 sm:space-x-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 sm:py-3 px-2 sm:px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <FaLongArrowAltLeft className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" /> Back
                  </button>
                  <button
                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base ${
                      validateStep(2)
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={nextStep}
                    disabled={!validateStep(2)}
                  >
                    Next <HiArrowNarrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Description */}
            <div className="w-full flex-shrink-0">
              <div className="w-full max-w-xs sm:max-w-md mx-auto p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Add Description</h2>
                <div className="mb-3 sm:mb-4">
                  <p className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-1">
                    Job Description
                    <span className="text-xs text-gray-500">{formData.job_description.length}/1200</span>
                  </p>
                  <textarea
                    name="job_description"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                    placeholder="Describe the job position, responsibilities, and requirements"
                    maxLength={1200}
                    rows={5}
                    value={formData.job_description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="mt-4 sm:mt-6">
                  <p className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-1">
                    About the Role (Optional)
                    <span className="text-xs text-gray-500">{formData.about_role.length}/500</span>
                  </p>
                  <textarea
                    name="about_role"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                    placeholder="Additional details about the role, team, and work environment"
                    maxLength={500}
                    rows={4}
                    value={formData.about_role}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="flex justify-between mt-4 sm:mt-6 space-x-2 sm:space-x-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 sm:py-3 px-2 sm:px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <FaLongArrowAltLeft className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" /> Back
                  </button>
                  <button
                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base ${
                      validateStep(3) && !isSubmitting
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleSubmit}
                    disabled={!validateStep(3) || isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : (
                      <>
                        Post Job <FaCheckCircle className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepForm;