"use client";
import React, { useState } from "react";
import StepOne from "./_components/StepOne";
import StepTwo from "./_components/StepTwo";
import StepThree from "./_components/StepThree";

const StepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="flex justify-center items-center bg-gray-50 px-4">
            <div className="flex gap-6 w-full max-w-[1250px]">
                <div
                    className={`transition-all duration-300 ${currentStep === 1 ? "opacity-100 blur-0 " : "opacity-50 blur-sm "
                        }`}
                >
                    <StepOne onNext={nextStep} />
                </div>
                <div
                    className={`transition-all duration-300 ${currentStep === 2 ? "opacity-100 blur-0 " : "opacity-50 blur-sm "
                        }`}
                >
                    <StepTwo onNext={nextStep} onPrev={prevStep} />
                </div>
                <div
                    className={`transition-all duration-300 ${currentStep === 3 ? "opacity-100 blur-0 " : "opacity-50 blur-sm "
                        }`}
                >
                    <StepThree onPrev={prevStep} />
                </div>
            </div>
        </div>
    );
};

export default StepForm;
