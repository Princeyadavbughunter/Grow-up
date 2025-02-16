'use client';
import { useRouter } from "next/navigation";
import { FaImage, FaLink, FaPoll } from "react-icons/fa"; // React Icons import

const CreatePost = () => {
    const router = useRouter();

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md pb-40">
            <div className="flex items-center space-x-9">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 flex items-center gap-2 mb-4 hover:text-black"
                >
                    <span className="text-lg">←</span>
                </button>

                <h1 className="text-gray-700 font-medium mb-4">
                    Posting to: <span className="bg-green-100 text-green-600 px-2 py-1 rounded">Tech</span>
                </h1>
            </div>

            <form className="space-y-4">
                <div>
                    <label className="block text-black  font-semibold mb-2">Post Title</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="How this Happen? |"
                        maxLength={160}
                    />
                    <div className="text-sm text-gray-400 mt-1">0/160</div>
                </div>

                <div>
                    <label className="block text-black  font-semibold mb-2">
                        Share Your Thoughts <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="How this Happen? |"
                        rows="4"
                        maxLength={7860}
                    ></textarea>
                    <div className="text-sm text-gray-400 mt-1">0/7860</div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Add Image */}
                    <label className="flex items-center gap-2 text-gray-500 hover:text-purple-500 cursor-pointer">
                        <FaImage size={20} />
                        <span>Add Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                    </label>

                    {/* Add Link */}
                    <label className="flex items-center gap-2 text-gray-500 hover:text-purple-500 cursor-pointer">
                        <FaLink size={20} />
                        <span>Link</span>
                        <input
                            type="url"
                            placeholder="Paste your link here"
                            className="hidden"
                        />
                    </label>

                    {/* Add Poll */}
                    <button
                        type="button"
                        className="flex items-center gap-2 text-gray-500 hover:text-purple-500"
                    >
                        <FaPoll size={20} />
                        <span>Poll</span>
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-purple-500 text-white font-bold py-2 rounded-lg hover:bg-purple-600"
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
