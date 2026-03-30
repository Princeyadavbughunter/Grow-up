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

  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
    job_location: "",
    job_title: "",
    currently_working: false
  });

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

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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
    if (displayYears > 0) result += `${displayYears} yr${displayYears !== 1 ? 's' : ''}`;
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
    setFormData(prev => ({
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
        await apiCaller.patch(`/freelancer/work-experience/?id=${selectedExperience.id}`, dataToSubmit);
      } else if (isAdding) {
        await apiCaller.post('/freelancer/work-experience/', [dataToSubmit]);
      }

      await fetchExperiences();
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
    if (!window.confirm("Are you sure you want to delete this experience?")) return;

    try {
      setIsSubmitting(true);
      // Use same pattern as PATCH: delete via query param on the list endpoint
      await apiCaller.delete(`/freelancer/work-experience/?id=${id}`);
      await fetchExperiences();
      setIsEditing(false);
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
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Experience</h2>
          <button
            onClick={openAddModal}
            className="w-[24px] h-[24px] flex items-center justify-center text-[#6A737D] hover:text-[#7052FF] transition-colors flex-shrink-0"
            aria-label="Add experience"
          >
            <IoMdAdd size={20} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading experiences...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-medium">{error}</div>
        ) : (
          <div className="space-y-8">
            {experiences.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/50">
                <p className="mb-4">No work experience added yet.</p>
                <Button onClick={openAddModal} className="bg-[#7052FF] hover:bg-[#5a42cc] rounded-xl transition-all">
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              experiences.map((experience, index) => (
                <div key={experience.id} className={`flex gap-4 relative ${index !== experiences.length - 1 ? 'border-b border-gray-100 pb-8' : ''}`}>
                  {/* Company Initial Circle */}
                  <div className="h-12 w-12 bg-[#F6F8FF] border border-gray-100 flex items-center justify-center rounded-xl text-lg font-bold text-[#7052FF] flex-shrink-0">
                    {experience.company_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {experience.position}
                        </h3>
                        <p className="text-[15px] font-medium text-[#7052FF] mt-1">
                          {experience.company_name}
                          {experience.job_location && <span className="text-gray-400 font-normal"> · {experience.job_location}</span>}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                          {formatDate(experience.start_date)} – {experience.currently_working ? 'Present' : formatDate(experience.end_date || '')}
                          <span className="text-gray-200">•</span>
                          <span className="text-gray-500">{calculateDuration(experience.start_date, experience.end_date, experience.currently_working)}</span>
                        </p>
                      </div>

                      <Button
                        onClick={() => openEditModal(experience)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-[#7052FF] hover:bg-[#F6F8FF] transition-all h-8 w-8 rounded-full"
                        aria-label="Edit experience"
                      >
                        <CiEdit className="text-xl" />
                      </Button>
                    </div>

                    {experience.description && (
                      <div className="mt-4 text-[14px] text-gray-600 leading-relaxed max-w-2xl whitespace-pre-line">
                        {experience.description}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Work Experience</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">

              {/* Inputs */}
              <div className="flex flex-col space-y-1.5">
                <Label>Company Name*</Label>
                <Input name="company_name" value={formData.company_name} onChange={handleInputChange} required />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Position*</Label>
                <Input name="position" value={formData.position} onChange={handleInputChange} required />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Job Title</Label>
                <Input name="job_title" value={formData.job_title} onChange={handleInputChange} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox checked={formData.currently_working} onCheckedChange={handleCheckboxChange} />
                <label>I am currently working here</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Start Date*</Label>
                  <Input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    disabled={formData.currently_working}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Your Location</Label>
                <Input name="location" value={formData.location} onChange={handleInputChange} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Job Location</Label>
                <Input name="job_location" value={formData.job_location} onChange={handleInputChange} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => selectedExperience && handleDelete(selectedExperience.id)}
                disabled={isSubmitting}
              >
                Delete
              </Button>

              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#7052FF]" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD MODAL */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Work Experience</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">

              <div className="flex flex-col space-y-1.5">
                <Label>Company Name*</Label>
                <Input name="company_name" value={formData.company_name} onChange={handleInputChange} required />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Position*</Label>
                <Input name="position" value={formData.position} onChange={handleInputChange} required />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Job Title</Label>
                <Input name="job_title" value={formData.job_title} onChange={handleInputChange} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox checked={formData.currently_working} onCheckedChange={handleCheckboxChange} />
                <label>I am currently working here</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Start Date*</Label>
                  <Input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    disabled={formData.currently_working}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Your Location</Label>
                <Input name="location" value={formData.location} onChange={handleInputChange} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Job Location</Label>
                <Input name="job_location" value={formData.job_location} onChange={handleInputChange} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#7052FF]" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Experience'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyExperience;
