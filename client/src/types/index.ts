export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  tech_stack: string[];
  featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  order: number;
  created_at: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
