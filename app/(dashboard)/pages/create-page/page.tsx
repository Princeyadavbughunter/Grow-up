// @ts-nocheck
"use client";
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, MapPin, Plus, Image } from 'lucide-react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  pageName: z.string().min(1, 'Page name is required'),
  category: z.string().min(1, 'Category is required'),
  website: z.string().url('Please enter a valid URL'),
  about: z.string().min(10, 'About section must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
});

type FormData = z.infer<typeof formSchema>;

const CreatePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageName: '',
      category: '',
      website: 'https://',
      about: '',
      location: '',
    },
  });

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: FormData) => {
    if (!authToken) {
      toast("Error", {
        description: "You must be logged in to create a page",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append('name', data.pageName);
      formData.append('description', data.about);
      formData.append('is_active', true);
      formData.append('category', data.category);
      formData.append('website', data.website);
      formData.append('location', data.location);
      
      if (profileImage) {
        formData.append('profile_picture', profileImage);
      }
      
      if (coverPhoto) {
        formData.append('cover_photo', coverPhoto);
      }

      // Use axios directly with specific config for multipart/form-data
      await api.post('/post/app/page/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast('Success', {
        description: "Page created successfully",
      });

      form.reset();
      setProfileImage(null);
      setCoverPhoto(null);
      setProfilePreview(null);
      setCoverPreview(null);
      router.push('/pages');
    } catch (error) {
      console.error('Error creating page:', error);
      toast("Error", {
        description: "Failed to create page. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg h-[calc(100vh-12rem)] overflow-y-auto mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Create Page</h1>
      
      <div className="mb-8">
        {/* Cover Photo Upload */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Cover Photo</p>
          <div 
            className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors relative overflow-hidden"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img 
                src={coverPreview} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center">
                <Image className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload cover photo</span>
              </div>
            )}
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverPhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Profile Image Upload */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => profileInputRef.current?.click()}
            >
              {profilePreview ? (
                <img 
                  src={profilePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              ref={profileInputRef}
              onChange={handleProfileImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              onClick={() => profileInputRef.current?.click()}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="pageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Page name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter your page name"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Category</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g. Startup, Restaurant, Education"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Website</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="url" 
                    placeholder="https://yourwebsite.com"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">About</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write about your organization to help people understand what you do"
                    rows={4}
                    className="w-full resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      placeholder="Current location" 
                      className="pl-9 w-full"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full py-2 mb-32 bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Page"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePage;