// @ts-nocheck
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

const formSchema = z.object({
    socials: z.array(z.string().min(1, "Username is required")).nonempty("At least one social media link is required").optional(),
    projectLink: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
    cv: z.any().optional()
});

type FormData = z.infer<typeof formSchema>;

export default function ApplicationForm({ jobId, isApplied }: { jobId?: string, isApplied: boolean }) {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { api } = useAuthenticatedApi();
    const { profileData } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();

            console.log(profileData);


            const applicationData = {
                job_seeker: profileData?.id,
                job_posting: jobId,
                status: "submitted",
                cover_letter: data.projectLink || "",
            };

            if (data.cv && data.cv.length > 0) {
                formData.append("cv", data.cv[0]);
            }

            const response = await api.post('/freelancer/job-application/', applicationData);

            if (response.status === 201 || response.status === 200) {
                setFormSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting the application:", error);
            alert("Something went wrong. Please try again!");
        }
    };

    return (
        <div className="p-2 sm:p-4 mb-20 h-[calc(100vh-12rem)] overflow-y-auto hide-scrollbar w-full bg-white">
            {profileData && (
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-sm w-full">
                    <div className="flex items-start gap-3 sm:gap-4 mb-5">
                        {profileData.profile_picture ? (
                            <img
                                src={profileData.profile_picture}
                                alt={`${profileData.first_name} ${profileData.last_name}`}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gray-100 shadow-sm shrink-0 object-cover"
                            />
                        ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border border-gray-100 shadow-sm bg-[#ffe7e0] shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="20" r="20" fill="#ffe7e0" />
                                    <g>
                                        <circle cx="20" cy="15" r="5" fill="#C84A1F" />
                                        <rect x="10" y="25" width="20" height="7" rx="3.5" fill="#C84A1F" />
                                    </g>
                                </svg>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base inline-flex items-center gap-1 flex-wrap">
                                        {profileData.first_name} {profileData.last_name}
                                    </h3>
                                    <p className="text-gray-500 text-xs sm:text-[13px] leading-tight mt-0.5 line-clamp-2">
                                        Summary: {profileData.bio || "Hi, I am a professional looking for new exciting opportunities."}
                                    </p>
                                </div>
                                <Button size="sm" className="bg-[#1e293b] hover:bg-slate-800 text-white rounded-full px-3 sm:px-4 h-7 text-[10px] sm:text-xs font-medium shrink-0 flex items-center gap-1.5">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mt-2">
                            <span className="font-semibold text-[14px] leading-none tracking-normal text-left text-gray-900 w-24 shrink-0 sm:mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Skills</span>
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills ? profileData.skills.split(',').slice(0, 3).map((skill, index) => (
                                    <span key={index} className="bg-[#F4F7FF] text-[#6A5DE2] font-semibold rounded-full px-3 py-1.5 text-[11px]">
                                        {skill.trim()}
                                    </span>
                                )) : (
                                    <>
                                        <span className="bg-[#F4F7FF] text-[#6A5DE2] font-semibold rounded-full px-3 py-1.5 text-[11px]">UX Research</span>
                                        <span className="bg-[#F4F7FF] text-[#6A5DE2] font-semibold rounded-full px-3 py-1.5 text-[11px]">Figma</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mt-2">
                            <span className="font-semibold text-[14px] leading-none tracking-normal text-left text-gray-900 w-24 shrink-0 sm:mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Professional</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-[#F4F7FF] text-[#6A5DE2] font-semibold rounded-full px-3 py-1.5 text-[11px]">
                                    {profileData.position || (profileData.skills ? profileData.skills.split(',')[0].trim() : "UI/UX Designer")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="">
                {isApplied ? (
                    <div className="mt-8 space-y-4">
                        <h3 className="font-medium text-lg">Application Status</h3>
                        <div className="bg-gray-100 p-4 rounded-md space-y-2">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-800">Application Submitted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <span className="text-gray-400">Under Review</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <span className="text-gray-400">Decision Pending</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                Your application has been submitted successfully. The recruiter will review it soon.
                            </p>
                        </div>
                    </div>
                ) : !formSubmitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex justify-between items-center text-[14px] leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <span>Add Project Link</span>
                                    <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                                </h3>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    </div>
                                    <input
                                        type="url"
                                        {...register("projectLink")}
                                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:border-[#6A5DE2] focus:ring-1 focus:ring-[#6A5DE2] outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="Paste your link here"
                                    />
                                </div>
                                {errors.projectLink && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.projectLink.message?.toString()}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex justify-between items-center text-[14px] leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <span>Upload CV/Resume</span>
                                    <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                                </h3>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="cv-upload"
                                        {...register("cv")}
                                        className="sr-only"
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <label
                                        htmlFor="cv-upload"
                                        className="flex items-center justify-center w-full px-4 py-3 bg-white border border-dashed border-gray-300 hover:border-[#6A5DE2] rounded-xl cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-[#6A5DE2]">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                            <span className="font-medium">Upload File</span>
                                        </div>
                                    </label>
                                </div>
                                {errors.cv && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.cv.message?.toString()}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex justify-between items-center text-[14px] leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    <span>Add Socials</span>
                                    <button type="button" className="text-[#6A5DE2] hover:bg-[#EBE8FF] rounded p-0.5 transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </h3>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400 font-medium text-sm">@</span>
                                        </div>
                                        <input
                                            type="text"
                                            {...register("socials.0")}
                                            className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:border-[#6A5DE2] focus:ring-1 focus:ring-[#6A5DE2] outline-none transition-colors placeholder:text-gray-400"
                                            placeholder="username"
                                        />
                                    </div>
                                    {errors.socials?.[0] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.socials[0].message?.toString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-[#6A5DE2] hover:bg-[#5849C9] text-white font-medium py-[22px] rounded-2xl md:rounded-[20px] shadow-sm transition-all active:scale-[0.98] text-[15px]"
                                disabled={!jobId}
                            >
                                Apply
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-20 space-y-4">
                        <h3 className="font-medium text-lg">Track Your Application</h3>
                        <div className="bg-gray-100 p-4 rounded-md space-y-2">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-800">Application Sent to Recruiter</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <span className="text-gray-400">Application Viewed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <span className="text-gray-400">Profile Viewed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}