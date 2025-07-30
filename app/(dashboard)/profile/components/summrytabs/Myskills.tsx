// @ts-nocheck
import React, { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

// Use the same interface as in AuthContext
interface FreelancerProfile {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    bio: string;
    university_name: string;
    graduation_year_from: string;
    profile_picture: string;
    address: string;
    lat: number | null;
    long: number | null;
    city: string;
    district: string;
    pincode: number;
    state: string;
    interest_in: string;
    hobbies: string;
    highest_qualification: string;
    passing_year: string;
    created_at: string;
    degree_name: string;
    is_degree: boolean;
    is_diploma: boolean;
    diploma_name: string;
    is_disabled: boolean;
    resume: string | null;
    skills: string;
    gender: string;
    saved_jobs_count: number;
    follower_count: number;
    dribble_account: string | null;
    github_account: string | null;
    figma_account: string | null;
    youtube_account: string | null;
    medium_account: string | null;
    soft_skills: string;
    position: string;
    user: string;
    work_experience: any[];
    facebook_account?: string | null;
    linkedin_account?: string | null;
    instagram_account?: string | null;
    twitter_account?: string | null;
}

interface MyskillsProps {
    profileData: FreelancerProfile | null;
}

interface SkillsFormData {
    skills: string;
    soft_skills: string;
}

const Myskills: React.FC<MyskillsProps> = ({ profileData }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { apiCaller, refreshProfile } = useAuth();

    const [formData, setFormData] = useState<SkillsFormData>({
        skills: profileData?.skills || "",
        soft_skills: profileData?.soft_skills || "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            
            // Add text fields
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value as string);
            });

            if (profileData) {
                await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            
            await refreshProfile();
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating skills:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = () => {
        const resetFormData: SkillsFormData = {
            skills: profileData?.skills || "",
            soft_skills: profileData?.soft_skills || "",
        };
        
        setFormData(resetFormData);
        setIsEditing(true);
    };

    const skillsArray = profileData?.skills ? profileData.skills.split(',').map(skill => skill.trim()) : [];
    const softSkillsArray = profileData?.soft_skills ? profileData.soft_skills.split(',').map(skill => skill.trim()) : [];

    return (
        <div>
            {/* My Skills */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg font-bold">My Skills</h2>
                    <div className="flex items-center gap-2">
                        <IoMdAdd 
                            className="text-xl cursor-pointer hover:text-[#7052FF] transition-colors" 
                            onClick={openEditModal}
                        />
                    </div>
                </div>
                
                {skillsArray.length > 0 || softSkillsArray.length > 0 ? (
                    <>
                        {skillsArray.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-600">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2 mt-2 border-b py-2">
                                    {skillsArray.map((skill) => (
                                        <span key={skill} className="px-3 py-1 text-xs font-medium border rounded-full bg-[#E4DEFF]">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {softSkillsArray.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-600">Soft Skills</h3>
                                <div className="flex flex-wrap gap-2 mt-2 border-b py-2">
                                    {softSkillsArray.map((skill) => (
                                        <span key={skill} className="px-3 py-1 text-xs font-medium border rounded-full bg-[#E4DEFF]">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4 text-gray-500 text-center">
                        No skills added. Click the + icon to add some.
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Skills</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="skills">Technical Skills (comma-separated)</Label>
                                <Input 
                                    id="skills" 
                                    name="skills" 
                                    value={formData.skills} 
                                    onChange={handleInputChange}
                                    placeholder="React, Node.js, JavaScript, Python, Flutter..."
                                />
                                <p className="text-sm text-gray-500">
                                    Add your technical skills and programming languages
                                </p>
                            </div>
                            
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="soft_skills">Soft Skills (comma-separated)</Label>
                                <Input 
                                    id="soft_skills" 
                                    name="soft_skills" 
                                    value={formData.soft_skills} 
                                    onChange={handleInputChange}
                                    placeholder="Communication, Leadership, Problem-Solving, Teamwork..."
                                />
                                <p className="text-sm text-gray-500">
                                    Add your interpersonal and professional skills
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditing(false)}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-[#7052FF] hover:bg-[#5a42cc] w-full sm:w-auto"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Myskills