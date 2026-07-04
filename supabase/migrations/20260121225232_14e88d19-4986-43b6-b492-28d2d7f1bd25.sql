-- Create leads table for contact form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'contact_form'
);

-- Create chat_logs table for chatbot interactions
CREATE TABLE public.chat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_message TEXT NOT NULL,
  bot_response TEXT,
  source TEXT NOT NULL DEFAULT 'chatbot'
);

-- Create projects table for displaying work
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  activity_status TEXT NOT NULL DEFAULT 'ongoing',
  image_url TEXT,
  live_url TEXT,
  slug TEXT UNIQUE
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads table
-- Anyone can insert new leads (public form submission)
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can read leads
CREATE POLICY "Authenticated users can read leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for chat_logs table
-- Anyone can insert chat logs (public chatbot)
CREATE POLICY "Anyone can insert chat_logs"
ON public.chat_logs
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can read chat logs
CREATE POLICY "Authenticated users can read chat_logs"
ON public.chat_logs
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for projects table
-- Anyone can read projects (public display)
CREATE POLICY "Anyone can read projects"
ON public.projects
FOR SELECT
USING (true);

-- Only authenticated users can modify projects
CREATE POLICY "Authenticated users can insert projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (true);