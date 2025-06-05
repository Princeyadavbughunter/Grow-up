import React, { useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedin, FaInstagramSquare, FaPencilAlt, FaCamera } from "react-icons/fa";
import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { Button } from "@/components/ui/button";
import { ImUsers } from "react-icons/im";
import { FaMessage } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  id?: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_picture: string;
  address: string;
  city: string;
  state: string;
  skills: string;
  follower_count: number;
}

interface ProfileDataProps {
  profileData?: ProfileData | null;
}

const ProfileDataEditable: React.FC<ProfileDataProps> = ({ profileData }) => {
  const { apiCaller, refreshProfile } = useAuth();
  
  const defaultFormData: ProfileData = {
    id: profileData?.id || undefined,
    first_name: profileData?.first_name || "",
    last_name: profileData?.last_name || "",
    bio: profileData?.bio || "",
    profile_picture: profileData?.profile_picture || "",
    address: profileData?.address || "",
    city: profileData?.city || "",
    state: profileData?.state || "",
    skills: profileData?.skills || "",
    follower_count: profileData?.follower_count || 0,
  };

  const [isEditing, setIsEditing] = useState<boolean>(!!profileData ? false : true);  // Initialize properly
  const [formData, setFormData] = useState<ProfileData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simplified social links state
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  const currentData = profileData || {
    id: undefined,
    first_name: "",
    last_name: "",
    bio: "",
    profile_picture: "",
    address: "",
    city: "",
    state: "",
    skills: "",
    follower_count: 0,
  };

  const { first_name, last_name, bio, profile_picture, address, city, state, skills, follower_count } = currentData;
  const skillsArray = skills ? skills.split(',') : [];
  const fullName = `${first_name} ${last_name}`;
  const location = `${address ? address + ', ' : ''}${city ? city + ', ' : ''}${state || ''}`;
  const profileImageUrl = profileImagePreview || profile_picture || "https://via.placeholder.com/80";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData(prev => ({ ...prev, [name]: value as keyof ProfileData }));
    }
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (profileImageFile && formData) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('first_name', formData.first_name);
        formDataWithFile.append('last_name', formData.last_name);
        formDataWithFile.append('bio', formData.bio);
        formDataWithFile.append('address', formData.address);
        formDataWithFile.append('city', formData.city);
        formDataWithFile.append('state', formData.state);
        formDataWithFile.append('skills', formData.skills);
        formDataWithFile.append('profile_picture', profileImageFile);
        formDataWithFile.append('linkedin', socialLinks.linkedin || '');
        formDataWithFile.append('twitter', socialLinks.twitter || '');
        formDataWithFile.append('instagram', socialLinks.instagram || '');
        formDataWithFile.append('facebook', socialLinks.facebook || '');

        if (profileData?.id) {
          await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, formDataWithFile, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          await apiCaller.post('/freelancer/freelancer-profile/', formDataWithFile, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      } else if (formData) {
        const payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          skills: formData.skills,
          linkedin: socialLinks.linkedin || null,
          twitter: socialLinks.twitter || null,
          instagram: socialLinks.instagram || null,
          facebook: socialLinks.facebook || null,
        };

        if (profileData?.id) {
          await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, payload);
        } else {
          await apiCaller.post('/freelancer/freelancer-profile/', payload);
        }
      }
      
      await refreshProfile();
      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = () => {
    setFormData(defaultFormData);  // Reset with default to avoid undefined
    setSocialLinks({
      linkedin: "",
      twitter: "",
      instagram: "",
      facebook: "",
    });
    setProfileImagePreview(null);
    setProfileImageFile(null);
    setIsEditing(true);
  };

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center gap-5 py-6">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full border border-gray-300"
        />
        <div className="flex-1">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-10">
            <h3 className="font-medium text-lg sm:text-xl">{fullName || "New Profile"}</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={openEditModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Edit profile"
              >
                <FaPencilAlt />
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            {bio || ""}
          </p>
          <p className="text-gray-500 text-sm sm:text-base flex items-center gap-1">
            <IoLocationSharp /> {location || ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex-1 text-center sm:text-left">
          <div>
            <p className="flex flex-wrap gap-2 font-semibold">
              {skillsArray.length > 0 ? (
                skillsArray.map((skill, index) => (
                  <button key={index} className="font-medium rounded-full px-3 py-1 text-xs sm:text-sm border">
                    {skill.trim()}
                  </button>
                ))
              ) : null}
            </p>
          </div>

          <div className="text-[#979797] flex justify-center sm:justify-start gap-4 py-5">
            {currentData.linkedin && (
              <FaLinkedin size={32} className="text-blue-600" />
            )}
            {currentData.twitter && (
              <TiSocialTwitter size={32} className="text-blue-400" />
            )}
            {currentData.instagram && (
              <FaInstagramSquare size={32} className="text-pink-600" />
            )}
            {currentData.facebook && (
              <TiSocialFacebook size={32} className="text-blue-800" />
            )}
          </div>

          <div>
            <p className="flex flex-wrap gap-2 font-semibold">
              <Button className="bg-[#7052FF] text-white font-medium flex items-center gap-1 px-4 py-2 rounded">
                <ImUsers /> {follower_count || 0}k Followers
              </Button>
              <Button className="bg-white font-medium border border-[#7052FF] text-[#7052FF] flex items-center gap-1 px-4 py-2 rounded">
                <FaMessage /> Open Inbox
              </Button>
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{profileData ? "Edit Profile" : "Create Profile"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input 
                    id="last_name" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              {/* Profile Picture Upload Section */}
              <div className="flex flex-col space-y-3">
                <Label>Profile Picture</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#7052FF] transition-colors overflow-hidden"
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
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#7052FF] hover:underline font-medium"
                      >
                        Choose File
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input 
                  id="skills" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleInputChange}
                />
              </div>

              {/* Social Links Section */}
              <div className="flex flex-col space-y-3">
                <Label>Social Links</Label>
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <FaLinkedin className="text-blue-600" /> LinkedIn
                      </Label>
                      <Input id="linkedin" name="linkedin" placeholder="LinkedIn URL" value={socialLinks.linkedin} onChange={handleSocialLinkChange} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <TiSocialTwitter className="text-blue-400" /> Twitter
                      </Label>
                      <Input id="twitter" name="twitter" placeholder="Twitter URL" value={socialLinks.twitter} onChange={handleSocialLinkChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <FaInstagramSquare className="text-pink-600" /> Instagram
                      </Label>
                      <Input id="instagram" name="instagram" placeholder="Instagram URL" value={socialLinks.instagram} onChange={handleSocialLinkChange} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <TiSocialFacebook className="text-blue-800" /> Facebook
                      </Label>
                      <Input id="facebook" name="facebook" placeholder="Facebook URL" value={socialLinks.facebook} onChange={handleSocialLinkChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              {profileData && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#7052FF]"
              >
                {isSubmitting ? 'Saving...' : profileData ? 'Save Changes' : 'Create Profile'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDataEditable;