// @ts-nocheck
'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Globe,
  BriefcaseBusiness,
  Users2,
  Calendar,
  UsersRound,
  Bookmark,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';

const ExploreIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2A15.3 15.3 0 0 1 17 12a15.3 15.3 0 0 1-5 10 15.3 15.3 0 0 1-5-10 15.3 15.3 0 0 1 5-10z" />
    <path d="M2.5 8h19" />
    <path d="M2 12h20" />
    <path d="M2.5 16h19" />
  </svg>
);

const GigsIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="8" y="9" width="13" height="13" rx="2" />
    <path d="M8 13h13" />
    <path d="M4 16V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
    <path d="M4 7h12" />
  </svg>
);

const NetworkIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="9" r="2" />
    <path d="M7 9a5 5 0 1 1 10 0" />
    <path d="M4 9a8 8 0 1 1 16 0" />
    <path d="M12 11v11" />
    <path d="M9 22h6" />
  </svg>
);

const EventsIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M4 10h16" />
    <path d="M8 14h8" />
    <path d="M8 18h5" />
  </svg>
);

const ClubsIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Background users */}
    <path d="M16 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M9 15.13A4 4 0 0 0 6 19v2" />
    <circle cx="17" cy="7" r="3" />
    <circle cx="7" cy="7" r="3" />
    {/* Foreground user */}
    <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="#fff" />
    <path d="M8 21v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1" fill="#fff" />
    <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path d="M8 21v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1" />
  </svg>
);

const PagesIcon = ({ size, strokeWidth, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 22V2l14 7-14 7" />
  </svg>
);

const navItems = [
  { label: 'Explore', href: '/explore', icon: ExploreIcon },
  { label: 'Gigs', href: '/gigs', icon: GigsIcon },
  { label: 'Network', href: '/network', icon: NetworkIcon },
  { label: 'Events', href: '/events', icon: EventsIcon },
  { label: 'Clubs', href: '/clubs', icon: ClubsIcon },
  { label: 'Pages', href: '/pages', icon: PagesIcon },
];

const BottomNavbar = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-between h-[68px] max-w-[480px] mx-auto px-4 md:px-6">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-[#7052FF]' : 'text-[#6A737D] hover:text-[#4B5563]'
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? 'text-[#7052FF]' : 'text-[#6A737D]'}
                />
                <span className={`text-[12px] font-medium leading-none ${isActive ? 'text-[#7052FF]' : 'text-[#6A737D]'}`}>
                  {label}
                </span>
                {/* The purple underline specific to the image logic */}
                {isActive && label === 'Explore' && (
                  <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#7052FF]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Messages Button — Attached to bottom right */}
      <Link
        href="/chat"
        className="fixed bottom-0 right-[15%] z-50 flex items-center justify-between gap-6 bg-[#7052FF] text-white px-5 py-4 rounded-t-[12px] w-56 border-t-[3px] border-[#3B82F6] hover:bg-[#5a42d4] transition-colors shadow-[0_-4px_15px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Custom Envelope SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span className="absolute -top-1.5 -right-1 bg-[#65A30D] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none z-10">
              3
            </span>
          </div>
          <span className="text-[15px] font-medium tracking-wide">Messages</span>
        </div>
        <ChevronDown size={18} strokeWidth={2} className="text-white/80 transition-transform duration-200 cursor-pointer" />
      </Link>
    </>
  );
};

export default BottomNavbar;