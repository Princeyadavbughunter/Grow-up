import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedin, FaInstagramSquare, FaPencilAlt } from "react-icons/fa";
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
  github_account: string | null;
  dribble_account: string | null;
  figma_account: string | null;
  youtube_account: string | null;
  medium_account: string | null;
}

interface ProfileDataProps {
  profileData?: ProfileData | null;
}

const ProfileDataEditable: React.FC<ProfileDataProps> = ({ profileData }) => {
  const { apiCaller, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(!profileData);
  const [formData, setFormData] = useState({
    first_name: profileData?.first_name || "",
    last_name: profileData?.last_name || "",
    bio: profileData?.bio || "",
    address: profileData?.address || "",
    city: profileData?.city || "",
    state: profileData?.state || "",
    skills: profileData?.skills || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultData = {
    first_name: "",
    last_name: "",
    bio: "",
    profile_picture: "",
    address: "",
    city: "",
    state: "",
    skills: "",
    follower_count: 0,
    github_account: null,
    dribble_account: null,
    figma_account: null,
    youtube_account: null,
    medium_account: null,
  };

  const currentData = profileData || defaultData;
  const { first_name, last_name, bio, profile_picture, address, city, state, skills, follower_count } = currentData;
  const skillsArray = skills ? skills.split(',') : [];
  const fullName = `${first_name} ${last_name}`;
  const location = `${address ? address + ', ' : ''}${city ? city + ', ' : ''}${state || ''}`;
  const profileImageUrl = profile_picture || "https://via.placeholder.com/80";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (profileData?.id) {
        await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, formData);
      } else {
        await apiCaller.post('/freelancer/freelancer-profile/', formData);
      }
      await refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = () => {
    setFormData({
      first_name: currentData.first_name || "",
      last_name: currentData.last_name || "",
      bio: currentData.bio || "",
      address: currentData.address || "",
      city: currentData.city || "",
      state: currentData.state || "",
      skills: currentData.skills || "",
    });
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
              <HiDotsVertical className="text-gray-500" />
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
            <FaLinkedin size={32} />
            <TiSocialTwitter size={32} />
            <FaInstagramSquare size={32} />
            <TiSocialFacebook size={32} />
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
        <DialogContent className="sm:max-w-md">
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