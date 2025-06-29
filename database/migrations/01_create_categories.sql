-- Create categories table first
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for categories (safe to run multiple times)
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
CREATE POLICY "Categories are publicly readable" ON public.categories
    FOR SELECT USING (true);

-- Insert default categories
INSERT INTO public.categories (name, description, icon, color) VALUES
('Values, Vision, Mission', 'Define your core values, craft a compelling vision, and establish your life mission.', '⭐', 'bg-purple-500'),
('Body & Physique', 'Build strength, flexibility, and overall physical wellbeing through tailored practices.', '❤️', 'bg-red-500'),
('Mind & Mental', 'Develop cognitive abilities, emotional intelligence, and mental resilience.', '🧠', 'bg-blue-500'),
('Rest & Sleep', 'Optimize your rest patterns for recovery, rejuvenation, and peak performance.', '🌙', 'bg-indigo-500'),
('Nutrition & Hydration', 'Fuel your body with intentional nutrition and proper hydration habits.', '🥗', 'bg-green-500'),
('Social Interaction', 'Cultivate meaningful relationships and enhance your social intelligence.', '👥', 'bg-yellow-500'),
('Time & Environment', 'Master time management and design environments that support your goals.', '⏰', 'bg-teal-500'),
('Finance & Business', 'Build financial literacy and develop sustainable wealth creation strategies.', '💰', 'bg-green-600'),
('Skills, Characteristics & Beliefs', 'Acquire valuable skills and develop empowering beliefs and characteristics.', '🎯', 'bg-orange-500')
ON CONFLICT (name) DO NOTHING;