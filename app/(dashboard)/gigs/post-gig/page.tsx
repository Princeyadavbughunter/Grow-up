// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { FaLongArrowAltLeft, FaCheckCircle } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  is_unpaid: boolean;
}

const StepForm = () => {
  const { api } = useAuthenticatedApi();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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
    skill_set: "",
    is_unpaid: false
  });

  const { profileData } = useAuth()

  // Pure validation function (no side effects) - for use in render
  const isValidStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          formData.job_title.trim() !== "" &&
          formData.work_type !== "" &&
          formData.job_type !== ""
        );
      case 2:
        return formData.required_skills.trim() !== "";
      case 3:
        return formData.job_description.trim() !== "";
      default:
        return true;
    }
  };

  // Validation function with side effects - for use in handlers
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.job_title.trim()) {
          newErrors.job_title = "Job title is required";
        }
        if (!formData.work_type) {
          newErrors.work_type = "Work type is required";
        }
        if (!formData.job_type) {
          newErrors.job_type = "Job type is required";
        }
        break;
      case 2:
        if (!formData.required_skills.trim()) {
          newErrors.required_skills = "Required skills are required";
        }
        break;
      case 3:
        if (!formData.job_description.trim()) {
          newErrors.job_description = "Job description is required";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      // Clear errors when moving to next step
      setErrors({});
    } else {
      // Mark all fields in current step as touched to show errors
      const fieldsToTouch: Record<string, boolean> = {};
      if (currentStep === 1) {
        fieldsToTouch.job_title = true;
        fieldsToTouch.work_type = true;
        fieldsToTouch.job_type = true;
      } else if (currentStep === 2) {
        fieldsToTouch.required_skills = true;
      } else if (currentStep === 3) {
        fieldsToTouch.job_description = true;
      }
      setTouched((prev) => ({ ...prev, ...fieldsToTouch }));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      // Mark job_description as touched if validation fails
      setTouched((prev) => ({ ...prev, job_description: true }));
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure role and skill_set are set correctly before submission
      const dataToSubmit = {
        ...formData,
        role: formData.job_title,
        skill_set: formData.required_skills,
        is_unpaid: formData.is_unpaid
      };

      const response = await api.post("/company/app/job-posting/", dataToSubmit);
      console.log("Job posted successfully:", response.data);
      setSubmitSuccess(true);

      setTimeout(() => {
        router.push("/gigs");
      }, 2000);

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    // Validate the field on blur
    if (currentStep === 1 && (fieldName === 'job_title' || fieldName === 'work_type' || fieldName === 'job_type')) {
      validateStep(1);
    } else if (currentStep === 2 && fieldName === 'required_skills') {
      validateStep(2);
    } else if (currentStep === 3 && fieldName === 'job_description') {
      validateStep(3);
    }
  };



  // StepProgressBar removed as per new 3-column UI design

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
          <p className="text-xs sm:text-sm text-gray-500">Redirecting to gigs page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-auto lg:h-[calc(100vh-6rem)] overflow-y-auto pt-6 lg:pt-10 flex-col items-start w-full px-4 md:px-10 lg:px-20 xl:px-28">
      <div className="relative w-full pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start w-full">
            {/* Step 1: Role Information */}
            <div className="w-full">
              <div className="w-full p-4 sm:p-5 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Add the Role</h2>
                <div className="mb-3 sm:mb-4">
                  <p className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-1">
                    Role you are looking for
                    <span className="text-xs text-gray-500">{formData.job_title.length}/120</span>
                  </p>
                  <textarea
                    id="job_title"
                    name="job_title"
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 resize-none text-sm sm:text-base ${errors.job_title && touched.job_title
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-[#7052FF]"
                      }`}
                    placeholder="e.g., Web Designer, Software Engineer"
                    maxLength={120}
                    value={formData.job_title}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('job_title')}
                    rows={2}
                    autoFocus
                  ></textarea>
                  {errors.job_title && touched.job_title && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.job_title}
                    </p>
                  )}
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Select Work Type</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {["Remote", "Hybrid", "Onsite"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center p-2 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer transition-colors duration-200 ${formData.work_type === type
                            ? "border-[#7052FF] bg-[#7052FF] text-white"
                            : errors.work_type && touched.work_type
                              ? "border-red-500"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="work_type"
                          className="form-radio text-white focus:ring-white mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                          checked={formData.work_type === type}
                          onChange={() => {
                            setFormData({ ...formData, work_type: type });
                            if (errors.work_type) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.work_type;
                                return newErrors;
                              });
                            }
                            setTouched((prev) => ({ ...prev, work_type: true }));
                          }}
                          onBlur={() => handleBlur('work_type')}
                        />
                        <span className={`text-xs sm:text-sm font-medium ${formData.work_type === type ? 'text-white' : 'text-gray-700'}`}>{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.work_type && touched.work_type && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.work_type}
                    </p>
                  )}
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Select Job Type</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {["Freelance", "Collaboration", "Internship", "Contract", "Full Time", "Part Time"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center p-2 sm:p-3 border rounded-lg sm:rounded-xl cursor-pointer transition-colors duration-200 ${formData.job_type === type
                            ? "border-[#7052FF] bg-[#7052FF] text-white"
                            : errors.job_type && touched.job_type
                              ? "border-red-500"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="job_type"
                          className="form-radio text-white focus:ring-white mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4"
                          checked={formData.job_type === type}
                          onChange={() => {
                            setFormData({ ...formData, job_type: type });
                            if (errors.job_type) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.job_type;
                                return newErrors;
                              });
                            }
                            setTouched((prev) => ({ ...prev, job_type: true }));
                          }}
                          onBlur={() => handleBlur('job_type')}
                        />
                        <span className={`text-xs sm:text-sm font-medium ${formData.job_type === type ? 'text-white' : 'text-gray-700'}`}>{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.job_type && touched.job_type && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.job_type}
                    </p>
                  )}
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Add Compensation</h3>
                  <div className="mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_unpaid"
                        className="w-4 h-4 text-[#7052FF] border-gray-300 rounded focus:ring-[#7052FF]"
                        checked={formData.is_unpaid}
                        onChange={(e) => setFormData({ ...formData, is_unpaid: e.target.checked, salary_range: e.target.checked ? "" : formData.salary_range })}
                      />
                      <span className="text-sm text-gray-700">This is an unpaid position</span>
                    </label>
                  </div>
                  {!formData.is_unpaid && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Provide the salary range to attract applicants</p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-full">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                            <span className="text-gray-500 text-sm sm:text-base">₹</span>
                          </div>
                          <input
                            type="text"
                            name="salary_range"
                            className="w-full pl-6 sm:pl-8 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7052FF] text-sm sm:text-base"
                            placeholder="e.g., 20000-40000"
                            value={formData.salary_range}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base ${isValidStep(1)
                      ? "bg-[#7052FF] text-white hover:bg-[#5849C9]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  onClick={nextStep}
                  disabled={!isValidStep(1)}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Step 2: Skills and Requirements */}
            <div className={`w-full transition-all duration-500 ${currentStep < 2 ? 'opacity-40 blur-[3px] pointer-events-none select-none' : ''}`}>
              <div className="w-full p-4 sm:p-5 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Skills Added Section */}
                <div className="mb-6">
                  <h3 
                    className="text-gray-900 mb-4"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", textAlign: "left" }}
                  >
                    Skills Added
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.required_skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, idx) => (
                      <div key={idx} className="flex items-center bg-[#F4F7FF] text-[#7052FF] px-3 py-1.5 rounded-full text-sm font-medium border border-[#EBE8FF]">
                        {skill}
                        <button 
                          type="button"
                          className="ml-2 text-[#7052FF] hover:text-[#5849C9] focus:outline-none bg-white rounded-full p-0.5 shadow-sm border border-gray-100 flex items-center justify-center w-4 h-4"
                          onClick={() => {
                            const skills = formData.required_skills.split(',').map(s => s.trim()).filter(Boolean);
                            const newSkills = skills.filter((_, i) => i !== idx);
                            setFormData({ ...formData, required_skills: newSkills.join(', ') });
                          }}
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Recommended Section */}
                <div className="mb-6">
                  <h3 
                    className="text-gray-900 mb-4"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", textAlign: "left" }}
                  >
                    Skills Recommended
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Node.js", "TypeScript", "Tailwind CSS", "Figma"].map((skill, idx) => (
                      <button 
                        key={idx} 
                        type="button"
                        className="flex items-center bg-white text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 hover:border-[#7052FF] hover:text-[#7052FF] transition-all group"
                        onClick={() => {
                          const currentSkills = formData.required_skills.split(',').map(s => s.trim()).filter(Boolean);
                          if (!currentSkills.includes(skill)) {
                            const newSkills = currentSkills.length > 0 ? `${formData.required_skills}, ${skill}` : skill;
                            setFormData({ ...formData, required_skills: newSkills });
                          }
                        }}
                      >
                        {skill}
                        <div className="ml-2 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center w-4 h-4 border border-gray-200 group-hover:bg-[#F4F7FF] group-hover:text-[#7052FF] transition-colors">
                           <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Skills Input */}
                <h3 
                  className="text-gray-900 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", textAlign: "left" }}
                >
                  Add Skills
                </h3>
                <div className="mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Mention the skill set you are looking for</p>
                  <input
                    type="text"
                    name="required_skills"
                    className={`w-full p-2 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 text-sm sm:text-base ${errors.required_skills && touched.required_skills
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#7052FF]"
                      }`}
                    placeholder="Search Skills"
                    value={formData.required_skills}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('required_skills')}
                  />
                  {errors.required_skills && touched.required_skills && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.required_skills}
                    </p>
                  )}
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Add Workplace Location</h3>
                  <input
                    name="location"
                    type="text"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7052FF] text-sm sm:text-base"
                    placeholder="e.g., Mumbai, Delhi, Remote"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Experience Required</h3>
                  <select
                    name="experience"
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7052FF] bg-white text-sm sm:text-base"
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
                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base ${isValidStep(2)
                        ? "bg-[#7052FF] text-white hover:bg-[#5849C9]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    onClick={nextStep}
                    disabled={!isValidStep(2)}
                  >
                    Next <HiArrowNarrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Description */}
            <div className={`w-full transition-all duration-500 ${currentStep < 3 ? 'opacity-40 blur-[3px] pointer-events-none select-none' : ''}`}>
              <div className="w-full p-4 sm:p-5 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-1 text-gray-900">Add Description</h2>
                <div className="mb-6">
                  <p className="flex justify-between items-center text-sm text-gray-500 mb-2 font-medium">
                    Provide the Description for your project
                    <span className="text-xs text-gray-400 font-normal">{formData.job_description.length}/1200</span>
                  </p>
                  <textarea
                    name="job_description"
                    className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 resize-none text-base placeholder-gray-300 transition-all ${errors.job_description && touched.job_description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-[#7052FF]"
                      }`}
                    placeholder="Type here"
                    maxLength={1200}
                    rows={8}
                    value={formData.job_description}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('job_description')}
                  ></textarea>
                  {errors.job_description && touched.job_description && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.job_description}
                    </p>
                  )}
                </div>

                {/* AI Generation Block */}
                <div className="bg-[#F4F7FF] rounded-2xl p-4 mb-8 border border-[#EBE8FF] min-h-[80px] flex items-center">
                  {!isGenerating ? (
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm text-gray-600 leading-tight pr-4">
                        Generate a gig description <br /> using growth AI
                      </p>
                      <button 
                        type="button"
                        className="bg-white text-[#7052FF] border border-[#7052FF] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#F4F7FF] transition-colors whitespace-nowrap"
                        onClick={() => {
                          setIsGenerating(true);
                          // Simulate generation delay
                          setTimeout(() => {
                            setIsGenerating(false);
                            // Populate description with sample text
                            if (!formData.job_description) {
                              setFormData(prev => ({
                                ...prev,
                                job_description: `Role Overview:\nWe are looking for a dedicated Professional to join our growing team. You will be responsible for handling key project tasks and collaborating with cross-functional teams.\n\nKey Responsibilities:\n- Implement core features and maintain high-quality code.\n- Participate in design reviews and technical discussions.\n- Optimize performance and ensure scalability.\n\nRequirements:\n- Strong knowledge of industry-standard tools.\n- Excellent communication and teamwork skills.\n- Proven experience in similar roles.`
                              }));
                            }
                          }, 3000);
                        }}
                      >
                        Auto generate
                      </button>
                    </div>
                  ) : (
                    <p 
                      className="text-gray-500 animate-pulse w-full text-center"
                      style={{ 
                        fontFamily: "'Poppins', sans-serif", 
                        fontWeight: 400, 
                        fontSize: '12px', 
                        lineHeight: '100%',
                        letterSpacing: '0px'
                      }}
                    >
                      Hold on few seconds, I’m thinking description.....
                    </p>
                  )}
                </div>

                {/* Include these section */}
                <div className="mb-8">
                  <h3 
                    className="text-gray-500 mb-4"
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 500, lineHeight: '100%' }}
                  >
                    Include these in your description
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Roles and responsibilities",
                      "Qualifications or pre-requisites",
                      "Perks of joining (if any)"
                    ].map((item, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-center text-[#64748B]"
                        style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 500, lineHeight: '100%' }}
                      >
                        <div className="mr-3 text-[#7052FF]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.8 8.2H20L15 12L16.8 18.2L12 14.4L7.2 18.2L9 12L4 8.2H10.2L12 2Z" fill="currentColor"/>
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    className={`w-full py-4 px-4 rounded-2xl transition-all text-lg font-bold shadow-lg ${isValidStep(3) && !isSubmitting
                        ? "bg-[#7052FF] text-white hover:bg-[#5849C9] shadow-[#7052FF]/30"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      }`}
                    onClick={handleSubmit}
                    disabled={!isValidStep(3) || isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default StepForm;