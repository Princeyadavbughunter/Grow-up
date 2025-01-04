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
  // Add more network connections
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
  // Add more near network connections
];

export default function NetworkPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4">
          <NetworkSection title="My network">
            {myNetwork.map((connection, index) => (
              <NetworkCard key={index} {...connection} />
            ))}
          </NetworkSection>
        </div>

        <div className="col-span-8">
          <NetworkSection title="Invites" showAll>
            {invites.map((invite, index) => (
              <NetworkCard key={index} {...invite} showAccept />
            ))}
          </NetworkSection>

          <NetworkSection title="Near My Network">
            <div className="grid grid-cols-3 gap-4">
              {nearNetwork.map((connection, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <NetworkCard {...connection} />
                </div>
              ))}
            </div>
          </NetworkSection>
        </div>
      </div>
    </div>
  );
}