import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiUser } from "react-icons/fi";

const PostButton = () => {
  const { profileData } = useAuth();
  return (
    <div className="bg-white rounded-xl p-2 md:p-4 md:mb-4">
      <div className="flex items-center gap-3 w-full">
        {" "}
        {/* Added w-full for better flex behavior */}
        <Link href="/profile">
          {profileData?.profile_picture ? (
            <Image
              src={profileData.profile_picture}
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full h-10 object-cover"
            />
          ) : (
            <div className="rounded-full bg-gray-200 flex items-center justify-center md:w-10 md:h-10 w-8 h-8">
              <FiUser className="text-gray-600 md:w-5 md:h-5 w-4 h-4" />
            </div>
          )}
        </Link>
        <Link
          href="/create-post"
          className="w-full bg-gray-100 rounded-lg px-4 py-3 text-[#7052FF] text-center text-sm md:text-base flex-grow"
        >
          Create Post
        </Link>{" "}
        {/* Adjusted padding, added text-center and flex-grow */}
      </div>
    </div>
  );
};

export default PostButton;
