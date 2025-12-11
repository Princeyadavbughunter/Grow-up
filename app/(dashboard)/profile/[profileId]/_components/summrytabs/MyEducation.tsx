// @ts-nocheck
import React, { useState } from 'react'
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
    const { apiCaller, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const defaultFormData = {
        university_name: profileData?.university_name || "",
        graduation_year_from: profileData?.graduation_year_from || "",
        passing_year: profileData?.passing_year || "",
        highest_qualification: profileData?.highest_qualification || "",
        degree_name: profileData?.degree_name || "",
        is_degree: profileData?.is_degree || false,
    };

    const [formData, setFormData] = useState(defaultFormData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
        
        // Clear related fields when unchecking
        if (!checked) {
            if (name === 'is_degree') {
                setFormData(prev => ({ ...prev, degree_name: '' }));
            } else if (name === 'is_diploma') {
                setFormData(prev => ({ ...prev, diploma_name: '' }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                university_name: formData.university_name,
                graduation_year_from: formData.graduation_year_from,
                passing_year: formData.passing_year,
                highest_qualification: formData.highest_qualification,
                degree_name: formData.degree_name,
                is_degree: formData.is_degree,
                is_diploma: formData.is_diploma,
                diploma_name: formData.diploma_name,
            };

            if (profileData?.id) {
                await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, payload);
            } else {
                await apiCaller.post('/freelancer/freelancer-profile/', payload);
            }
            
            await refreshProfile();
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating education:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = () => {
        setFormData(defaultFormData);
        setIsEditing(true);
    };

    const hasEducationData = profileData && (
        profileData.university_name || 
        profileData.highest_qualification || 
        profileData.degree_name || 
        profileData.diploma_name
    );

    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-bold">My Education</h2>
            </div>
            
            <div className="space-y-4">
                {hasEducationData ? (
                    <div className="bg-[#F6F8FF] shadow-sm rounded-xl p-4">
                        <h3 className="font-semibold">
                            {profileData.is_degree ? 
                                `${profileData.degree_name || profileData.highest_qualification}` : 
                                profileData.is_diploma ? 
                                    `${profileData.diploma_name || profileData.highest_qualification}` : 
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
                                    value={formData.highest_qualification} 
                                    onChange={handleInputChange}
                                    placeholder="e.g., Bachelor's, Master's, PhD"
                                />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_degree" 
                                    checked={formData.is_degree}
                                    onCheckedChange={(checked) => handleCheckboxChange("is_degree", checked as boolean)}
                                />
                                <Label htmlFor="is_degree">This is a Degree</Label>
                            </div>
                            
                            {formData.is_degree && (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="degree_name">Degree Name</Label>
                                    <Input 
                                        id="degree_name" 
                                        name="degree_name"          
                                        value={formData.degree_name} 
                                        onChange={handleInputChange}
                                        placeholder="e.g., Bachelor of Science in Computer Science"
                                    />
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="is_diploma" 
                                    checked={formData.is_diploma}
                                    onCheckedChange={(checked) => handleCheckboxChange("is_diploma", checked as boolean)}
                                />
                                <Label htmlFor="is_diploma">This is a Diploma</Label>
                            </div>
                            
                            {formData.is_diploma && (
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="diploma_name">Diploma Name</Label>
                                    <Input 
                                        id="diploma_name" 
                                        name="diploma_name" 
                                        value={formData.diploma_name} 
                                        onChange={handleInputChange}
                                        placeholder="e.g., Diploma in Web Development"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline"   
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