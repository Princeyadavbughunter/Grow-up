'use client'
import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import { BiLink } from 'react-icons/bi';
import { IoLocationOutline } from 'react-icons/io5';

interface Follower {
  name: string;
  location: string;
  avatar: string;
}

const ProfileView = ({ onBack }: { onBack: () => void }) => {
  const followers: Follower[] = [
    { name: 'Aryan Trivedi', location: 'Andra Pradesh', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Smriti Dubey', location: 'Tamil Nadu', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Siddharth kuma (SK)', location: 'Andra Pradesh', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Junaid Khan', location: 'Tamil Nadu', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={()=>onBack()} className="rounded-full p-2 hover:bg-gray-100">
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
          <button className="flex-1 rounded-lg bg-purple-600 py-3 text-white">Follow</button>
          <button className="flex-1 rounded-lg border border-purple-600 py-3 text-purple-600">Message</button>
        </div>

        <div className="mb-6 flex gap-4">
          <button className="rounded-lg bg-gray-200 px-4 py-2 font-medium">Home</button>
          <button className="rounded-lg px-4 py-2 text-gray-500">About</button>
          <button className="rounded-lg px-4 py-2 text-gray-500">Post</button>
          <button className="rounded-lg px-4 py-2 text-gray-500">Job</button>
          <button className="rounded-lg px-4 py-2 text-gray-500">People</button>
        </div>

        <div className="mb-6 space-y-4">
          <p className="text-gray-700">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
            <button className="ml-2 text-gray-500">...See more</button>
          </p>
        </div>

        <div className="mb-6 rounded-lg border p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <BiLink className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium">Invitation link</h3>
            </div>
            <p className="text-gray-500">https://sjsfhHAD44iddioAR.com/</p>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-medium">Website</span>
              <a href="https://ptai.in" className="ml-2 text-purple-600">ptai.in</a>
            </div>
            <div>
              <span className="font-medium">Phone</span>
              <span className="ml-2 text-purple-600">8800569545</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Followers</h2>
          <div className="space-y-4">
            {followers.map((follower, index) => (
              <div key={index} className="flex items-center gap-3">
                <img src={follower.avatar} alt={follower.name} className="h-12 w-12 rounded-full" />
                <div>
                  <h3 className="font-medium">{follower.name}</h3>
                  <p className="text-gray-500">{follower.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;