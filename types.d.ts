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