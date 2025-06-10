// @ts-nocheck
"use client"
import React, { useState, FormEvent, ChangeEvent } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { IoMdLocate } from 'react-icons/io'
import { MdOutlineAddHomeWork } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { useAuth, useAuthenticatedApi } from "@/context/AuthContext"

const ProfileSetupPage = () => {
  // Personal details state
  const [fullName, setFullName] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [location, setLocation] = useState<string>('Current location')
  const [website, setWebsite] = useState<string>('')
  const [noWebsite, setNoWebsite] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  
  // Company details state
  const [logo, setLogo] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string>('')
  const [companyDescription, setCompanyDescription] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [companySize, setCompanySize] = useState<string>('')
  const [industry, setIndustry] = useState<string>('')
  const [projectName, setProjectName] = useState<string>('')

  const { api } = useAuthenticatedApi()

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(URL.createObjectURL(file))
    }
  }

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const formData = new FormData()
      
      formData.append('full_name', fullName)
      formData.append('company_name', companyName)
      formData.append('company_website', website)
      formData.append('company_description', companyDescription)
      formData.append('company_location', location)
      formData.append('company_size', companySize)
      formData.append('company_industry', industry)
      formData.append('company_phone', phoneNumber)
      formData.append('company_email', email)
      formData.append('no_website', noWebsite.toString())
      formData.append('company_project_name', projectName)
      
      if (logo) {
        // Assuming the API expects a file for company_logo
        const logoFile = await fetch(logo).then(r => r.blob())
        formData.append('company_logo', logoFile)
      }
      
      const response = await api.post('/company/app/company-profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      
      if (response.status === 200 || response.status === 201) {
        console.log('Profile updated successfully')
        // Redirect or show success message
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile Setup</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Details Section */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-6">Let's build your profile together</p>
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 bg-gray-200">
                  {avatar && <img src={avatar} alt="Profile" className="h-full w-full object-cover" />}
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer">
                  +
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-lg">Full name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 p-3"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-lg">Phone number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                  placeholder="+91 Enter your number"
                  className="mt-1 p-3"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-lg">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 p-3"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-lg">Your location</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                  placeholder="Current location"
                  className="mt-1 p-3"
                />
                <p className="text-purple-600 flex items-center gap-2 cursor-pointer mt-2">
                  <IoMdLocate />Auto-detect my city
                </p>
              </div>

              <div>
                <Label htmlFor="website" className="text-lg">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  disabled={noWebsite}
                  className="mt-1 p-3"
                />
                <div className="flex items-center mt-2">
                  <input 
                    type="checkbox" 
                    id="noWebsite"
                    checked={noWebsite}
                    onChange={() => setNoWebsite(!noWebsite)}
                    className="mr-2" 
                  />
                  <label htmlFor="noWebsite" className="text-sm text-gray-700">I don't have a website</label>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h2 className="text-xl font-semibold mb-6">Company Details</h2>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                {logo ? (
                  <img src={logo} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <MdOutlineAddHomeWork className="text-4xl text-gray-600" />
                )}
              </div>
              
              <div>
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer text-purple-600 hover:underline font-medium"
                >
                  Upload Logo
                </label>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <p className="text-sm text-gray-500 mt-1">Recommended size: 512x512px</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName"
                  type="text" 
                  placeholder="Ex. Dell" 
                  value={companyName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName"
                  type="text" 
                  placeholder="Ex. growupbuddy" 
                  value={projectName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Input 
                  id="companySize"
                  type="text" 
                  placeholder="Ex. 52-55" 
                  value={companySize}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanySize(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry"
                  type="text" 
                  placeholder="Ex. Tech" 
                  value={industry}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="companyDescription">Company description</Label>
                <Textarea 
                  id="companyDescription"
                  placeholder="Write a brief about your company" 
                  className="mt-1 h-32"
                  value={companyDescription}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCompanyDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            type="submit"
            className="px-8 mb-20 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileSetupPage