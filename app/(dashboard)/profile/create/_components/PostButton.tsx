import Image from "next/image";
import Link from "next/link";
import React from "react";

const PostButton = () => {
    return (
        <div className="bg-white rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-4 w-full"> {/* Added w-full for better flex behavior */}
                <Image
                    src="https://randomuser.me/portraits/men/1.jpg"
                    alt="User"
                    width={48} // Increased size slightly for better tap target
                    height={48} // Increased size slightly for better tap target
                    className="rounded-full flex-shrink-0" // Prevent image from shrinking
                />
                <Link href="/create-post" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-[#7052FF] text-center text-sm md:text-base flex-grow">Create Post</Link> {/* Adjusted padding, added text-center and flex-grow */}

            </div>
        </div>
    );
};

export default PostButton;
