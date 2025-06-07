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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    job_description: "",
    job_title: "",
    location: "",
    employment_type: "Full Time",
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
        return formData.job_title.trim() !== "" && formData.employment_type !== "";
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
          employment_type: "Full Time",
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
      <div className="w-full max-w-md mx-auto mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8' : ''}`}>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-4 left-5 w-full h-0.5 -translate-y-1/2" aria-hidden="true">
                    <div 
                      className={`h-0.5 ${step.id < currentStep ? 'bg-purple-600' : 'bg-gray-200'}`}
                    />
                  </div>
                )}
                <div className="relative flex items-center group">
                  <span className="flex flex-shrink-0 items-center justify-center">
                    <span 
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                        step.id < currentStep 
                          ? 'bg-purple-600 text-white'
                          : step.id === currentStep
                          ? 'bg-purple-500 text-white ring-2 ring-purple-200'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </span>
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-600">{step.name}</span>
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
      <div className="flex justify-center items-center bg-gray-50 px-4 h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Posted Successfully!</h2>
          <p className="text-gray-600 mb-6">Your job has been posted and is now live.</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div className="h-2 bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 px-4 py-8 min-h-screen">
      <div className="relative w-full max-w-4xl">
        <StepProgressBar />
        
        <div className="flex justify-center overflow-hidden relative">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
          >
            {/* Step 1: Role Information */}
            <div className="w-full flex-shrink-0">
              <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add the Role</h2>
                <div className="mb-4">
                  <p className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    Role you are looking for
                    <span className="text-xs text-gray-500">{formData.job_title.length}/120</span>
                  </p>
                  <textarea
                    id="job_title"
                    name="job_title"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="e.g., Web Designer, Software Engineer"
                    maxLength={120}
                    value={formData.job_title}
                    onChange={handleInputChange}
                    rows={2}
                    autoFocus
                  ></textarea>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Role Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["Full Time", "Part Time", "Contract", "Internship"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center p-3 border rounded-xl cursor-pointer ${
                          formData.employment_type === type 
                            ? "border-purple-500 bg-purple-50" 
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="employment_type"
                          className="form-radio text-purple-500 mr-2"
                          checked={formData.employment_type === type}
                          onChange={() =>
                            setFormData({ ...formData, employment_type: type })
                          }
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Compensation</h3>
                  <p className="text-xs text-gray-500 mb-2">Provide the salary range to attract applicants</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input 
                        type="text"
                        name="salary_range"
                        className="w-full pl-8 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 20000-40000"
                        value={formData.salary_range}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full mt-6 py-3 px-4 rounded-lg transition-colors ${
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
              <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add Skills</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Skills you are looking for</p>
                  <textarea
                    name="required_skills"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="e.g., Python, React, UI/UX Design (separate with commas)"
                    value={formData.required_skills}
                    onChange={handleInputChange}
                    rows={3}
                  ></textarea>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Workplace Location</h3>
                  <div className="relative">
                    <input
                      name="location"
                      type="text"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Mumbai, Delhi, Remote"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    <button 
                      type="button"
                      onClick={detectLocation}
                      className="text-purple-600 flex items-center gap-1 mt-2 text-sm hover:text-purple-700"
                    >
                      <IoMdLocate size={16} />
                      Auto-detect my location
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Experience Required</h3>
                  <select
                    name="experience"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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

                <div className="flex justify-between mt-6 space-x-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <FaLongArrowAltLeft className="mr-2" /> Back
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                      validateStep(2)
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={nextStep}
                    disabled={!validateStep(2)}
                  >
                    Next <HiArrowNarrowRight className="ml-2" size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Description */}
            <div className="w-full flex-shrink-0">
              <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add Description</h2>
                <div className="mb-4">
                  <p className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    Job Description
                    <span className="text-xs text-gray-500">{formData.job_description.length}/1200</span>
                  </p>
                  <textarea
                    name="job_description"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Describe the job position, responsibilities, and requirements"
                    maxLength={1200}
                    rows={5}
                    value={formData.job_description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="mt-6">
                  <p className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    About the Role (Optional)
                    <span className="text-xs text-gray-500">{formData.about_role.length}/500</span>
                  </p>
                  <textarea
                    name="about_role"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Additional details about the role, team, and work environment"
                    maxLength={500}
                    rows={4}
                    value={formData.about_role}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="flex justify-between mt-6 space-x-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <FaLongArrowAltLeft className="mr-2" /> Back
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                      validateStep(3) && !isSubmitting
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleSubmit}
                    disabled={!validateStep(3) || isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : (
                      <>
                        Post Job <FaCheckCircle className="ml-2" size={18} />
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