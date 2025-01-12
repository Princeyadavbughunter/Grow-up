"use client"
import React from 'react'
import AddBasicInfo from './_components/AddBasicInfo'
import BasicInfoBio from './_components/BasicInfoBio'

const page = () => {
    return (
        <div className='px-40 flex justify-between '>
            <AddBasicInfo />
            <BasicInfoBio />
        </div>
    )
}

export default page