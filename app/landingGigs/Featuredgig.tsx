'use client'
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';

const Featuredgig = () => {
    const [activeCategory, setActiveCategory] = useState('Developer');

    const categories = ['Developer', 'Design', 'Marketing', 'Data Scientist'];
    const jobs = [
      {
        id: 1,
        company: 'Amazon',
        role: 'Web Developer',
        time: '24h ago',
        description:
          'Seeking a talented UI/UX Designer to spearhead our mobile app’s design, creating intuitive....',
        appliedCount: 40,
        type: 'Internship',
      },
      {
        id: 2,
        company: 'Amazon',
        role: 'Web Developer',
        time: '24h ago',
        description:
          'Seeking a talented UI/UX Designer to spearhead our mobile app’s design, creating intuitive....',
        appliedCount: 40,
        type: 'Internship',
      },
      {
        id: 3,
        company: 'Amazon',
        role: 'Web Developer',
        time: '24h ago',
        description:
          'Seeking a talented UI/UX Designer to spearhead our mobile app’s design, creating intuitive....',
        appliedCount: 40,
        type: 'Internship',
      },
      {
        id: 4,
        company: 'Amazon',
        role: 'Web Developer',
        time: '24h ago',
        description:
          'Seeking a talented UI/UX Designer to spearhead our mobile app’s design, creating intuitive....',
        appliedCount: 40,
        type: 'Internship',
      },
    ];
  return (
    <section className="py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Featured Gigs</h2>
      </div>
      <div className="flex justify-center mb-6">
        <div className="inline-flex border rounded-full border-gray-500">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2  rounded-full text-lg ${
                activeCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-transparent text-gray-600'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{job.company}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">{job.role}</p>
                <Image
                  src="/amazon-logo.png"
                  alt="Amazon"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{job.time}</p>
              <p className="text-sm text-gray-600 mt-2">
                {job.description}
                <span className="text-blue-500">...read more</span>
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-xs text-gray-500 flex items-center">
                <Image
                  src="/applied-icon.png"
                  alt="Applied"
                  width={16}
                  height={16}
                  className="mr-1"
                />
                {job.appliedCount} applied
              </p>
              <span className="text-xs text-gray-500 border rounded-full px-2 py-1">
                {job.type}
              </span>
            </div>
            <button className="mt-4 bg-gradient-to-r from-purple-400 to-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center">
              Apply <span className="ml-2">→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Featuredgig
