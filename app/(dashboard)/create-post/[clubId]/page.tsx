'use client';
import { useState, ChangeEvent, FormEvent, JSX, useEffect } from 'react';
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { FaBackward, FaImage, FaLink, FaPoll } from "react-icons/fa";
import { IoArrowBack } from 'react-icons/io5';

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

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(files);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
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

            const response = await api.post<PostResponse>('/post/app/post-creation/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200 || response.status === 201) {
                router.push('/');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md pb-40">
            <div className="flex items-center space-x-9">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 flex items-center gap-2 mb-4 hover:text-black"
                >
                    <span className="text-lg"><IoArrowBack /></span>
                </button>

                <h1 className="text-gray-700 font-medium mb-4">
                    Posting to: <span className="bg-green-100 text-green-600 px-2 py-1 rounded">{clubName || 'Loading...'}</span>
                </h1>
            </div>

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
                    <label className="flex items-center gap-2 text-gray-500 hover:text-purple-500 cursor-pointer">
                        <FaImage size={20} />
                        <span>Add Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>

                    {images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {images.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                </div>
                            ))}
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
                    disabled={isSubmitting || !title}
                    className="w-full bg-purple-500 text-white font-bold py-2 rounded-lg hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;