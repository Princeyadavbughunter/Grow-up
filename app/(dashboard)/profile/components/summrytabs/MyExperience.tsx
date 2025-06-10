// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface WorkExperience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  location: string;
  created_at: string;
  updated_at: string;
  currently_working: boolean;
  job_location: string;
  job_title: string;
  freelancer: string;
}

const MyExperience: React.FC = () => {
  
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const [isAdding, setIsAdding] = useState<boolean>(false);
  
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const { api } = useAuthenticatedApi();
  const { authToken, apiCaller } = useAuth();

  
  const [formData, setFormData] = useState({company_name: "",position: "",start_date: "",end_date: "",description: "",location: "",job_location: "",job_title: "",currently_working: false});

  const defaultFormData = {
    company_name: "",
    position: "",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
    job_location: "",
    job_title: "",
    currently_working: false
  };

  useEffect(() => {
    if (authToken) {
      fetchExperiences();
    }
  }, [authToken]);

  const fetchExperiences = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/freelancer/work-experience/');
      // Sort experiences by start date (most recent first)
      const sortedExperiences = [...response.data].sort((a, b) => 
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      setExperiences(sortedExperiences);
      setError(null);
    } catch (error) {
      console.error('Error fetching work experiences:', error);
      setError('Failed to load experiences. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Function to calculate duration
  const calculateDuration = (startDate: string, endDate: string | null, currentlyWorking: boolean): string => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : (endDate ? new Date(endDate) : new Date());
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    const totalMonths = years * 12 + months;
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;
    
    let result = '';
    if (displayYears > 0) {
      result += `${displayYears} yr${displayYears !== 1 ? 's' : ''}`;
    }
    if (displayMonths > 0 || displayYears === 0) {
      if (result) result += ' ';
      result += `${displayMonths} mo${displayMonths !== 1 ? 's' : ''}`;
    }
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev: any) => ({ 
      ...prev, 
      currently_working: checked,
      end_date: checked ? '' : prev.end_date
    }));
  };

  const openEditModal = (experience: WorkExperience) => {
    setSelectedExperience(experience);
    setFormData({
      company_name: experience.company_name || "",
      position: experience.position || "",
      start_date: formatDateForInput(experience.start_date),
      end_date: experience.currently_working ? "" : formatDateForInput(experience.end_date),
      description: experience.description || "",
      location: experience.location || "",
      job_location: experience.job_location || "",
      job_title: experience.job_title || "",
      currently_working: experience.currently_working
    });
    setIsEditing(true);
    setError(null);
  };

  const openAddModal = () => {
    setSelectedExperience(null);
    setFormData(defaultFormData);
    setIsAdding(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const dataToSubmit = {
      company_name: formData.company_name.trim(),
      position: formData.position.trim(),
      start_date: formData.start_date,
      end_date: formData.currently_working ? null : formData.end_date,
      description: formData.description.trim(),
      location: formData.location.trim(),
      currently_working: formData.currently_working,
      job_location: formData.job_location.trim(),
      job_title: formData.job_title.trim()
    };

    try {
      if (isEditing && selectedExperience) {
        // Update existing experience
        await apiCaller.patch(`/freelancer/work-experience/?id=${selectedExperience.id}`, dataToSubmit);
      } else if (isAdding) {
        // Add new experience
        await apiCaller.post('/freelancer/work-experience/', [dataToSubmit]);
      }
      
      // Refresh the experiences list
      await fetchExperiences();
      
      // Close modals
      setIsEditing(false);
      setIsAdding(false);
    } catch (error) {
      console.error("Error updating work experience:", error);
      setError("Failed to save changes. Please check your form and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await apiCaller.delete(`/freelancer/work-experience/${id}/`);
      await fetchExperiences();
      setIsEditing(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting work experience:", error);
      setError("Failed to delete experience. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">My Experience</h2>
          <Button 
            onClick={openAddModal} 
            className="bg-[#7052FF] flex items-center gap-1"
          >
            <IoMdAdd className="text-xl" /> Add Experience
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-10">Loading experiences...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div className="text-center py-6 text-gray-500 border border-dashed rounded-md p-10">
                <p className="mb-4">No work experience added yet.</p>
                <Button 
                  onClick={openAddModal} 
                  className="bg-[#7052FF]"
                >
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              experiences.map((experience) => (
                <div key={experience.id} className="flex gap-4 p-4 border rounded-md hover:shadow-md transition-shadow">
                  {/* Company logo placeholder - replace with actual logo if available */}
                  <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded text-lg font-bold">
                    {experience.company_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{experience.position}</h3>
                        <p className="text-md">
                          {experience.company_name}
                          {experience.job_location && ` - ${experience.job_location}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(experience.start_date)} – {experience.currently_working ? 'Present' : formatDate(experience.end_date || '')} · {calculateDuration(experience.start_date, experience.end_date, experience.currently_working)}
                        </p>
                        {experience.location && (
                          <p className="text-sm text-gray-500">{experience.location}</p>
                        )}
                      </div>
                      <Button 
                        onClick={() => openEditModal(experience)}
                        variant="ghost"
                        className="text-gray-500 hover:text-gray-700 transition-colors h-8 w-8 p-0"
                        aria-label="Edit experience"
                      >
                        <CiEdit className="text-xl" />
                      </Button>
                    </div>
                    {experience.description && (
                      <p className="text-sm text-gray-600 mt-3 whitespace-pre-line">
                        {experience.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Experience Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Work Experience</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company_name">Company Name*</Label>
                <Input 
                  id="company_name" 
                  name="company_name" 
                  value={formData.company_name} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="position">Position*</Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_title">Job Title</Label>
                <Input 
                  id="job_title" 
                  name="job_title" 
                  
                  value={formData.job_title} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="currently_working" 
                  
                  checked={formData.currently_working}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="currently_working"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I am currently working here
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="start_date">Start Date*</Label>
                  <Input 
                    id="start_date" 
                    name="start_date" 
                    type="date" 
                    
                    value={formData.start_date} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  {/* @ts-ignore */}
                  <Label htmlFor="end_date">End Date{!formData.currently_working && '*'}</Label>
                  <Input 
                    id="end_date" 
                    name="end_date" 
                    type="date" 
                    
                    value={formData.end_date} 
                    onChange={handleInputChange}
                    
                    disabled={formData.currently_working}
                    
                    required={!formData.currently_working}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Your Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  
                  value={formData.location} 
                  onChange={handleInputChange}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_location">Job Location</Label>
                <Input 
                  id="job_location" 
                  name="job_location" 
                  
                  value={formData.job_location} 
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, On-site, Hybrid"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  
                  value={formData.description} 
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your responsibilities and achievements"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </div>
            <DialogFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => selectedExperience && handleDelete(selectedExperience.id)}
                disabled={isSubmitting}
                className="mr-auto"
              >
                Delete
              </Button>
              <div className="space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
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
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Experience Modal */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Work Experience</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company_name">Company Name*</Label>
                <Input 
                  id="company_name" 
                  name="company_name" 
                  
                  value={formData.company_name} 
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Google"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="position">Position*</Label>
                <Input 
                  id="position" 
                  name="position" 
                  
                  value={formData.position} 
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_title">Job Title</Label>
                <Input 
                  id="job_title" 
                  name="job_title" 
                  
                  value={formData.job_title} 
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="currently_working" 
                  
                  checked={formData.currently_working}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="currently_working"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I am currently working here
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="start_date">Start Date*</Label>
                  <Input 
                    id="start_date" 
                    name="start_date" 
                    type="date" 
                    
                    value={formData.start_date} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  {/* @ts-ignore */}
                  <Label htmlFor="end_date">End Date{!formData.currently_working && '*'}</Label>
                  <Input 
                    id="end_date" 
                    name="end_date" 
                    type="date" 
                    
                    value={formData.end_date} 
                    onChange={handleInputChange}
                    
                    disabled={formData.currently_working}
                    
                    required={!formData.currently_working}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Your Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  
                  value={formData.location} 
                  onChange={handleInputChange}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_location">Job Location</Label>
                <Input 
                  id="job_location" 
                  name="job_location" 
                  
                  value={formData.job_location} 
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, On-site, Hybrid"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  
                  value={formData.description} 
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your responsibilities and achievements"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </div>
            <DialogFooter>
              <div className="space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAdding(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#7052FF]"
                >
                  {isSubmitting ? 'Adding...' : 'Add Experience'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyExperience;