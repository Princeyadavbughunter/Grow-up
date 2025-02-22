import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CiEdit } from "react-icons/ci";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

const formSchema = z.object({
    projectLink: z.string().url("Enter a valid project link"),
    socials: z.array(z.string().min(1, "Username is required")).nonempty("At least one social media link is required"),
    coverLetter: z.string().min(1, "Cover letter is required"),
    cv: z.any()
});

type FormData = z.infer<typeof formSchema>;

export default function ApplicationForm({ jobId }: { jobId?: string }) {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState("");
    const [cvName, setCvName] = useState<string | null>(null);
    const { userId } = useAuth();
    const { api } = useAuthenticatedApi();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();
            
            const applicationData = {
                job_seeker: userId,
                job_posting: jobId,
                cover_letter: data.coverLetter,
                status: "submitted",
                project_link: data.projectLink,
                social_links: data.socials,
            };

            if (data.cv) {
                formData.append("cv", data.cv);
            }

            const response = await api.post('/freelancer/job-application/', applicationData);

            if (response.status === 201 || response.status === 200) {
                setFormSubmitted(true);
                setApplicationStatus("Application Sent to Recruiter");
            }
        } catch (error) {
            console.error("Error submitting the application:", error);
            alert("Something went wrong. Please try again!");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCvName(file.name);
            setValue("cv", file);
            e.target.value = "";
        }
    };

    return (
        <div className="p-4 sm:p-8 rounded-lg max-w-full sm:max-w-lg mx-auto shadow-lg bg-white">
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
                <img
                    src="https://via.placeholder.com/80"
                    alt="Profile"
                    className="w-20 h-20 rounded-full border border-gray-300"
                />
                <div className="text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <h3 className="font-medium text-lg">Aryan Trivedi</h3>
                        <Button className="bg-[#313E53] flex items-center gap-2 rounded-full">
                            <CiEdit />
                            Edit
                        </Button>
                    </div>
                    <p className="text-gray-500 text-sm">Frontend Developer</p>
                    <p className="text-gray-600 text-sm">
                        Join our team and showcase your skills!
                    </p>
                    <div>
                        <p className="flex flex-wrap items-center gap-2 font-semibold mt-2">
                            Skills
                            <button className="bg-[#F6F8FF] font-medium rounded-full px-2 py-1 text-xs">
                                UX Research
                            </button>
                        </p>
                    </div>
                    <div>
                        <p className="flex flex-wrap items-center gap-2 font-semibold mt-2">
                            Professional
                            <button className="bg-[#F6F8FF] font-medium rounded-full px-2 py-1 text-xs">
                                UI/UX Designer
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div className="">
                {!formSubmitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                        <div>
                            <h3 className="font-medium text-lg mb-2">What we offer</h3>
                            <p className="text-gray-600">
                                A competitive salary with performance
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">
                                    Add Project Link
                                </h3>
                                <Input
                                    placeholder="https://uxofbhi.com/"
                                    {...register("projectLink")}
                                    className={`w-full border ${errors.projectLink ? "border-red-500" : "border-gray-300"} rounded-md`}
                                />
                                {errors.projectLink && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.projectLink.message?.toString()}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h3>
                                <textarea
                                    {...register("coverLetter")}
                                    className={`w-full border ${errors.coverLetter ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                                    rows={4}
                                    placeholder="Write your cover letter here..."
                                />
                                {errors.coverLetter && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.coverLetter.message?.toString()}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Upload CV/Resume</h3>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        {...register("cv")}
                                        className={`w-full border ${errors.cv ? "border-red-500" : "border-gray-300"} rounded-md`}
                                        onChange={handleFileChange}
                                    />
                                    {cvName && (
                                        <span className="text-sm text-gray-500">{cvName}</span>
                                    )}
                                </div>
                                {errors.cv && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.cv.message?.toString()}
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