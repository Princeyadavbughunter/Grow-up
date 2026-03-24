// @ts-nocheck
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const PostButton = () => {
  const { profileData } = useAuth();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 mb-4">
      <Link href="/create-post" className="flex items-center gap-4 group">
        {/* Avatar — large with purple ring */}
        <div className="flex-shrink-0">
          {profileData?.profile_picture ? (
            <Image
              src={profileData.profile_picture}
              alt="Profile"
              width={52}
              height={52}
              className="rounded-full w-[52px] h-[52px] object-cover ring-2 ring-[#7052FF]/30"
            />
          ) : (
            <div className="w-[52px] h-[52px] rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-[#7052FF]/20">
              <FiUser className="text-gray-400 w-6 h-6" />
            </div>
          )}
        </div>

        {/* "Create post...." in purple */}
        <span className="text-[#7052FF] text-base font-medium group-hover:opacity-80 transition-opacity">
          Create post....
        </span>
      </Link>
    </div>
  );
};

export default PostButton;

