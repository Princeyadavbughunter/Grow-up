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
    is_unpaid?: boolean;
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
      is_applied: boolean;
      is_unpaid?: boolean;
  }

  interface ProfileData {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    bio: string;
    university_name: string;
    graduation_year_from: string;
    profile_picture: string;
    address: string;
    lat: number | null;
    long: number | null;
    city: string;
    district: string;
    pincode: number;
    state: string;
    interest_in: string;
    hobbies: string;
    highest_qualification: string;
    passing_year: string;
    created_at: string;
    degree_name: string;
    is_degree: boolean;
    is_diploma: boolean;
    diploma_name: string | null;
    is_disabled: boolean;
    resume: string | null;
    skills: string;
    gender: string;
    saved_jobs_count: number;
    follower_count: number;
    dribble_account: string | null;
    github_account: string | null;
    figma_account: string | null;
    youtube_account: string | null;
    medium_account: string | null;
    user: string;
  }

  // Freelancer search response interfaces
  interface FreelancerSearchResult {
    id: string;
    is_following: boolean;
    follow_request_sent: boolean;
    work_experience: WorkExperience[];
    first_name: string;
    last_name: string;
    date_of_birth: string;
    bio: string;
    university_name: string;
    graduation_year_from: string;
    profile_picture: string | null;
    address: string;
    lat: number | null;
    long: number | null;
    city: string;
    district: string;
    pincode: number;
    state: string;
    interest_in: string;
    hobbies: string;
    highest_qualification: string;
    passing_year: string;
    created_at: string;
    degree_name: string;
    is_degree: boolean;
    is_diploma: boolean;
    diploma_name: string;
    is_disabled: boolean;
    resume: string | null;
    skills: string;
    gender: string;
    saved_jobs_count: number;
    follower_count: number;
    dribble_account: string | null;
    github_account: string | null;
    figma_account: string | null;
    youtube_account: string | null;
    medium_account: string | null;
    soft_skills: string;
    position: string;
    facebook_account: string | null;
    linkedin_account: string | null;
    instagram_account: string | null;
    twitter_account: string | null;
    user: string;
  }

  interface WorkExperience {
    id: string;
    company_name?: string;
    position?: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
    description?: string;
  }

  interface Page {
    id: string;
    name: string;
    description: string;
    profile_picture: string;
    cover_photo: string;
    followers_count: number;
    created_at: string;
    is_active: boolean;
    chatroom_id: string;
  }