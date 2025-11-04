// @ts-nocheck
import React, { useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedin, FaInstagramSquare, FaPencilAlt, FaCamera, FaDownload, FaUpload, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { Button } from "@/components/ui/button";
import { ImUsers } from "react-icons/im";
import { FaMessage } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Use the exact same interface as in AuthContext
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
  connection_count?: number;
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

interface ProfileDataProps {
  profileData: FreelancerProfile | null;
}

interface ProfileFormData {
  first_name: string;
  last_name: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  skills: string;
  facebook_account: string;
  linkedin_account: string;
  instagram_account: string;
  twitter_account: string;
}

interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  skills?: string;
  facebook_account?: string;
  linkedin_account?: string;
  instagram_account?: string;
  twitter_account?: string;
  profile_picture?: string;
  resume?: string;
}

const ProfileData: React.FC<ProfileDataProps> = ({ profileData }) => {
  const { apiCaller, refreshProfile, logout, isAuthenticated, authToken } = useAuth();
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [followerCount, setFollowerCount] = useState(profileData?.follower_count || 0);
  const [connectionCount, setConnectionCount] = useState(profileData?.connection_count || 0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Fetch follow statistics
  React.useEffect(() => {
    const fetchFollowStats = async () => {
      if (!profileData?.id || !isAuthenticated || !authToken) return;
      
      try {
        const response = await apiCaller.get('/freelancer/follow-request/');
        if (response.data) {
          const { approved_followers, following_approved } = response.data;
          
          const followersList = approved_followers || [];
          setFollowerCount(followersList.length);
          
          const followingList = following_approved || [];
          const followerIds = new Set(followersList.map((f: any) => f.profile_id));
          const connections = followingList.filter((f: any) => followerIds.has(f.freelancer_id));
          setConnectionCount(connections.length);
        }
      } catch (error) {
        console.error('Error fetching follow stats:', error);
        setFollowerCount(profileData?.follower_count || 0);
        setConnectionCount(profileData?.connection_count || 0);
      }
    };

    if (profileData?.id && isAuthenticated && authToken) {
      fetchFollowStats();
    }
  }, [profileData?.id, apiCaller, isAuthenticated, authToken]);

  const initialFormData: ProfileFormData = {
    first_name: profileData?.first_name || "",
    last_name: profileData?.last_name || "",
    bio: profileData?.bio || "",
    address: profileData?.address || "",
    city: profileData?.city || "",
    state: profileData?.state || "",
    skills: profileData?.skills || "",
    facebook_account: profileData?.facebook_account || "",
    linkedin_account: profileData?.linkedin_account || "",
    instagram_account: profileData?.instagram_account || "",
    twitter_account: profileData?.twitter_account || "",
  };

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  // Validation helper functions
  const ensureHttps = (url: string): string => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return '';
    
    // If URL already has a protocol, return as is
    if (trimmedUrl.match(/^https?:\/\//i)) {
      return trimmedUrl;
    }
    
    // Add https:// if missing
    return `https://${trimmedUrl}`;
  };

  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty URLs are valid (optional field)
    try {
      const urlObj = new URL(ensureHttps(url));
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidSocialUrl = (url: string, platform: string): { valid: boolean; message?: string } => {
    if (!url) return { valid: true }; // Empty is valid
    
    const formattedUrl = ensureHttps(url);
    
    // Check if it's a valid URL format
    if (!isValidUrl(formattedUrl)) {
      return { valid: false, message: `Please enter a valid ${platform} URL` };
    }

    // Platform-specific validation
    const platformPatterns: Record<string, RegExp> = {
      linkedin: /linkedin\.com\/(in|company)\/.+/i,
      twitter: /(twitter\.com|x\.com)\/.+/i,
      instagram: /instagram\.com\/.+/i,
      facebook: /facebook\.com\/.+/i,
    };

    const pattern = platformPatterns[platform.toLowerCase()];
    if (pattern && !pattern.test(formattedUrl)) {
      return { 
        valid: false, 
        message: `Please enter a valid ${platform} profile URL (e.g., https://${platform.toLowerCase()}.com/username)` 
      };
    }

    return { valid: true };
  };

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'first_name':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'First name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;

      case 'last_name':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;

      case 'bio':
        if (value && value.length > 500) return 'Bio must be less than 500 characters';
        return undefined;

      case 'address':
        if (value && value.length > 200) return 'Address must be less than 200 characters';
        return undefined;

      case 'city':
        if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return 'City name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;

      case 'state':
        if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return 'State name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;

      case 'skills':
        if (value) {
          const skillsArray = value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
          if (skillsArray.length > 20) return 'Maximum 20 skills allowed';
          const invalidSkills = skillsArray.filter((s: string) => s.length > 50);
          if (invalidSkills.length > 0) return 'Each skill must be less than 50 characters';
        }
        return undefined;

      case 'linkedin_account': {
        const result = isValidSocialUrl(value, 'LinkedIn');
        return result.valid ? undefined : result.message;
      }

      case 'twitter_account': {
        const result = isValidSocialUrl(value, 'Twitter');
        return result.valid ? undefined : result.message;
      }

      case 'instagram_account': {
        const result = isValidSocialUrl(value, 'Instagram');
        return result.valid ? undefined : result.message;
      }

      case 'facebook_account': {
        const result = isValidSocialUrl(value, 'Facebook');
        return result.valid ? undefined : result.message;
      }

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof ProfileFormData]);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
      }
    });

    // Validate files
    if (profileImageFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (profileImageFile.size > maxSize) {
        newErrors.profile_picture = 'Profile picture must be less than 5MB';
      }
      if (!profileImageFile.type.startsWith('image/')) {
        newErrors.profile_picture = 'Only image files are allowed';
      }
    }

    if (resumeFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (resumeFile.size > maxSize) {
        newErrors.resume = 'Resume must be less than 10MB';
      }
      if (resumeFile.type !== 'application/pdf') {
        newErrors.resume = 'Only PDF files are allowed for resume';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field on change (real-time validation)
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Auto-format social media URLs on blur
    if (['linkedin_account', 'twitter_account', 'instagram_account', 'facebook_account'].includes(name)) {
      if (value && value.trim()) {
        const formattedUrl = ensureHttps(value);
        setFormData(prev => ({
          ...prev,
          [name]: formattedUrl
        }));
        
        // Validate the formatted URL
        const error = validateField(name, formattedUrl);
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    } else {
      // Validate other fields
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'Profile picture must be less than 5MB'
        }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_picture: 'Only image files are allowed'
        }));
        return;
      }

      // Clear previous error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.profile_picture;
        return newErrors;
      });

      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          resume: 'Resume must be less than 10MB'
        }));
        return;
      }
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({
          ...prev,
          resume: 'Only PDF files are allowed for resume'
        }));
        return;
      }

      // Clear previous error
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.resume;
        return newErrors;
      });

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allFields);

    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add text fields with formatted URLs
      Object.entries(formData).forEach(([key, value]) => {
        if (['linkedin_account', 'twitter_account', 'instagram_account', 'facebook_account'].includes(key) && value) {
          formDataToSend.append(key, ensureHttps(value as string));
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      // Add profile picture if selected
      if (profileImageFile) {
        formDataToSend.append('profile_picture', profileImageFile);
      }

      // Add resume if selected
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      if (profileData) {
        await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await apiCaller.post('/freelancer/freelancer-profile/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      await refreshProfile();
      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setResumeFile(null);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error updating profile:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();

  const openEditModal = () => {
    const resetFormData: ProfileFormData = {
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      bio: profileData?.bio || "",
      address: profileData?.address || "",
      city: profileData?.city || "",
      state: profileData?.state || "",
      skills: profileData?.skills || "",
      facebook_account: profileData?.facebook_account || "",
      linkedin_account: profileData?.linkedin_account || "",
      instagram_account: profileData?.instagram_account || "",
      twitter_account: profileData?.twitter_account || "",
    };
    
    setFormData(resetFormData);
    setProfileImagePreview(null);
    setProfileImageFile(null);
    setResumeFile(null);
    setErrors({});
    setTouched({});
    setIsEditing(true);
  };

  const downloadResume = () => {
    if (profileData?.resume) {
      window.open(profileData.resume, '_blank');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  // Error message component
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-sm text-red-600 mt-1">{message}</p>;
  };

  if (!profileData) {
    return (
      <>
        <div className="py-8">
          {/* Enhanced No Profile Data UI */}
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaUserPlus className="text-gray-400 text-3xl" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Complete Your Profile
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-md">
              Your profile is the first impression potential clients will see. 
              Let's get it set up with your professional information, skills, and experience.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 max-w-lg">
              <h3 className="font-medium text-gray-800 mb-3">Why complete your profile?</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7052FF] rounded-full"></div>
                  Stand out to potential clients
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7052FF] rounded-full"></div>
                  Showcase your skills and experience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7052FF] rounded-full"></div>
                  Build trust with professional information
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7052FF] rounded-full"></div>
                  Get discovered by relevant opportunities
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={openEditModal}
              className="bg-[#7052FF] hover:bg-[#5a42cc] text-white font-medium px-8 py-3 rounded-lg flex items-center gap-2 text-lg"
            >
              <FaPencilAlt size={16} />
              Create My Profile
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              It only takes a few minutes to get started
            </p>
          </div>
        </div>

        {/* Edit Modal - Create Profile */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Your Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="first_name">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="first_name" 
                      name="first_name" 
                      value={formData?.first_name || ""} 
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.first_name && touched.first_name ? 'border-red-500' : ''}
                      required
                    />
                    <ErrorMessage message={touched.first_name ? errors.first_name : undefined} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="last_name">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="last_name" 
                      name="last_name" 
                      value={formData?.last_name || ""} 
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.last_name && touched.last_name ? 'border-red-500' : ''}
                      required
                    />
                    <ErrorMessage message={touched.last_name ? errors.last_name : undefined} />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={formData?.bio || ""} 
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className={errors.bio && touched.bio ? 'border-red-500' : ''}
                  />
                  <ErrorMessage message={touched.bio ? errors.bio : undefined} />
                  {formData?.bio && (
                    <p className="text-xs text-gray-500">{formData.bio.length}/500 characters</p>
                  )}
                </div>
                
                {/* Profile Picture Upload */}
                <div className="flex flex-col space-y-3">
                  <Label>Profile Picture</Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div 
                      className={`w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed ${errors.profile_picture ? 'border-red-500' : 'border-gray-300'} flex items-center justify-center cursor-pointer hover:border-[#7052FF] transition-colors overflow-hidden`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {profileImagePreview ? (
                        <img 
                          src={profileImagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaCamera className="text-gray-400 text-xl" />
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#7052FF] hover:underline font-medium"
                      >
                        Choose New Picture
                      </button>
                      <p className="text-sm text-gray-500 mt-1">
                        Recommended: 400x400px, max 5MB
                      </p>
                      {profileImageFile && (
                        <p className="text-sm text-green-600 mt-1">
                          Selected: {profileImageFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <ErrorMessage message={errors.profile_picture} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Resume Upload */}
                <div className="flex flex-col space-y-3">
                  <Label>Resume</Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => resumeInputRef.current?.click()}
                        className="bg-[#7052FF] hover:bg-[#5a42cc] text-white flex items-center gap-2"
                      >
                        <FaUpload size={14} />
                        Upload Resume
                      </Button>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-gray-500">
                        PDF files only, max 10MB
                      </p>
                      {resumeFile && (
                        <p className="text-sm text-green-600 mt-1">
                          Selected: {resumeFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <ErrorMessage message={errors.resume} />
                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf"
                    className="hidden"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData?.address || ""} 
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.address && touched.address ? 'border-red-500' : ''}
                  />
                  <ErrorMessage message={touched.address ? errors.address : undefined} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData?.city || ""} 
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.city && touched.city ? 'border-red-500' : ''}
                    />
                    <ErrorMessage message={touched.city ? errors.city : undefined} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={formData?.state || ""} 
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={errors.state && touched.state ? 'border-red-500' : ''}
                    />
                    <ErrorMessage message={touched.state ? errors.state : undefined} />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input 
                    id="skills" 
                    name="skills" 
                    value={formData?.skills || ""} 
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="React, Node.js, JavaScript, Python..."
                    className={errors.skills && touched.skills ? 'border-red-500' : ''}
                  />
                  <ErrorMessage message={touched.skills ? errors.skills : undefined} />
                </div>

                {/* Social Links */}
                <div className="flex flex-col space-y-3">
                  <Label>Social Links</Label>
                  <p className="text-xs text-gray-500">URLs will be automatically formatted with https:// if missing</p>
                  <div className="grid gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="linkedin_account" className="flex items-center gap-2">
                          <FaLinkedin className="text-blue-600" /> LinkedIn
                        </Label>
                        <Input 
                          id="linkedin_account" 
                          name="linkedin_account" 
                          placeholder="https://linkedin.com/in/username" 
                          value={formData?.linkedin_account || ""} 
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={errors.linkedin_account && touched.linkedin_account ? 'border-red-500' : ''}
                        />
                        <ErrorMessage message={touched.linkedin_account ? errors.linkedin_account : undefined} />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="twitter_account" className="flex items-center gap-2">
                          <TiSocialTwitter className="text-blue-400" /> Twitter
                        </Label>
                        <Input 
                          id="twitter_account" 
                          name="twitter_account" 
                          placeholder="https://twitter.com/username" 
                          value={formData?.twitter_account || ""} 
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={errors.twitter_account && touched.twitter_account ? 'border-red-500' : ''}
                        />
                        <ErrorMessage message={touched.twitter_account ? errors.twitter_account : undefined} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="instagram_account" className="flex items-center gap-2">
                          <FaInstagramSquare className="text-pink-600" /> Instagram
                        </Label>
                        <Input 
                          id="instagram_account" 
                          name="instagram_account" 
                          placeholder="https://instagram.com/username" 
                          value={formData?.instagram_account || ""} 
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={errors.instagram_account && touched.instagram_account ? 'border-red-500' : ''}
                        />
                        <ErrorMessage message={touched.instagram_account ? errors.instagram_account : undefined} />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="facebook_account" className="flex items-center gap-2">
                          <TiSocialFacebook className="text-blue-800" /> Facebook
                        </Label>
                        <Input 
                          id="facebook_account" 
                          name="facebook_account" 
                          placeholder="https://facebook.com/username" 
                          value={formData?.facebook_account || ""} 
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={errors.facebook_account && touched.facebook_account ? 'border-red-500' : ''}
                        />
                        <ErrorMessage message={touched.facebook_account ? errors.facebook_account : undefined} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                    setTouched({});
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#7052FF] hover:bg-[#5a42cc] w-full sm:w-auto"
                >
                  {isSubmitting ? 'Creating...' : 'Create Profile'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const { first_name, last_name, bio, profile_picture, address, city, state, skills, resume } = profileData;
  const skillsArray = skills ? skills.split(',') : [];
  const fullName = `${first_name} ${last_name}`;
  const location = `${address ? address + ', ' : ''}${city ? city + ', ' : ''}${state || ''}`;
  const profileImageUrl = profileImagePreview || profile_picture;

  return (
    <div className="py-4">
      {/* Profile Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 py-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center bg-gray-100">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FiUser className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <h3 className="font-medium text-xl sm:text-2xl">{fullName}</h3>
            <button 
              onClick={openEditModal}
              className="text-gray-500 hover:text-gray-700 transition-colors self-center sm:self-auto"
              aria-label="Edit profile"
            >
              <FaPencilAlt size={16} />
            </button>
          </div>
          <p className="text-gray-600 text-sm sm:text-base mb-2">
            {bio}
          </p>
          <p className="text-gray-500 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1">
            <IoLocationSharp /> {location}
          </p>
        </div>
      </div>

      {/* Skills Section - Responsive */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
          {skillsArray.length > 0 ? (
            skillsArray.map((skill, index) => (
              <span key={index} className="font-medium rounded-full px-3 py-1 text-xs sm:text-sm border bg-gray-50">
                {skill.trim()}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No skills added yet</span>
          )}
        </div>
      </div>

      {/* Social Links Section - Responsive */}
      <div className="mb-6">
        <div className="flex justify-center sm:justify-start gap-4">
          {profileData.linkedin_account && (
            <a href={profileData.linkedin_account} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={28} className="text-blue-600 hover:text-blue-800 transition-colors" />
            </a>
          )}
          {profileData.twitter_account && (
            <a href={profileData.twitter_account} target="_blank" rel="noopener noreferrer">
              <TiSocialTwitter size={32} className="text-blue-400 hover:text-blue-600 transition-colors" />
            </a>
          )}
          {profileData.instagram_account && (
            <a href={profileData.instagram_account} target="_blank" rel="noopener noreferrer">
              <FaInstagramSquare size={28} className="text-pink-600 hover:text-pink-800 transition-colors" />
            </a>
          )}
          {profileData.facebook_account && (
            <a href={profileData.facebook_account} target="_blank" rel="noopener noreferrer">
              <TiSocialFacebook size={28} className="text-blue-800 hover:text-blue-900 transition-colors" />
            </a>
          )}
        </div>
      </div>

      {/* Action Buttons - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
        <div className="flex gap-3">
          <Button className="bg-[#7052FF] hover:bg-[#5a42cc] text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-auto">
            <ImUsers /> {followerCount || 0} Followers
          </Button>
          {connectionCount > 0 && (
            <Button className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-auto">
              <ImUsers /> {connectionCount} Connections
            </Button>
          )}
        </div>
        {resume && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <Button 
              onClick={downloadResume}
              className="bg-[#7052FF] hover:bg-[#5a42cc] text-white flex items-center gap-2"
            >
              <FaDownload size={14} />
              Download Resume
            </Button>
          </div>
        )}
        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-[#7052FF] hover:bg-[#5a42d4] text-white font-medium flex items-center gap-2 px-4 py-2 rounded w-full sm:w-auto"
        >
          <FaSignOutAlt size={14} />
          {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{profileData ? 'Edit Profile' : 'Create Your Profile'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.first_name && touched.first_name ? 'border-red-500' : ''}
                    required
                  />
                  <ErrorMessage message={touched.first_name ? errors.first_name : undefined} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="last_name" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.last_name && touched.last_name ? 'border-red-500' : ''}
                    required
                  />
                  <ErrorMessage message={touched.last_name ? errors.last_name : undefined} />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className={errors.bio && touched.bio ? 'border-red-500' : ''}
                />
                <ErrorMessage message={touched.bio ? errors.bio : undefined} />
                {formData.bio && (
                  <p className="text-xs text-gray-500">{formData.bio.length}/500 characters</p>
                )}
              </div>
              
              {/* Profile Picture Upload */}
              <div className="flex flex-col space-y-3">
                <Label>Profile Picture</Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div 
                    className={`w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed ${errors.profile_picture ? 'border-red-500' : 'border-gray-300'} flex items-center justify-center cursor-pointer hover:border-[#7052FF] transition-colors overflow-hidden`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {profileImagePreview ? (
                      <img 
                        src={profileImagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : profileData.profile_picture ? (
                      <img 
                        src={profileData.profile_picture} 
                        alt="Current Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaCamera className="text-gray-400 text-xl" />
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#7052FF] hover:underline font-medium"
                    >
                      Choose New Picture
                    </button>
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 400x400px, max 5MB
                    </p>
                    {profileImageFile && (
                      <p className="text-sm text-green-600 mt-1">
                        Selected: {profileImageFile.name}
                      </p>
                    )}
                  </div>
                </div>
                <ErrorMessage message={errors.profile_picture} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Resume Upload */}
              <div className="flex flex-col space-y-3">
                <Label>Resume</Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="bg-[#7052FF] hover:bg-[#5a42cc] text-white flex items-center gap-2"
                    >
                      <FaUpload size={14} />
                      {resume ? 'Update Resume' : 'Upload Resume'}
                    </Button>
                    {resume && (
                      <Button
                        type="button"
                        onClick={downloadResume}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <FaDownload size={14} />
                        Current Resume
                      </Button>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500">
                      PDF files only, max 10MB
                    </p>
                    {resumeFile && (
                      <p className="text-sm text-green-600 mt-1">
                        Selected: {resumeFile.name}
                      </p>
                    )}
                  </div>
                </div>
                <ErrorMessage message={errors.resume} />
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf"
                  className="hidden"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={errors.address && touched.address ? 'border-red-500' : ''}
                />
                <ErrorMessage message={touched.address ? errors.address : undefined} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.city && touched.city ? 'border-red-500' : ''}
                  />
                  <ErrorMessage message={touched.city ? errors.city : undefined} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.state && touched.state ? 'border-red-500' : ''}
                  />
                  <ErrorMessage message={touched.state ? errors.state : undefined} />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input 
                  id="skills" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="React, Node.js, JavaScript, Python..."
                  className={errors.skills && touched.skills ? 'border-red-500' : ''}
                />
                <ErrorMessage message={touched.skills ? errors.skills : undefined} />
              </div>

              {/* Social Links */}
              <div className="flex flex-col space-y-3">
                <Label>Social Links</Label>
                <p className="text-xs text-gray-500">URLs will be automatically formatted with https:// if missing</p>
                <div className="grid gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="linkedin_account" className="flex items-center gap-2">
                        <FaLinkedin className="text-blue-600" /> LinkedIn
                      </Label>
                      <Input 
                        id="linkedin_account" 
                        name="linkedin_account" 
                        placeholder="https://linkedin.com/in/username" 
                        value={formData.linkedin_account} 
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={errors.linkedin_account && touched.linkedin_account ? 'border-red-500' : ''}
                      />
                      <ErrorMessage message={touched.linkedin_account ? errors.linkedin_account : undefined} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="twitter_account" className="flex items-center gap-2">
                        <TiSocialTwitter className="text-blue-400" /> Twitter
                      </Label>
                      <Input 
                        id="twitter_account" 
                        name="twitter_account" 
                        placeholder="https://twitter.com/username" 
                        value={formData.twitter_account} 
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={errors.twitter_account && touched.twitter_account ? 'border-red-500' : ''}
                      />
                      <ErrorMessage message={touched.twitter_account ? errors.twitter_account : undefined} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="instagram_account" className="flex items-center gap-2">
                        <FaInstagramSquare className="text-pink-600" /> Instagram
                      </Label>
                      <Input 
                        id="instagram_account" 
                        name="instagram_account" 
                        placeholder="https://instagram.com/username" 
                        value={formData.instagram_account} 
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={errors.instagram_account && touched.instagram_account ? 'border-red-500' : ''}
                      />
                      <ErrorMessage message={touched.instagram_account ? errors.instagram_account : undefined} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="facebook_account" className="flex items-center gap-2">
                        <TiSocialFacebook className="text-blue-800" /> Facebook
                      </Label>
                      <Input 
                        id="facebook_account" 
                        name="facebook_account" 
                        placeholder="https://facebook.com/username" 
                        value={formData.facebook_account} 
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={errors.facebook_account && touched.facebook_account ? 'border-red-500' : ''}
                      />
                      <ErrorMessage message={touched.facebook_account ? errors.facebook_account : undefined} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  setTouched({});
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#7052FF] hover:bg-[#5a42cc] w-full sm:w-auto"
              >
                {isSubmitting ? 'Saving...' : (profileData ? 'Save Changes' : 'Create Profile')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileData;