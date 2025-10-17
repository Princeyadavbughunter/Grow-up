// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface WorkExperience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  location: string;
  currently_working: boolean;
  job_location: string;
  job_title: string;
}

interface ProfileData {
  id?: string;
  bio: string;
  university_name: string;
  graduation_year_from: string;
  address: string;
  city: string;
  district: string;
  pincode: string;
  state: string;
  interest_in: string;
  hobbies: string;
  highest_qualification: string;
  passing_year: string;
  degree_name: string;
  is_degree: string;
  is_diploma: string;
  diploma_name: string;
  is_disabled: string;
  date_of_birth: string;
  first_name: string;
  last_name: string;
  skills: string;
  gender: string;
  soft_skills: string;
}

const AddBioMain = () => {
  const { authToken } = useAuth();
  const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>("About");
  const [modalType, setModalType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { api } = useAuthenticatedApi();
  
  // Profile Data State
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  // Work Experience State
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isAddingExperience, setIsAddingExperience] = useState<boolean>(false);
  const [isEditingExperience, setIsEditingExperience] = useState<boolean>(false);
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null);
  
  const defaultExperienceForm = {
    company_name: "",
    position: "",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
    currently_working: false,
    job_location: "",
    job_title: ""
  };
  
  const [experienceForm, setExperienceForm] = useState(defaultExperienceForm);
  
  // Profile Form State
  const defaultProfileForm = {
    bio: "",
    university_name: "",
    graduation_year_from: "",
    address: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    interest_in: "",
    hobbies: "",
    highest_qualification: "",
    passing_year: "",
    degree_name: "",
    is_degree: "True",
    is_diploma: "",
    diploma_name: "",
    is_disabled: "",
    date_of_birth: "",
    first_name: "",
    last_name: "",
    skills: "",
    gender: "",
    soft_skills: ""
  };
  
  const [profileForm, setProfileForm] = useState(defaultProfileForm);

  useEffect(() => {
    if (authToken) {
      fetchProfileData();
      fetchExperiences();
    }
  }, [authToken]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/freelancer/freelancer-profile/');
      if (response.data && response.data.length > 0) {
        setProfileData(response.data[0]);
        setProfileForm({
          bio: response.data[0].bio || "",
          university_name: response.data[0].university_name || "",
          graduation_year_from: response.data[0].graduation_year_from || "",
          address: response.data[0].address || "",
          city: response.data[0].city || "",
          district: response.data[0].district || "",
          pincode: response.data[0].pincode || "",
          state: response.data[0].state || "",
          interest_in: response.data[0].interest_in || "",
          hobbies: response.data[0].hobbies || "",
          highest_qualification: response.data[0].highest_qualification || "",
          passing_year: response.data[0].passing_year || "",
          degree_name: response.data[0].degree_name || "",
          is_degree: response.data[0].is_degree || "True",
          is_diploma: response.data[0].is_diploma || "",
          diploma_name: response.data[0].diploma_name || "",
          is_disabled: response.data[0].is_disabled || "",
          date_of_birth: response.data[0].date_of_birth || "",
          first_name: response.data[0].first_name || "",
          last_name: response.data[0].last_name || "",
          skills: response.data[0].skills || "",
          gender: response.data[0].gender || "",
          soft_skills: response.data[0].soft_skills || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/freelancer/work-experience/');
      if (response.data) {
        setExperiences(response.data);
      }
    } catch (error) {
      console.error("Error fetching work experiences:", error);
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProfileForm(prev => ({ ...prev, [name]: checked ? "True" : "" }));
  };

  const handleExperienceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExperienceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceCheckboxChange = (checked: boolean) => {
    setExperienceForm(prev => ({ ...prev, currently_working: checked }));
  };

  const submitProfileData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    
    // Append all profile form fields to formData
    Object.entries(profileForm).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    try {
      if (profileData?.id) {
        await api.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, formData);
      } else {
        await api.post('/freelancer/freelancer-profile/', formData);
      }
      await fetchProfileData();
      setModalType("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to save profile changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitExperienceData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const dataToSubmit = {
      company_name: experienceForm.company_name.trim(),
      position: experienceForm.position.trim(),
      start_date: experienceForm.start_date,
      end_date: experienceForm.currently_working ? null : experienceForm.end_date,
      description: experienceForm.description.trim(),
      location: experienceForm.location.trim(),
      currently_working: experienceForm.currently_working,
      job_location: experienceForm.job_location.trim(),
      job_title: experienceForm.job_title.trim()
    };

    try {
      if (isEditingExperience && selectedExperience) {
        await api.patch(`/freelancer/work-experience/?id=${selectedExperience.id}`, dataToSubmit);
      } else {
        await api.post('/freelancer/work-experience/', [dataToSubmit]);
      }
      
      await fetchExperiences();
      setIsAddingExperience(false);
      setIsEditingExperience(false);
      setExperienceForm(defaultExperienceForm);
    } catch (error) {
      console.error("Error updating work experience:", error);
      setError("Failed to save experience changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddExperienceModal = () => {
    setSelectedExperience(null);
    setExperienceForm(defaultExperienceForm);
    setIsAddingExperience(true);
    setIsEditingExperience(false);
    setError(null);
  };

  const openEditExperienceModal = (experience: WorkExperience) => {
    setSelectedExperience(experience);
    setExperienceForm({
      company_name: experience.company_name,
      position: experience.position,
      start_date: experience.start_date,
      end_date: experience.end_date || "",
      description: experience.description,
      location: experience.location,
      currently_working: experience.currently_working,
      job_location: experience.job_location,
      job_title: experience.job_title
    });
    setIsEditingExperience(true);
    setIsAddingExperience(false);
    setError(null);
  };

  const deleteExperience = async (id: string) => {
    try {
      await api.delete(`/freelancer/work-experience/?id=${id}`);
      await fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      setError("Failed to delete experience");
    }
  };

  const openSummaryModal = () => {
    setModalType("summary");
  };

  const openEducationModal = () => {
    setModalType("education");
  };

  const openSkillsModal = () => {
    setModalType("skills");
  };

  const renderExperienceCard = (experience: WorkExperience) => (
    <div key={experience.id} className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{experience.job_title || experience.position}</h3>
          <p className="text-gray-600">{experience.company_name}</p>
          <p className="text-gray-500 text-sm">
            {experience.start_date} - {experience.currently_working ? 'Present' : experience.end_date}
          </p>
          <p className="text-gray-500 text-sm">{experience.location || experience.job_location}</p>
          <p className="mt-2">{experience.description}</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => openEditExperienceModal(experience)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button 
            onClick={() => deleteExperience(experience.id)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSummaryContent = () => {
    if (profileData?.bio) {
      return (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <p>{profileData.bio}</p>
            <button 
              onClick={openSummaryModal}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-[#F6F8FF] rounded-lg p-20">
        <p 
          className='text-blue-500 text-center cursor-pointer text-lg flex justify-center items-center'
          onClick={openSummaryModal}
        >
          add<PlusIcon color='gray' />
        </p>
      </div>
    );
  };

  const renderExperienceContent = () => {
    if (experiences.length > 0) {
      return (
        <div>
          {experiences.map(experience => renderExperienceCard(experience))}
          <Button 
            onClick={openAddExperienceModal}
            className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
          >
            Add More Experience
          </Button>
        </div>
      );
    }
    
    return (
      <div className="bg-[#F6F8FF] rounded-lg p-20">
        <p 
          className='text-blue-500 text-center cursor-pointer text-lg flex justify-center items-center'
          onClick={openAddExperienceModal}
        >
          add<PlusIcon color='gray' />
        </p>
      </div>
    );
  };

  const renderEducationContent = () => {
    if (profileData?.university_name) {
      return (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{profileData.degree_name}</h3>
              <p className="text-gray-600">{profileData.university_name}</p>
              <p className="text-gray-500 text-sm">
                {profileData.graduation_year_from} - {profileData.passing_year}
              </p>
              <p className="mt-2">{profileData.highest_qualification}</p>
            </div>
            <button 
              onClick={openEducationModal}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-[#F6F8FF] rounded-lg p-20">
        <p 
          className='text-blue-500 text-center cursor-pointer text-lg flex justify-center items-center'
          onClick={openEducationModal}
        >
          add<PlusIcon color='gray' />
        </p>
      </div>
    );
  };

  const renderSkillsContent = () => {
    if (profileData?.skills) {
      const skillsArray = profileData.skills.split(',');
      const softSkillsArray = profileData.soft_skills ? profileData.soft_skills.split(',') : [];
      
      return (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Technical Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {skillsArray.map((skill, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
              
              {softSkillsArray.length > 0 && (
                <>
                  <h3 className="font-semibold text-lg mt-4">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {softSkillsArray.map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={openSkillsModal}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-[#F6F8FF] rounded-lg p-20">
        <p 
          className='text-blue-500 text-center cursor-pointer text-lg flex justify-center items-center'
          onClick={openSkillsModal}
        >
          add<PlusIcon color='gray' />
        </p>
      </div>
    );
  };

  return (
    <div className=''>
      <p className='underline font-semibold'>Your bio</p>
      <div className="flex space-x-4 py-4">
        {["About", "Skills", "Porfolio", "Post"].map((tab) => (
          <Button
            key={tab}
            variant={activeJobTypeTab === tab ? "default" : "ghost"}
            className={activeJobTypeTab === tab ? "bg-[#979797] hover:bg-[#dcdcdc] rounded-full" : "rounded-full bg-[#dcdcdc]"}
            onClick={() => setActiveJobTypeTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeJobTypeTab === "About" && (
        <>
          <div className="py-10">
            <p className='text-black font-semibold'>Summary</p>
            {renderSummaryContent()}
          </div>
          
          <div className="py-10">
            <p className='text-black font-semibold'>My Experience</p>
            {renderExperienceContent()}
          </div>
          
          <div className="py-10">
            <p className='text-black font-semibold'>My Education</p>
            {renderEducationContent()}
          </div>
        </>
      )}

      {activeJobTypeTab === "Skills" && (
        <div className="py-10">
          <p className='text-black font-semibold'>My Skills</p>
          {renderSkillsContent()}
        </div>
      )}

      {/* Summary Modal */}
      <Dialog open={modalType === "summary"} onOpenChange={() => modalType === "summary" && setModalType("")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{profileData?.bio ? "Edit Summary" : "Add Summary"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitProfileData}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={profileForm.bio} 
                  onChange={handleProfileInputChange}
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    value={profileForm.first_name} 
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input 
                    id="last_name" 
                    name="last_name" 
                    value={profileForm.last_name} 
                    onChange={handleProfileInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <select 
                  id="gender" 
                  name="gender" 
                  value={profileForm.gender} 
                  onChange={handleProfileInputChange}
                  className="border rounded-md p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input 
                  id="date_of_birth" 
                  name="date_of_birth" 
                  value={profileForm.date_of_birth} 
                  onChange={handleProfileInputChange}
                  placeholder="DD-MM-YYYY"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={profileForm.address} 
                  onChange={handleProfileInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={profileForm.city} 
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="district">District</Label>
                  <Input 
                    id="district" 
                    name="district" 
                    value={profileForm.district} 
                    onChange={handleProfileInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={profileForm.state} 
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input 
                    id="pincode" 
                    name="pincode" 
                    value={profileForm.pincode} 
                    onChange={handleProfileInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="interest_in">Interests</Label>
                <Input 
                  id="interest_in" 
                  name="interest_in" 
                  value={profileForm.interest_in} 
                  onChange={handleProfileInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="hobbies">Hobbies</Label>
                <Input 
                  id="hobbies" 
                  name="hobbies" 
                  value={profileForm.hobbies} 
                  onChange={handleProfileInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_disabled" 
                  checked={profileForm.is_disabled === "True"}
                  onCheckedChange={(checked) => handleCheckboxChange("is_disabled", checked as boolean)}
                />
                <Label htmlFor="is_disabled">Person with disability</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalType("")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#7052FF]"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={modalType === "education"} onOpenChange={() => modalType === "education" && setModalType("")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{profileData?.university_name ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitProfileData}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="university_name">University/Institution</Label>
                <Input 
                  id="university_name" 
                  name="university_name" 
                  value={profileForm.university_name} 
                  onChange={handleProfileInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="graduation_year_from">Start Year</Label>
                  <Input 
                    id="graduation_year_from" 
                    name="graduation_year_from" 
                    value={profileForm.graduation_year_from} 
                    onChange={handleProfileInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="passing_year">Passing Year</Label>
                  <Input 
                    id="passing_year" 
                    name="passing_year" 
                    value={profileForm.passing_year} 
                    onChange={handleProfileInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="highest_qualification">Highest Qualification</Label>
                <Input 
                  id="highest_qualification" 
                  name="highest_qualification" 
                  value={profileForm.highest_qualification} 
                  onChange={handleProfileInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_degree" 
                  checked={profileForm.is_degree === "True"}
                  onCheckedChange={(checked) => handleCheckboxChange("is_degree", checked as boolean)}
                />
                <Label htmlFor="is_degree">Degree</Label>
              </div>
              {profileForm.is_degree === "True" && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="degree_name">Degree Name</Label>
                  <Input 
                    id="degree_name" 
                    name="degree_name" 
                    value={profileForm.degree_name} 
                    onChange={handleProfileInputChange}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_diploma" 
                  checked={profileForm.is_diploma === "True"}
                  onCheckedChange={(checked) => handleCheckboxChange("is_diploma", checked as boolean)}
                />
                <Label htmlFor="is_diploma">Diploma</Label>
              </div>
              {profileForm.is_diploma === "True" && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="diploma_name">Diploma Name</Label>
                  <Input 
                    id="diploma_name" 
                    name="diploma_name" 
                    value={profileForm.diploma_name} 
                    onChange={handleProfileInputChange}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalType("")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#7052FF]"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skills Modal */}
      <Dialog open={modalType === "skills"} onOpenChange={() => modalType === "skills" && setModalType("")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{profileData?.skills ? "Edit Skills" : "Add Skills"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitProfileData}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="skills">Technical Skills (comma-separated)</Label>
                <Input 
                  id="skills" 
                  name="skills" 
                  value={profileForm.skills} 
                  onChange={handleProfileInputChange}
                  placeholder="e.g. React, Python, JavaScript"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="soft_skills">Soft Skills (comma-separated)</Label>
                <Input 
                  id="soft_skills" 
                  name="soft_skills" 
                  value={profileForm.soft_skills} 
                  onChange={handleProfileInputChange}
                  placeholder="e.g. Communication, Teamwork, Leadership"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalType("")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#7052FF]"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Work Experience Modal */}
      <Dialog 
        open={isAddingExperience || isEditingExperience} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingExperience(false);
            setIsEditingExperience(false);
            setExperienceForm(defaultExperienceForm);
            setError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditingExperience ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitExperienceData}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company_name">Company Name</Label>
                <Input 
                  id="company_name" 
                  name="company_name" 
                  value={experienceForm.company_name} 
                  onChange={handleExperienceInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_title">Job Title</Label>
                <Input 
                  id="job_title" 
                  name="job_title" 
                  value={experienceForm.job_title} 
                  onChange={handleExperienceInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={experienceForm.position} 
                  onChange={handleExperienceInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_location">Location</Label>
                <Input 
                  id="job_location" 
                  name="job_location" 
                  value={experienceForm.job_location} 
                  onChange={handleExperienceInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input 
                    id="start_date" 
                    name="start_date" 
                    type="date" 
                    value={experienceForm.start_date} 
                    onChange={handleExperienceInputChange}
                    required
                  />
                </div>
                {!experienceForm.currently_working && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input 
                      id="end_date" 
                      name="end_date" 
                      type="date" 
                      value={experienceForm.end_date as string} 
                      onChange={handleExperienceInputChange}
                      required={!experienceForm.currently_working}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="currently_working" 
                  checked={experienceForm.currently_working}
                  onCheckedChange={handleExperienceCheckboxChange}
                />
                <Label htmlFor="currently_working">I am currently working here</Label>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={experienceForm.description} 
                  onChange={handleExperienceInputChange}
                  rows={4}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddingExperience(false);
                  setIsEditingExperience(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#7052FF]"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBioMain;