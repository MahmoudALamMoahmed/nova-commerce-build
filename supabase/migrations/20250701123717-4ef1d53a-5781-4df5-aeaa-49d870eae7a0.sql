
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
-- Everyone can view categories (for public product display)
CREATE POLICY "Anyone can view categories" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Only admins can manage categories
CREATE POLICY "Only admins can insert categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (is_current_user_admin());

CREATE POLICY "Only admins can update categories" 
  ON public.categories 
  FOR UPDATE 
  USING (is_current_user_admin());

CREATE POLICY "Only admins can delete categories" 
  ON public.categories 
  FOR DELETE 
  USING (is_current_user_admin());

-- Add category_id column to products table
ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id);

-- Insert some default categories to get started
INSERT INTO public.categories (name) VALUES 
  ('Electronics'),
  ('Clothing'),
  ('Books'),
  ('Home & Garden'),
  ('Sports & Outdoors');
