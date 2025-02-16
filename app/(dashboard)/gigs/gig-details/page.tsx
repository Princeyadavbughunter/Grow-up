"use client"
import React from 'react'
import MainGigsTab from './_components/main-gig-tab'
import GigsDetails from './_components/gigs-details'

const page = () => {
    return (
        <div className='flex justify-center gap-5 p-2 h-[580px] overflow-y-auto'>
            <MainGigsTab />
            <GigsDetails />
        </div>
    )
}

export default page