interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    posted: string;
    status?: string;
    salary?: string;
    duration?: string;
    workType?: string;
    description?: string;
    responsibilities?: string[];
    offers?: string[];
  }



  interface Gig {
      id: string;
      is_bookmark: boolean;
      job_description: string;
      job_title: string;
      location: string;
      employment_type: string;
      required_skills: string;
      salary_range: string;
      created_at: string;
      is_active: string;
      about_role: string;
      experience: string;
      role: string;
      view_count: number;
      work_type: string | null;
      lat: number | null;
      long: number | null;
      recruiter: string;
      user: string;
  }