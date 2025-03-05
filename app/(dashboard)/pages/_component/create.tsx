"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Plus } from 'lucide-react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const formSchema = z.object({
  pageName: z.string().min(1, 'Page name is required'),
  category: z.string().min(1, 'Category is required'),
  website: z.string().url('Please enter a valid URL'),
  about: z.string().min(10, 'About section must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreatePageModalProps {
  open: boolean;
  onClose: () => void;
}

const CreatePageModal: React.FC<CreatePageModalProps> = ({ open, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { api } = useAuthenticatedApi();
  const { authToken } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageName: '',
      category: '',
      website: '',
      about: '',
      location: '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (!authToken) {
      toast("Error", {
        description: "You must be logged in to create a page",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/post/app/page/', {
        name: data.pageName,
        description: data.about,
        is_active: true,
        category: data.category,
        website: data.website,
        location: data.location,
        cover_photo: null,
        profile_picture: null
      });

      toast('Success', {
        description: "Page created successfully",
      });

      form.reset();
      onClose();
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Startup" />
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
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" />
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
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write about your organization to let people understand what you do"
                      rows={4}
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Current location" />
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-purple-600 p-0 h-auto font-normal"
                  >
                    <div className="w-4 h-4 rounded-full border border-purple-600 flex items-center justify-center mr-2">
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                    </div>
                    Auto-detect my city
                  </Button>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageModal;