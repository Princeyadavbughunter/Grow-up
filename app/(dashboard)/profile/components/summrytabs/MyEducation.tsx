import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoMdAdd } from 'react-icons/io'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/AuthContext"

interface MyEducationProps {
    profileData: ProfileData | null;
}

const MyEducation: React.FC<MyEducationProps> = ({ profileData }) => {
    // @ts-ignore
    const { apiCaller, refreshProfile } = useAuth();
    // @ts-ignore
    const [isEditing, setIsEditing] = useState(false);
    // @ts-ignore
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const defaultFormData = {
        university_name: profileData?.university_name || "",
        graduation_year_from: profileData?.graduation_year_from || "",
        passing_year: profileData?.passing_year || "",
        highest_qualification: profileData?.highest_qualification || "",
        degree_name: profileData?.degree_name || "",
        is_degree: profileData?.is_degree || false,
    };

    // @ts-ignore
    const [formData, setFormData] = useState(defaultFormData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // @ts-ignore
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        // @ts-ignore
        setFormData(prev => ({ ...prev, [name]: checked }));
        
        // Clear related fields when unchecking
        if (!checked) {
            if (name === 'is_degree') {
                // @ts-ignore
                setFormData(prev => ({ ...prev, degree_name: '' }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        setIsSubmitting(true);

        try {
            const payload = {
                // @ts-ignore
                university_name: formData.university_name,
                // @ts-ignore
                graduation_year_from: formData.graduation_year_from,
                // @ts-ignore
                passing_year: formData.passing_year,
                // @ts-ignore
                highest_qualification: formData.highest_qualification,
                // @ts-ignore
                degree_name: formData.degree_name,
                // @ts-ignore
                is_degree: formData.is_degree,
            };

            if (profileData?.id) {
                await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, payload);
            } else {
                await apiCaller.post('/freelancer/freelancer-profile/', payload);
            }
            
            await refreshProfile();
            // @ts-ignore
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating education:", error);
        } finally {
            // @ts-ignore
            setIsSubmitting(false);
        }
    };

    const openEditModal = () => {
        // @ts-ignore
        setFormData(defaultFormData);
        // @ts-ignore
        setIsEditing(true);
    };

    const hasEducationData = profileData && (
        profileData.university_name ||
        profileData.highest_qualification ||
        profileData.degree_name
    );

    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-bold">My Education</h2>
                <div className="flex items-center gap-2">
                    <IoMdAdd 
                        className="text-xl cursor-pointer hover:text-[#7052FF] transition-colors" 
                        onClick={openEditModal}
                    />
                    {hasEducationData && (
                        <CiEdit 
                            className="text-xl cursor-pointer hover:text-[#7052FF] transition-colors" 
                            onClick={openEditModal}
                        />
                    )}
                </div>
            </div>
            
            <div className="space-y-4">
                {hasEducationData ? (
                    <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4">
                        <h3 className="font-semibold">
                            {profileData.is_degree ?
                                `${profileData.degree_name || profileData.highest_qualification}` :
                                profileData.highest_qualification}
                        </h3>
                        <p className="text-sm text-gray-500">{profileData.university_name || 'N/A'}</p>
                        <p className="text-sm text-gray-400">
                            {profileData.graduation_year_from ? 
                                `${profileData.graduation_year_from} – ${profileData.passing_year || 'Present'}` : 
                                profileData.passing_year ? `Graduated ${profileData.passing_year}` : 'N/A'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4">
                        <p className="text-gray-500 text-center">No education data available. Click the + icon to add your education.</p>
                    </div>
                )}
            </div>

            {/* @ts-ignore */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{hasEducationData ? "Edit Education" : "Add Education"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="university_name">University/Institution</Label>
                                <Input 
                                    id="university_name" 
                                    name="university_name" 
                                    // @ts-ignore
                                    value={formData.university_name} 
                                    onChange={handleInputChange}
                                    placeholder="Enter university or institution name"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="graduation_year_from">Start Year</Label>
                                    <Input 
                                        id="graduation_year_from" 
                                        name="graduation_year_from" 
                                        // @ts-ignore
                                        value={formData.graduation_year_from} 
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2018"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="passing_year">Passing Year</Label>
                                    <Input 
                                        id="passing_year" 
                                        name="passing_year" 
                                        // @ts-ignore
                                        value={formData.passing_year} 
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2022"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="highest_qualification">Highest Qualification</Label>
                                <Input 
                                    id="highest_qualification" 
                                    name="highest_qualification" 
                                    // @ts-ignore
                                    value={formData.highest_qualification} 
                                    onChange={handleInputChange}
                                    placeholder="e.g., Bachelor's, Master's, PhD"
                                />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_degree" 
                                    // @ts-ignore
                                    checked={formData.is_degree}
                                    onCheckedChange={(checked) => handleCheckboxChange("is_degree", checked as boolean)}
                                />
                                <Label htmlFor="is_degree">This is a Degree</Label>
                            </div>
                            
                            {/* @ts-ignore */}
                            {formData.is_degree && (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="degree_name">Degree Name</Label>
                                    <Input 
                                        id="degree_name" 
                                        name="degree_name" 
                                        // @ts-ignore
                                        value={formData.degree_name} 
                                        onChange={handleInputChange}
                                        placeholder="e.g., Bachelor of Science in Computer Science"
                                    />
                                </div>
                            )}
                            
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                // @ts-ignores
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-[#7052FF]"
                            >
                                {isSubmitting ? 'Saving...' : hasEducationData ? 'Save Changes' : 'Add Education'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MyEducation