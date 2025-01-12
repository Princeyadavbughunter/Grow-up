'use client';
import React, { useState } from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';
import Followers from './followers';
import HomeTab from './HomeTab';
import AboutTab from './AboutTab';
import PostTab from './PostTab';
import JobTab from './JobTab';
import PeopleTab from './PeopleTab';



const ProfileView = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<string>('Home');



  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeTab />;
      case 'About':
        return <AboutTab />;
      case 'Post':
        return <PostTab />;
      case 'Job':
        return <JobTab />;
      case 'People':
        return <PeopleTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex space-x-5 mx-auto w-full ">
      <div className="mx-auto rounded-lg bg-white p-6 shadow-sm w-full ">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => onBack()} className="rounded-full p-2 hover:bg-gray-100">
            <BsArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center gap-4">
            <img src="/white-room-logo.png" alt="White Room" className="h-16 w-16 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold">White Room</h1>
              <p className="text-gray-600">Founder - Finzie | Ex Groww | BITS Pilani</p>
              <div className="flex items-center gap-2 text-gray-500">
                <IoLocationOutline />
                <span>Lakshman Puri, Delhi</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <FaLinkedin className="h-6 w-6 text-gray-500" />
            <FaTwitter className="h-6 w-6 text-gray-500" />
            <FaInstagram className="h-6 w-6 text-gray-500" />
            <FaFacebook className="h-6 w-6 text-gray-500" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg text-purple-600">75k followers</p>
        </div>

        <div className="mb-6 flex gap-4">
          <button className="flex-1 rounded-lg bg-[#7052FF] py-3 text-white">Follow</button>
          <button className="flex-1 rounded-lg  border border-[#7052FF] py-3 text-[#7052FF]">Message</button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 justify-center">
          {['Home', 'About', 'Post', 'Job', 'People'].map((tab) => (
            <button
              key={tab}
              className={`rounded-lg px-4 py-2 font-medium ${activeTab === tab ? 'bg-gray-200 text-black' : 'text-gray-500'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-6 overflow-y-auto h-96">
          {renderTabContent()}
        </div>


      </div>

      <Followers />
    </div>
  );
};

export default ProfileView;
