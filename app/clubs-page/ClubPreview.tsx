// @ts-nocheck
'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Club {
  id: string;
  name: string;
  description: string;
  participants_count: number;
  is_user_member?: boolean;
  created_at?: string;
  created_by?: string;
  chat_room_id?: string;
  members?: string[];
}

interface ClubCardProps {
  club: Club;
  index: number;
}

const ClubCard = ({ club, index }: ClubCardProps) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get category from club name or description
  const getCategory = (clubName: string) => {
    const name = clubName.toLowerCase();
    if (name.includes('marketing') || name.includes('growth')) return 'Business';
    if (name.includes('finance')) return 'Finance';
    if (name.includes('web3') || name.includes('javascript') || name.includes('coders')) return 'Technology';
    if (name.includes('design') || name.includes('designers')) return 'Design';
    if (name.includes('memes')) return 'Fun';
    return 'Community';
  };

  return (
    <motion.div
      key={club.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 border-2 border-[#7052FF]/10 hover:border-[#7052FF]/30 hover:shadow-lg transition-all duration-300 group"
    >
      {/* Club Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-[#4A4A4A] group-hover:text-[#7052FF] transition-colors">
            {club.name}
          </h3>
          <span className="text-xs font-medium text-[#696C78] bg-gray-100 px-2 py-1 rounded-full">
            {getCategory(club.name)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#696C78] mb-3">
          <span>{(club.participants_count || 0).toLocaleString()} members</span>
        </div>
      </div>

      {/* Club Description */}
      <div className="text-[#696C78] text-sm leading-relaxed mb-6">
        <p className={`${isExpanded ? '' : 'line-clamp-2 overflow-hidden'} text-sm`}>
          {club.description}
        </p>
        {club.description && club.description.length > 100 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="text-[#7052FF] hover:text-[#5a42d1] font-medium mt-1 text-sm"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Join Button */}
      <button
        onClick={() => router.push(`/clubs/${club.id}`)}
        className="w-full py-3 px-4 rounded-xl font-medium text-[#7052FF] border-2 border-[#7052FF]/20 hover:bg-[#7052FF] hover:text-white transition-all duration-300"
      >
        View Community
      </button>
    </motion.div>
  );
};

const ClubPreview = () => {
  const router = useRouter()

  // Static data based on the real API response you provided
  const clubs: Club[] = [
    {
      id: "3047a9cb-8561-4e3f-9736-b3250939e2dc",
      name: "Coders Club",
      description: "👥 *Who should join*\n\n* Developers, programmers, and engineers (frontend, backend, full-stack).\n* Students learning coding, open-source contributors, AI/ML enthusiasts.\n* Anyone building apps, APIs, websites, or new tech.\n\n📌 *What to Post*\n\n* Share code snippets, debugging help, tutorials.\n* Showcase projects (apps, APIs, ML models, games).\n* Share useful GitHub repos, blogs, and resources.\n* Post collaboration invites (hackathons, open-source).\n* Hiring posts → internships, freelance, full-time roles.",
      participants_count: 10,
      chat_room_id: "c06de8bb-9425-4bc4-8dfd-a2d560f757fe",
      is_user_member: true
    },
    {
      id: "17b63a44-1a3b-4e34-be66-468976126d2e",
      name: "Web3 Club",
      description: "👥 *Who should join*\n\n* Blockchain developers, Solidity coders, smart contract builders.\n* Crypto traders, NFT artists/collectors, DeFi enthusiasts.\n* Founders or builders creating dApps, DAOs, or tokenized projects.\n* Anyone curious about the decentralized internet and its future.\n\n📌 *What to Post*\n\n* Tutorials on blockchain, Solidity, dApps, wallets.\n* Showcases of NFT drops, crypto tools, DeFi dashboards.\n* Discussions on Web3 trends, DAOs, regulations, or security.\n* Open invites for hackathons, DAO projects, or collaborations.",
      participants_count: 8,
      chat_room_id: "711267fa-6420-4854-801f-a48133e8633f",
      is_user_member: true
    },
    {
      id: "e5bec58d-4313-4bdc-9ebf-95f99f6e30dd",
      name: "Designers Club",
      description: "for design, UI/UX, and creative work.",
      participants_count: 8,
      chat_room_id: "c550d6f5-af15-4830-a0bd-d059e0cdb70c",
      is_user_member: true
    },
    {
      id: "f1e39df8-ca17-40e0-92b9-ebae3b14baa1",
      name: "Growth Club",
      description: "for marketers, sales, and growth hackers.",
      participants_count: 10,
      chat_room_id: "49a2cdb7-d88d-4f88-8f7c-c480923415d1",
      is_user_member: true
    },
    {
      id: "096b2214-e478-4712-9933-45ed0fadf71b",
      name: "Memes Club",
      description: "for meme makers & content fun.",
      participants_count: 2,
      chat_room_id: "0d9f485b-4f8e-42ae-a586-e42e210780ef",
      is_user_member: true
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="text-center mt-16 sm:mt-24 md:mt-32 lg:mt-40 mb-12 sm:mb-16 md:mb-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#4A4A4A] leading-tight max-w-4xl mx-auto mb-8 sm:mb-12">
          Join Professional{' '}
          <span className="bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text-[#7052FF] px-4 py-2">
            Communities
          </span>
        </h1>
        <p className="text-[#696C78] text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Connect with like-minded professionals, share knowledge, and grow your network in specialized communities.
        </p>
      </div>

      {/* Club Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-20">
        {clubs.map((club, index) => (
          <ClubCard key={club.id} club={club} index={index} />
        ))}
      </div>

      {/* Simple Feature Highlight */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#4A4A4A] mb-4">
          Built for Professional Growth
        </h2>
        <p className="text-[#696C78] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
          Each community features structured discussions, networking opportunities, knowledge sharing, 
          and exclusive events designed to accelerate your professional development.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-[#7052FF] rounded-sm"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Discussions</h4>
            <p className="text-sm text-[#696C78]">Structured forums</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 bg-[#7052FF] rounded-full"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Networking</h4>
            <p className="text-sm text-[#696C78]">Connect with peers</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-4 h-6 bg-[#7052FF] rounded-sm"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Events</h4>
            <p className="text-sm text-[#696C78]">Exclusive workshops</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#7052FF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-4 bg-[#7052FF] rounded-sm"></div>
            </div>
            <h4 className="font-medium text-[#4A4A4A] mb-1">Resources</h4>
            <p className="text-sm text-[#696C78]">Curated content</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubPreview