// @ts-nocheck
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoMdAdd } from 'react-icons/io'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import OtherSimilerPorfile from './OtherSimilerPorfile'
import Clubs from './Clubs'
import Posts from './Posts'
import Portfolios from './Portfolios'
import MyExperience from './MyExperience'
import MyEducation from './MyEducation'

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

interface SummryProps {
    profileData: FreelancerProfile | null;
}

interface SummaryFormData {
    bio: string;
    skills: string;
}

const Summry: React.FC<SummryProps> = ({ profileData }) => {
    // @ts-ignore
    const [activeJobTypeTab, setActiveJobTypeTab] = useState('About');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isEditingSkills, setIsEditingSkills] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { apiCaller, refreshProfile } = useAuth();

    const [formData, setFormData] = useState<SummaryFormData>({
        bio: profileData?.bio || "",
        skills: profileData?.skills || "",
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
            setIsEditingSkills(false);
        } catch (error) {
            console.error("Error updating summary:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = () => {
        const resetFormData: SummaryFormData = {
            bio: profileData?.bio || "",
            skills: profileData?.skills || "",
        };
        
        setFormData(resetFormData);
        setIsEditing(true);
    };

    const openEditSkillsModal = () => {
        const resetFormData: SummaryFormData = {
            bio: profileData?.bio || "",
            skills: profileData?.skills || "",
        };
        
        setFormData(resetFormData);
        setIsEditingSkills(true);
    };

    const skillsArray = profileData?.skills ? profileData.skills.split(',').map(skill => skill.trim()) : [];

    return (
        <div className='w-full mb-10'>
            <div className="flex space-x-4">
                {["About", "Skills", "Porfolio", "Post"].map((tab) => (
                    <Button
                        key={tab}
                        variant={activeJobTypeTab === tab ? "default" : "ghost"}
                        className={activeJobTypeTab === tab ? "bg-[#979797] hover:bg-[#dcdcdc] rounded-full" : "rounded-full bg-[#dcdcdc]"}
                        // @ts-ignore
                        onClick={() => setActiveJobTypeTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            <div className="flex justify-between flex-col md:flex-row gap-10">
                <div className='w-1/2'>
                    {activeJobTypeTab === "About" && (
                    <div className='flex flex-col'>
                        <div>
                            <p className='flex items-center py-4 font-semibold gap-5'>
                                Summary 
                                <CiEdit 
                                    className="cursor-pointer hover:text-[#7052FF] transition-colors" 
                                    onClick={openEditModal}
                                />
                            </p>
                            <div className="bg-[#F6F8FF] shadow-sm rounded-lg p-4">
                                <p>MY Journey</p>

                                <div className='py-2'>
                                    <p className="flex flex-wrap gap-2 font-semibold">
                                        {skillsArray.length > 0 ? (
                                            skillsArray.map((skill, index) => (
                                                <button key={index} className="font-medium rounded-full px-3 py-1 text-xs sm:text-sm border">
                                                    {skill}
                                                </button>
                                            ))
                                        ) : null}
                                    </p>
                                </div>

                                <p className='text-[#6A737D]'>{profileData?.bio || 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}</p>
                            </div>
                        </div>
                        <MyExperience />
                        <MyEducation profileData={profileData} />
                    </div>
                    )}
                    {activeJobTypeTab === "Skills" && (
                        <div className="my-8">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-lg font-bold">My Skills</h2>
                                <div className="flex items-center gap-2">
                                    <IoMdAdd 
                                        className="text-xl cursor-pointer hover:text-[#7052FF] transition-colors" 
                                        onClick={openEditSkillsModal}
                                    />
                                </div>
                            </div>

                            {skillsArray.length > 0 ? (
                                <div>
                                    <h3 className="font-semibold text-gray-600">Skills</h3>
                                    <div className="flex flex-wrap gap-2 mt-2 border-b py-2">
                                        {skillsArray.map((skill) => (
                                            <span key={skill} className="px-3 py-1 text-xs font-medium border rounded-full bg-[#E4DEFF]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4 text-gray-500 text-center">
                                    No skills added. Click to add some.
                                </div>
                            )}
                        </div>
                    )}

                    {activeJobTypeTab === "Porfolio" && <Portfolios profileData={profileData} />}

                    {activeJobTypeTab === "Post" && <Posts />}
                </div>

                <div className="w-1/2">
                    <OtherSimilerPorfile freelancerId={profileData?.id} />
                    <Clubs />
                </div>
            </div>

            {/* Edit Summary Modal */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Summary</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea 
                                    id="bio" 
                                    name="bio" 
                                    value={formData.bio} 
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Tell us about yourself and your journey..."
                                />
                            </div>
                            
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="skills">Skills (comma-separated)</Label>
                                <Input 
                                    id="skills" 
                                    name="skills" 
                                    value={formData.skills} 
                                    onChange={handleInputChange}
                                    placeholder="React, Node.js, JavaScript, Python..."
                                />
                                <p className="text-sm text-gray-500">
                                    Separate multiple skills with commas
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

            {/* Edit Skills Modal */}
            <Dialog open={isEditingSkills} onOpenChange={setIsEditingSkills}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Skills</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="skills">Skills (comma-separated)</Label>
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
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditingSkills(false)}
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

export default Summry