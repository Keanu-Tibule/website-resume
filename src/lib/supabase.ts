import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Project {
  id: string
  title: string
  description: string | null
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface PersonalInfo {
  id: string
  full_name: string
  title: string
  bio: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  profile_image_url: string | null
  resume_pdf_url: string | null
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string | null
  order_index: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string | null
  start_date: string
  end_date: string | null
  location: string | null
  company_url: string | null
  order_index: number
  created_at: string
  updated_at: string
}
