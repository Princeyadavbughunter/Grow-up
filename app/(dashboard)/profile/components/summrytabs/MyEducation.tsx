// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";

interface MyEducationProps {
    profileData: any;
}

interface Qualification {
  id: number;
  university_name: string;
  graduation_year_from: string;
  passing_year: string;
  highest_qualification: string;
  degree_name: string;
  is_degree: boolean;
}

const defaultFormData = {
  university_name: "",
  graduation_year_from: "",
  passing_year: "",
  highest_qualification: "",
  degree_name: "",
  is_degree: false,
};

const MyEducation: React.FC<MyEducationProps> = ({ profileData }) => {
  const { api } = useAuthenticatedApi();
  const { authToken, apiCaller, refreshProfile } = useAuth();

  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditingNew, setIsEditingNew] = useState<boolean>(false);
  const [isEditingLegacy, setIsEditingLegacy] = useState<boolean>(false);

  const [selectedQualification, setSelectedQualification] = useState<Qualification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState(defaultFormData);
  
  const defaultLegacyFormData = {
      university_name: profileData?.university_name || "",
      graduation_year_from: profileData?.graduation_year_from || "",
      passing_year: profileData?.passing_year || "",
      highest_qualification: profileData?.highest_qualification || "",
      degree_name: profileData?.degree_name || "",
      is_degree: profileData?.is_degree || false,
  };
  const [legacyFormData, setLegacyFormData] = useState(defaultLegacyFormData);

  useEffect(() => {
    if (authToken) {
      fetchQualifications();
    }
  }, [authToken]);

  useEffect(() => {
    setLegacyFormData({
      university_name: profileData?.university_name || "",
      graduation_year_from: profileData?.graduation_year_from || "",
      passing_year: profileData?.passing_year || "",
      highest_qualification: profileData?.highest_qualification || "",
      degree_name: profileData?.degree_name || "",
      is_degree: profileData?.is_degree || false,
    });
  }, [profileData]);

  const fetchQualifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/freelancer/qualifications/');
      const data = response.data?.results ?? response.data ?? [];
      const sorted = [...data].sort((a, b) => {
        const aYear = parseInt(a.passing_year || a.graduation_year_from || "0");
        const bYear = parseInt(b.passing_year || b.graduation_year_from || "0");
        return bYear - aYear;
      });
      setQualifications(sorted);
    } catch (err) {
      console.error('Error fetching qualifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasEducationData = profileData && (
      profileData.university_name ||
      profileData.highest_qualification ||
      profileData.degree_name
  );

  const openAddModal = () => {
    setFormData(defaultFormData);
    setSelectedQualification(null);
    setIsAdding(true);
  };

  const openEditNewModal = (q: Qualification) => {
    setSelectedQualification(q);
    setFormData({
      university_name: q.university_name || "",
      graduation_year_from: q.graduation_year_from || "",
      passing_year: q.passing_year || "",
      highest_qualification: q.highest_qualification || "",
      degree_name: q.degree_name || "",
      is_degree: q.is_degree || false,
    });
    setIsEditingNew(true);
  };

  const openEditLegacyModal = () => {
    setLegacyFormData({
      university_name: profileData?.university_name || "",
      graduation_year_from: profileData?.graduation_year_from || "",
      passing_year: profileData?.passing_year || "",
      highest_qualification: profileData?.highest_qualification || "",
      degree_name: profileData?.degree_name || "",
      is_degree: profileData?.is_degree || false,
    });
    setIsEditingLegacy(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(checked === false && name === 'is_degree' ? { degree_name: '' } : {})
    }));
  };

  const handleLegacyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLegacyFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLegacyCheckboxChange = (name: string, checked: boolean) => {
    setLegacyFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(checked === false && name === 'is_degree' ? { degree_name: '' } : {})
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload: any = { 
        ...formData,
        is_current: !formData.passing_year
    };
    
    // Add explicitly named DRF mappings only if they have values to avoid empty string rejection
    if (formData.university_name.trim()) payload.university_name = formData.university_name.trim();
    if (formData.highest_qualification.trim()) payload.qualification_name = formData.highest_qualification.trim();
    if (formData.is_degree && formData.degree_name.trim()) payload.degree_name = formData.degree_name.trim();

    // HACK: Since the backend model lacks a start_year field, we combine Start and End into passing_year
    let combinedYear = "";
    if (formData.graduation_year_from.trim() && formData.passing_year.trim()) {
        combinedYear = `${formData.graduation_year_from.trim()} - ${formData.passing_year.trim()}`;
    } else if (formData.passing_year.trim()) {
        combinedYear = formData.passing_year.trim();
    } else if (formData.graduation_year_from.trim()) {
        combinedYear = `${formData.graduation_year_from.trim()} - Present`;
    }
    if (combinedYear) payload.passing_year = combinedYear;
    
    try {
      await apiCaller.post('/freelancer/qualifications/', [payload]);
    } catch (err: any) {
       try {
          // Fallback to sending as a single object in case the endpoint doesn't support bulk (list)
          await apiCaller.post('/freelancer/qualifications/', payload);
       } catch (fallbackErr: any) {
           console.error('API Error:', fallbackErr.response?.data);
       }
    } finally {
      await fetchQualifications();
      setIsAdding(false);
      setIsSubmitting(false);
    }
  };

  const handleEditNewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQualification) return;
    setIsSubmitting(true);
    
    const payload: any = { 
        ...formData,
        is_current: !formData.passing_year
    };
    
    if (formData.university_name.trim()) payload.university_name = formData.university_name.trim();
    if (formData.highest_qualification.trim()) payload.qualification_name = formData.highest_qualification.trim();
    if (formData.is_degree && formData.degree_name.trim()) payload.degree_name = formData.degree_name.trim();

    // HACK: Since the backend model lacks a start_year field, we combine Start and End into passing_year
    let combinedYear = "";
    if (formData.graduation_year_from.trim() && formData.passing_year.trim()) {
        combinedYear = `${formData.graduation_year_from.trim()} - ${formData.passing_year.trim()}`;
    } else if (formData.passing_year.trim()) {
        combinedYear = formData.passing_year.trim();
    } else if (formData.graduation_year_from.trim()) {
        combinedYear = `${formData.graduation_year_from.trim()} - Present`;
    }
    if (combinedYear) payload.passing_year = combinedYear;
    
    try {
      await apiCaller.patch(`/freelancer/qualifications/?id=${selectedQualification.id}`, payload);
    } catch (err: any) {
      console.error('API Error:', err.response?.data);
    } finally {
      await fetchQualifications();
      setIsEditingNew(false);
      setIsSubmitting(false);
    }
  };

  const handleDeleteNew = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    setIsSubmitting(true);
    try {
      await apiCaller.delete(`/freelancer/qualifications/?id=${id}`);
      await fetchQualifications();
      setIsEditingNew(false);
    } catch (err) {
      console.error('Error deleting qualification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLegacySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          if (profileData?.id) {
              await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, legacyFormData);
              await refreshProfile();
              setIsEditingLegacy(false);
          }
      } catch (error) {
          console.error("Error updating legacy education:", error);
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleDeleteLegacy = async () => {
      if (!window.confirm('Are you sure you want to delete this education entry?')) return;
      setIsSubmitting(true);
      try {
          if (profileData?.id) {
              const emptyPayload = {
                  university_name: "",
                  graduation_year_from: "",
                  passing_year: "",
                  highest_qualification: "",
                  degree_name: "",
                  is_degree: false,
              };
              await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, emptyPayload);
              await refreshProfile();
              setIsEditingLegacy(false);
          }
      } catch (error) {
          console.error("Error deleting legacy education:", error);
      } finally {
          setIsSubmitting(false);
      }
  };

  // Helper getters to safely extract fields varying across API schemas
  const extractYear = (val: any) => {
      if (!val) return '';
      const match = String(val).match(/\d{4}/);
      return match ? match[0] : String(val);
  };
  const getStartYear = (q: any) => {
      // Unpack hacked concatenated format from passing_year
      if (q.passing_year && String(q.passing_year).includes(' - ')) {
          return String(q.passing_year).split(' - ')[0];
      }
      return extractYear(q.start_date || q.graduation_year_from || q.start_year);
  };
  const getEndYear = (q: any) => {
      if (q.passing_year && String(q.passing_year).includes(' - ')) {
          return String(q.passing_year).split(' - ')[1];
      }
      return extractYear(q.end_date || q.passing_year || q.end_year);
  };
  const getInst = (q: any) => q.institution || q.university_name || 'Institution Name';
  const getDeg = (q: any) => q.is_degree ? (q.degree_name || q.qualification_name || q.highest_qualification) : (q.qualification_name || q.highest_qualification || q.degree || 'Degree');

  const renderFormFields = (data: typeof formData, onChange: typeof handleInputChange, onCheck: typeof handleCheckboxChange, isLegacy: boolean = false) => (
    <div className="grid gap-4 py-4">
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor="university_name">University/Institution</Label>
            <Input id="university_name" name="university_name" value={data.university_name} onChange={onChange} />
        </div>
        <div className={`grid grid-cols-2 gap-4`}>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="graduation_year_from">Start Year</Label>
                <Input id="graduation_year_from" name="graduation_year_from" value={data.graduation_year_from} onChange={onChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="passing_year">Passing Year</Label>
                <Input id="passing_year" name="passing_year" value={data.passing_year} onChange={onChange} />
            </div>
        </div>
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor="highest_qualification">Highest Qualification</Label>
            <Input id="highest_qualification" name="highest_qualification" value={data.highest_qualification} onChange={onChange} />
        </div>
        <div className="flex items-center space-x-2">
            <Checkbox id="is_degree" checked={data.is_degree} onCheckedChange={(c) => onCheck("is_degree", c as boolean)} />
            <Label htmlFor="is_degree">This is a Degree</Label>
        </div>
        {data.is_degree && (
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="degree_name">Degree Name</Label>
                <Input id="degree_name" name="degree_name" value={data.degree_name} onChange={onChange} />
            </div>
        )}
    </div>
  );

  return (
    <div>
      <div className="py-10">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Education</h2>
          <button
            onClick={openAddModal}
            className="w-[24px] h-[24px] flex items-center justify-center text-[#6A737D] hover:text-[#7052FF] transition-colors flex-shrink-0"
            aria-label="Add education"
          >
            <IoMdAdd size={20} />
          </button>
        </div>

        {loading ? (
           <div className="text-center py-10 text-gray-400">Loading education...</div>
        ) : (!hasEducationData && qualifications.length === 0) ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50/50">
                <p className="mb-4">No education added yet.</p>
                <Button onClick={openAddModal} className="bg-[#7052FF] hover:bg-[#5a42cc] rounded-xl transition-all">
                  Add Your Education
                </Button>
            </div>
        ) : (
          <div className="space-y-4">
            {/* Render Legacy Data First */}
            {hasEducationData && (
              <div className="w-full max-w-[571px] min-h-[66px] bg-[#F6F8FF] rounded-[16px] py-[16px] px-[12px] flex items-center justify-between gap-[10px]">
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h3 className="font-semibold text-[14px] text-black truncate leading-tight">
                        {profileData.university_name || 'Institution Name'}
                    </h3>
                    <p className="text-[12px] font-medium text-gray-500 truncate mt-[4px]">
                        {profileData.is_degree ?
                            `${profileData.degree_name || profileData.highest_qualification}` :
                            (profileData.highest_qualification || 'Degree')}
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] flex-shrink-0">
                    <span className="text-[12px] font-medium text-[#6A737D] whitespace-nowrap">
                        {profileData.graduation_year_from ?
                            `${profileData.graduation_year_from} – ${profileData.passing_year || 'Present'}` :
                            profileData.passing_year ? `Graduated ${profileData.passing_year}` : ''}
                    </span>
                    <Button
                      onClick={openEditLegacyModal}
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-[#7052FF] hover:bg-gray-200 transition-all h-8 w-8 rounded-full flex-shrink-0"
                    >
                      <CiEdit className="text-xl" />
                    </Button>
                  </div>
              </div>
            )}

            {/* Render New Qualifications */}
            {qualifications.map((q) => (
                <div
                  key={q.id}
                  className="w-full max-w-[571px] min-h-[66px] bg-[#F6F8FF] rounded-[16px] py-[16px] px-[12px] flex items-center justify-between gap-[10px]"
                >
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h3 className="font-semibold text-[14px] text-black truncate leading-tight">
                        {q.university_name || 'Institution Name'}
                    </h3>
                    <p className="text-[12px] font-medium text-gray-500 truncate mt-[4px]">
                        {getDeg(q)}
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] flex-shrink-0">
                    <span className="text-[12px] font-medium text-[#6A737D] whitespace-nowrap block">
                        {getStartYear(q) ?
                            `${getStartYear(q)} – ${getEndYear(q) || 'Present'}` :
                            getEndYear(q) ? `Graduated ${getEndYear(q)}` : ''}
                    </span>
                    <Button
                      onClick={() => openEditNewModal(q)}
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-[#7052FF] hover:bg-gray-200 transition-all h-8 w-8 rounded-full flex-shrink-0"
                    >
                      <CiEdit className="text-xl" />
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ADD NEW MODAL ── */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            {renderFormFields(formData, handleInputChange, handleCheckboxChange, false)}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#7052FF]" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Education'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── EDIT NEW MODAL ── */}
      <Dialog open={isEditingNew} onOpenChange={setIsEditingNew}>
        <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditNewSubmit}>
            {renderFormFields(formData, handleInputChange, handleCheckboxChange, false)}
            <DialogFooter className="flex justify-between">
              <Button type="button" variant="destructive" onClick={() => selectedQualification && handleDeleteNew(selectedQualification.id)} disabled={isSubmitting}>
                Delete
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditingNew(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#7052FF]" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── EDIT LEGACY MODAL ── */}
      <Dialog open={isEditingLegacy} onOpenChange={setIsEditingLegacy}>
        <DialogContent className="w-[95%] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Legacy Education</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLegacySubmit}>
            {renderFormFields(legacyFormData, handleLegacyInputChange, handleLegacyCheckboxChange, true)}
            <DialogFooter className="flex justify-between">
                <Button type="button" variant="destructive" onClick={handleDeleteLegacy} disabled={isSubmitting}>
                    Delete
                </Button>
                <div className="space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditingLegacy(false)}>Cancel</Button>
                    <Button type="submit" className="bg-[#7052FF]" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyEducation;