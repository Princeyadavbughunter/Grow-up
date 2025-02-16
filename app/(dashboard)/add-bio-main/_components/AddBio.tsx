import React from 'react'
import ProfileData from '../../profile/components/ProfileData'

import AddBioMain from './AddBioMain';
import CreatePost from './PostButton';
import ShowCasePortfolios from '../../_components/ShowCasePortfolios';

const AddBio = () => {

    return (
        <div className='pb-40'>
            <ProfileData />
            <AddBioMain />
            <ShowCasePortfolios />
            <CreatePost />
        </div>
    )
}

export default AddBio