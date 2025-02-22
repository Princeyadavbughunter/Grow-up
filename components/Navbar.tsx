'use client'
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';
import { Button } from './ui/button';
import { LuPlus } from 'react-icons/lu';


const NavBar: React.FC = () => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="GrowUp Buddy" width={40} height={40} />
          <span className="text-xl font-semibold">GrowUp Buddy</span>
        </div>
        <div className="flex items-center gap-4">
          <Button className='border bg-white hover:bg-[#7052FF] hover:text-white border-[#7052FF] text-[#7052FF] px-4 py-1' >
            <LuPlus />
            Post gig
          </Button>
          <span className="text-gray-600"><FiSearch size={30} /></span>
          <Image
            src="https://randomuser.me/portraits/men/5.jpg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>

    </div>
  );
};

export default NavBar;