import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PostButton = () => {
    const { profileData } = useAuth()
    return (
        <div className="bg-white rounded-xl p-2 md:p-4 md:mb-4">
            <div className="flex items-center gap-3 w-full"> {/* Added w-full for better flex behavior */}
                <Image
                    src={profileData?.profile_picture || ""}
                    alt="User"
                    width={48}
                    height={48}
                    className="rounded-full flex-shrink-0"
                />
                <Link href="/create-post" className="w-full bg-gray-100 rounded-lg px-4 py-3 text-[#7052FF] text-center text-sm md:text-base flex-grow">Create Post</Link> {/* Adjusted padding, added text-center and flex-grow */}

            </div>
        </div>
    );
};

export default PostButton;
