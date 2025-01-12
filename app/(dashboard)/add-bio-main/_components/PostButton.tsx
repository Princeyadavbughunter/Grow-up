import Image from "next/image";
import Link from "next/link";
import React from "react";

const PostButton = () => {
    return (
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <Image
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <Link href="/create-post" className="w-full bg-gray-100 rounded-lg px-4 py-2 h-10 text-[#7052FF]">Create Post</Link>

            </div>
        </div>
    );
};

export default PostButton;
