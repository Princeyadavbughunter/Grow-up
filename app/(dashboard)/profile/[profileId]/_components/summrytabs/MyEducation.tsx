// @ts-nocheck
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/AuthContext"

interface MyEducationProps {
    profileData: any;
}

const MyEducation: React.FC<MyEducationProps> = ({ profileData }) => {
    const hasEducationData = profileData && (
        profileData.university_name || 
        profileData.highest_qualification || 
        profileData.degree_name
    );

    return (
        <div className="py-10">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Education</h2>
            </div>
            
            <div className="space-y-4">
                {hasEducationData ? (
                    <div className="w-full max-w-[571px] min-h-[66px] bg-[#F6F8FF] rounded-[16px] py-[16px] px-[12px] flex items-center justify-between gap-[10px]">
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                            <h3 className="font-semibold text-[14px] text-black truncate leading-tight">
                                {profileData.university_name || 'Institution Name'}
                            </h3>
                            <p className="text-[12px] font-medium text-gray-500 truncate mt-[4px]">
                                {profileData.is_degree ? 
                                    `${profileData.degree_name || profileData.highest_qualification}` : 
                                    (profileData.highest_qualification || 'Degree')}
                            </p>
                        </div>
                        <div className="flex items-center gap-[10px] flex-shrink-0">
                            <span className="text-[12px] font-medium text-[#6A737D] whitespace-nowrap">
                                {profileData.graduation_year_from ? 
                                    `${profileData.graduation_year_from} – ${profileData.passing_year || 'Present'}` : 
                                    profileData.passing_year ? `Graduated ${profileData.passing_year}` : ''}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/50">
                        <p className="text-sm">No education data available.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyEducation;