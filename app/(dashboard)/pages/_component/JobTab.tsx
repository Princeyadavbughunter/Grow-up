// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useAuthenticatedApi } from '@/context/AuthContext'
import JobList from '../../gigs/jobs/_component/job-list'

interface JobTabProps {
  pageId: string;
}

const JobTab: React.FC<JobTabProps> = ({ pageId }) => {
  const [pageJobs, setPageJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    const fetchPageJobs = async () => {
      try {
        const response = await api.get(`/jobs/page-jobs/?page=${pageId}`);
        setPageJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page jobs:', error);
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPageJobs();
    }
  }, [pageId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className='px-20'>
      <JobList jobs={pageJobs} />
    </div>
  )
}

export default JobTab