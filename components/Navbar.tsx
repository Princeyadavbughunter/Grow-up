'use client'
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LuPlus } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { profileData } = useAuth();

  const buttonConfig: Record<string, { label: string; route: string }> = {
    '/pages': { label: 'Create Pages', route: '/pages/create-page' },
    '/clubs': { label: 'Create Clubs', route: '/clubs/create' },
    '/gigs': { label: 'Post Gigs', route: '/gigs/post-gig' },
  };

  const buttonInfo = buttonConfig[pathname];

  const handleCreateClick = () => {
    if (buttonInfo) {
      router.push(buttonInfo.route);
    }
  };

  const profilePicture = profileData?.profile_picture || 'https://randomuser.me/portraits/men/5.jpg';

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="GrowUp Buddy" width={40} height={40} />
          <span className="text-xl font-semibold">GrowUp Buddy</span>
        </div>
        <div className="flex items-center gap-4">
          {buttonInfo && (
            <Button 
              onClick={handleCreateClick}
              className="border bg-white hover:bg-[#7052FF] hover:text-white border-[#7052FF] text-[#7052FF] px-4 py-1"
            >
              <LuPlus className="mr-2" />
              {buttonInfo.label}
            </Button>
          )}
          <Link href='/profile' >
          <Image
            src={profilePicture}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;