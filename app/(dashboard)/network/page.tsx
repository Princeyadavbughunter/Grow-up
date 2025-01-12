"use client";

import { NetworkCard } from "./_components/NetworkCard";
import { NetworkSection } from "./_components/NetworkSection";

const myNetwork = [
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },

];

const invites = [
  {
    name: "Cameron Williamson",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
    summary: "Hi, I am Aryan - Founder at....."
  },
  {
    name: "Cameron Williamson",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
    summary: "Hi, I am Aryan - Founder at....."
  },
  {
    name: "Cameron Williamson",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
    summary: "Hi, I am Aryan - Founder at....."
  },
  {
    name: "Cameron Williamson",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
    summary: "Hi, I am Aryan - Founder at....."
  },
  // Add more invites
];

const nearNetwork = [
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    name: "Aryan Trivedi",
    title: "Founder - Finzie | Ex Groww | BITS Pilani",
    location: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces",
    isOnline: true,
  },
  // Add more near network connections
];

export default function NetworkPage() {
  return (

    <div className="flex h-screen ">
      {/* Left Section */}
      <div className="w-1/3 bg-[#F9FAFF] p-4 h-full fixed overflow-y-auto px-10">
        <NetworkSection title="My network">
          {myNetwork.map((connection, index) => (
            <NetworkCard key={index} {...connection} />
          ))}
        </NetworkSection>
      </div>

      {/* Right Section */}
      <div className="ml-[33%] w-2/3 p-4 overflow-y-auto min-h-screen  scrollbar-[1px]">
        <NetworkSection title="Invites" showAll>
          {invites.map((invite, index) => (
            <NetworkCard key={index} {...invite} showAccept />
          ))}
        </NetworkSection>

        <NetworkSection title="Near My Network">
          <div className="gap-4 space-y-6">
            {nearNetwork.map((connection, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <NetworkCard {...connection} />
              </div>
            ))}
          </div>
        </NetworkSection>
      </div>
    </div>
  );
}