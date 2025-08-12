-- Create applications table for job applications
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('web_developer', 'app_developer', 'hosting_expert', 'accounting_developer')),
  portfolio_url TEXT,
  skills TEXT[],
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table for applicant projects
CREATE TABLE public.application_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  project_description TEXT,
  main_image_url TEXT,
  additional_images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for submissions)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can add projects to applications" 
ON public.application_projects 
FOR INSERT 
WITH CHECK (true);

-- Admin policies (for future admin authentication)
CREATE POLICY "Admins can view all applications" 
ON public.applications 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update applications" 
ON public.applications 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view all projects" 
ON public.application_projects 
FOR SELECT 
USING (true);

-- Create storage buckets for application images
INSERT INTO storage.buckets (id, name, public) VALUES ('application-images', 'application-images', true);

-- Create storage policies
CREATE POLICY "Anyone can upload application images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'application-images');

CREATE POLICY "Anyone can view application images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'application-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();