"use client"
import React from 'react'
import YourApplications from './_components/YourApplications'
import YourBio from './_components/yourbio'

const page = () => {
    return (
        <div className='flex mx-auto justify-between px-40'>
            <YourApplications />
            <YourBio />
        </div>
    )
}

export default page