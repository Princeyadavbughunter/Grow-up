// @ts-nocheck
'use client';
import { useState, ChangeEvent, FormEvent, JSX, useEffect } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { FaBackward, FaImage, FaLink, FaPoll } from "react-icons/fa";
import { IoArrowBack } from 'react-icons/io5';
import { Page } from '@/types';
import { validateMultipleImages, checkImageProcessingSupport, DEFAULT_POST_IMAGE_OPTIONS } from '@/lib/image-validation';
import { toast } from 'sonner';
import { sanitizeFileName } from '@/lib/utils';

interface PostResponse {
    id: string;
    images: {
        id: string;
        file: string;
        author: string;
        uploaded_at: string;
    }[];
    videos: any[];
    profile_picture: string | null;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    company_logo: string | null;
    role: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_take_down: boolean;
    like_count: number;
    comment_count: number;
    author: string;
    club: string;
}

interface Club {
    id: string;
    name: string;
    description: string;
    created_at: string;
    created_by: string;
    members: string[];
}

const CreatePost = (): JSX.Element => {
    const router = useRouter();
    const { api } = useAuthenticatedApi();
    const params = useParams();
    const clubId = params.clubId as string;
    const { authToken } = useAuth()

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [link, setLink] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [clubName, setClubName] = useState<string>('');
    const [postingType, setPostingType] = useState<'self' | 'page'>('self');
    const [selectedPage, setSelectedPage] = useState<string>('');
    const [userPages, setUserPages] = useState<Page[]>([]);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editPostId, setEditPostId] = useState<string>('');
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [imageValidationErrors, setImageValidationErrors] = useState<string[]>([]);
    const [isValidatingImages, setIsValidatingImages] = useState<boolean>(false);


    useEffect(() => {
        // Check if we're in edit mode
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        
        if (editId) {
            setIsEditMode(true);
            setEditPostId(editId);
        }
    }, []);

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await api.get(`/freelancer/joined-clubs/`);
                const clubs: Club[] = response.data;
                const club = clubs.find(c => c.id === clubId);

                if (club) {
                    setClubName(club.name);
                }
            } catch (error) {
                console.error('Error fetching club details:', error);
            }
        };

        if (clubId && authToken) {
            fetchClubDetails();
        }
    }, [clubId, authToken]);

    // Fetch post data if in edit mode
    useEffect(() => {
        const fetchPostData = async () => {
            if (!isEditMode || !editPostId) return;
            
            try {
                const response = await api.get(`/post/app/post-chat-details/?id=${editPostId}`);
                const postData = response.data.response?.[0] || response.data;
                
                if (postData) {
                    setTitle(postData.title || '');
                    setContent(postData.content || '');
                    setLink(postData.link || '');
                    setExistingImages(postData.images || []);
                    
                    // Set posting type based on whether it's a page post
                    if (postData.page_id) {
                        setPostingType('page');
                        setSelectedPage(postData.page_id);
                    }
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        if (isEditMode && editPostId && authToken) {
            fetchPostData();
        }
    }, [isEditMode, editPostId, authToken]);

    useEffect(() => {
        const fetchUserPages = async () => {
            try {
                const response = await api.get('/post/app/own-created-pages/');
                setUserPages(response.data.pages || []);
            } catch (error) {
                console.error('Error fetching user pages:', error);
            }
        };

        if (authToken) {
            fetchUserPages();
        }
    }, [authToken]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            // Check browser support
            if (!checkImageProcessingSupport()) {
                toast.error('Your browser does not support image processing features. Please update your browser.');
                return;
            }

            // Clear previous errors
            setImageValidationErrors([]);
            setIsValidatingImages(true);

            try {
                const { validFiles, errors } = await validateMultipleImages(files, DEFAULT_POST_IMAGE_OPTIONS);

                if (errors.length > 0) {
                    setImageValidationErrors(errors);
                    // Show first error as toast
                    toast.error(errors[0]);
                }

                if (validFiles.length > 0) {
                    setImages(validFiles);
                    toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} processed successfully`);
                } else {
                    // Clear the input if no valid files
                    e.target.value = '';
                }
            } catch (error) {
                console.error('Image validation error:', error);
                toast.error('Failed to process images. Please try again.');
                // Clear the input on error
                e.target.value = '';
            } finally {
                setIsValidatingImages(false);
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let response;

            if (isEditMode) {
                // Update existing post
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                
                if (link) {
                    formData.append('link', link);
                }

                // Only append new images if any were selected
                images.forEach((image) => {
                    formData.append('images', image);
                });

                response = await api.patch(`/post/app/posts/?id=${editPostId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } else if (postingType === 'page') {
                // Post from a page
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                formData.append('page', selectedPage);
                formData.append('club_ids', clubId);
                formData.append('is_take_down', false);

                images.forEach((image) => {
                    formData.append('images', image);
                });

                response = await api.post('/post/app/page-posts/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } else {
                // Post from self (club post)
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                formData.append('club', clubId);
                formData.append('is_take_down', false);

                images.forEach((image) => {
                    formData.append('images', image);
                });

                if (link) {
                    formData.append('link', link);
                }

                response = await api.post<PostResponse>('/post/app/post-creation/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                router.push('/');
            }
        } catch (error) {
            console.error(isEditMode ? 'Error updating post:' : 'Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg h-[calc(100vh-10rem)] overflow-auto mx-auto mt-10 bg-white p-6 rounded-lg shadow-md pb-40">
            <div className="flex items-center space-x-9">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 flex items-center gap-2 mb-4 hover:text-black"
                >
                    <span className="text-lg"><IoArrowBack /></span>
                </button>

                <h1 className="text-gray-700 font-medium mb-4">
                    {isEditMode ? 'Editing Post' : 'Posting to:'} {!isEditMode && <span className="bg-green-100 text-green-600 px-2 py-1 rounded">{clubName || 'Loading...'}</span>}
                </h1>
            </div>

            {/* Posting Type Selector - Hide in edit mode */}
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-black font-semibold mb-2">Post As</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="self"
                                checked={postingType === 'self'}
                                onChange={(e) => setPostingType(e.target.value as 'self' | 'page')}
                                className="w-4 h-4 text-purple-600"
                            />
                            <span className="text-gray-700">Self</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="page"
                                checked={postingType === 'page'}
                                onChange={(e) => setPostingType(e.target.value as 'self' | 'page')}
                                className="w-4 h-4 text-purple-600"
                            />
                            <span className="text-gray-700">Page</span>
                        </label>
                    </div>
                </div>
            )}

            {/* Page Selection (only show when posting from page and not in edit mode) */}
            {postingType === 'page' && !isEditMode && (
                <div className="mb-4">
                    <label className="block text-black font-semibold mb-2">Select Page</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        required={postingType === 'page'}
                    >
                        <option value="">Select a page...</option>
                        {userPages.map((page) => (
                            <option key={page.id} value={page.id}>
                                {page.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-black font-semibold mb-2">Post Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="How this Happen? |"
                        maxLength={160}
                    />
                    <div className="text-sm text-gray-400 mt-1">{title.length}/160</div>
                </div>

                <div>
                    <label className="block text-black font-semibold mb-2">
                        Share Your Thoughts <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="How this Happen? |"
                        rows={4}
                        maxLength={7860}
                    ></textarea>
                    <div className="text-sm text-gray-400 mt-1">{content.length}/7860</div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className={`flex items-center gap-2 cursor-pointer ${
                        isValidatingImages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-500 hover:text-purple-500'
                    }`}>
                        <FaImage size={20} />
                        <span>{isValidatingImages ? 'Processing Images...' : 'Add Image'}</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={isValidatingImages}
                        />
                    </label>

                    {/* Validation Errors */}
                    {imageValidationErrors.length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-800 mb-2">Image Validation Errors:</p>
                            <ul className="text-sm text-red-700 space-y-1">
                                {imageValidationErrors.map((error, index) => (
                                    <li key={index}>• {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Show existing images in edit mode */}
                    {isEditMode && existingImages.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                            <div className="flex gap-2 flex-wrap">
                                {existingImages.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image.file}
                                            alt={`Existing ${index}`}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isValidatingImages && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <p className="text-sm text-blue-800">Processing and validating images...</p>
                            </div>
                        </div>
                    )}

                    {images.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Selected Images ({images.length}):
                                <span className="text-xs text-green-600 ml-1">✓ Validated and sanitized</span>
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {images.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index}`}
                                            className="w-20 h-20 object-cover rounded border-2 border-green-200"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded flex items-center justify-center">
                                            <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                                                {sanitizeFileName(file.name, 12)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <label className="flex items-center gap-2 text-gray-500 hover:text-purple-500 cursor-pointer">
                        <FaLink size={20} />
                        <span>Link</span>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Paste your link here"
                            className="ml-2 flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isValidatingImages || !title || (!isEditMode && postingType === 'page' && !selectedPage)}
                    className="w-full bg-purple-500 text-white font-bold py-2 rounded-lg hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (isEditMode ? 'Updating...' : 'Posting...') :
                     isValidatingImages ? 'Processing Images...' :
                     (isEditMode ? 'Update Post' : 'Post')}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;