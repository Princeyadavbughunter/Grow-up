'use client';

import React from 'react';
import { Globe, Users, Network, Calendar, Layout, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const routes = [
  { path: '/explore', icon: Globe, label: 'Explore' },
  { path: '/gigs', icon: Users, label: 'Gigs' },
  { path: '/network', icon: Network, label: 'Network' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/clubs', icon: Users, label: 'Clubs' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/pages', icon: Layout, label: 'Pages' }
];

const BottomNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around px-2 py-4 md:p-4 w-full md:w-[50%] mx-auto">
        {routes.map(({ path, icon: Icon, label }) => (
          <NavItem
            key={path}
            href={path}
            icon={<Icon size={20} />}
            label={label}
            active={pathname === path || (path !== '/' && pathname.startsWith(path))}
          />
        ))}
      </div>
    </nav>
  );
};

const NavItem = ({ 
  href, 
  icon, 
  label, 
  active 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
}) => (
  <Link
    href={href}
    className={`flex flex-col items-center gap-1 p-1 md:p-2 rounded-lg transition-colors min-w-[50px] w-[50px] md:min-w-[60px] md:w-[60px]
      ${active 
        ? 'text-[#7052FF] bg-[#7052FF]/10' 
        : 'text-gray-500 hover:text-[#7052FF] hover:bg-[#7052FF]/10'
      }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

export default BottomNavbar;