"use client"
import React from 'react'
import Sidebar from './components/Sidebar'
import Description from './components/Description'
import ApplicationForm from './components/ApplicationForm'

const page = () => {
  return (
    <div className='max-w-[1350px] justify-center  gap-8 mx-auto  grid lg:grid-cols-3 px-10'>
      <Sidebar />
      <Description />
      <ApplicationForm />
    </div>
  )
}

export default page