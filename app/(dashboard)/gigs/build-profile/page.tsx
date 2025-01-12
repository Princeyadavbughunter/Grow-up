"use client"
import React from 'react'
import AddDetails from './_components/add-details'
import LogoDetails from './_components/LogoDetails'
import LinkProfile from './_components/LinkProfile'

const page = () => {
    return (
        <div className='flex mx-auto justify-center gap-20'>
            <div>
                <AddDetails />
            </div>
            <div>
                <LogoDetails />
            </div>
            <div>
                <LinkProfile />
            </div>
        </div>
    )
}

export default page