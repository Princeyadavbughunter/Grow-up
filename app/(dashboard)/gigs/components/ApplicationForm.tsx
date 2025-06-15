// @ts-nocheck
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

const formSchema = z.object({
    socials: z.array(z.string().min(1, "Username is required")).nonempty("At least one social media link is required"),
    projectLink: z.string().min(1, "Project link is required").url("Please enter a valid URL"),
    cv: z.any()
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
                cover_letter: data.projectLink,
            };

            if (data.cv) {
                formData.append("cv", data.cv);
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
        <div className="p-4 sm:p-6 md:p-8 mb-20 h-[calc(100vh-12rem)] rounded-lg w-full max-w-full sm:max-w-lg mx-auto bg-white">
            {profileData && (
                <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mb-6">
                    <img
                        src={profileData.profile_picture || "https://via.placeholder.com/80"}
                        alt={`${profileData.first_name} ${profileData.last_name}`}
                        className="w-20 h-20 rounded-full border border-gray-300"
                    />
                    <div className="text-center sm:text-left">
                        <h3 className="font-medium text-lg">{`${profileData.first_name} ${profileData.last_name}`}</h3>
                        <p className="text-gray-500 text-sm">{profileData.position}</p>
                        <p className="text-gray-600 text-sm">{profileData.bio}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {profileData.skills && profileData.skills.split(',').map((skill, index) => (
                                <span key={index} className="bg-[#F6F8FF] font-medium rounded-full px-2 py-1 text-xs">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="">
                {isApplied ? (
                    <div className="mt-20 space-y-4">
                        <h3 className="font-medium text-lg">Application Status</h3>
                        <div className="bg-gray-100 p-4 rounded-md space-y-2">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-800">Already Applied</span>
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
                ) : !formSubmitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Project Link</h3>
                            <Input
                                {...register("projectLink")}
                                className={`w-full border ${errors.projectLink ? "border-red-500" : "border-gray-300"} rounded-md`}
                                placeholder="https://your-project-url.com"
                            />
                            {errors.projectLink && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.projectLink.message?.toString()}
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Add Socials
                            </h3>
                            <div className="space-y-2">
                                <Input
                                    placeholder="@username"
                                    {...register("socials.0")}
                                    className={`w-full border ${errors.socials ? "border-red-500" : "border-gray-300"} rounded-md`}
                                />
                                {errors.socials?.[0] && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.socials[0].message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-violet-600 text-white hover:bg-violet-700"
                            disabled={!jobId}
                        >
                            Apply
                        </Button>
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