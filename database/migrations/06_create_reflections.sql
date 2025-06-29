-- Create reflections table for storing user reflection answers
CREATE TABLE IF NOT EXISTS public.reflections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_of DATE NOT NULL, -- The Monday of the week this reflection is for
    
    -- Values alignment (1-10 scale)
    values_alignment INTEGER CHECK (values_alignment >= 1 AND values_alignment <= 10),
    values_reflection TEXT,
    
    -- Mission progress (1-10 scale)
    mission_progress INTEGER CHECK (mission_progress >= 1 AND mission_progress <= 10),
    mission_reflection TEXT,
    
    -- Weekly progress reflection
    week_progress_reflection TEXT,
    week_challenges TEXT,
    week_wins TEXT,
    
    -- Vision progress (1-10 scale)
    vision_progress INTEGER CHECK (vision_progress >= 1 AND vision_progress <= 10),
    vision_reflection TEXT,
    
    -- Gratitude
    gratitude_items TEXT[], -- Array of gratitude items
    
    -- Metadata
    is_draft BOOLEAN DEFAULT TRUE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint to prevent multiple reflections for the same week
ALTER TABLE public.reflections 
ADD CONSTRAINT unique_user_week_reflection 
UNIQUE (user_id, week_of);

-- Enable RLS
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own reflections" ON public.reflections
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own reflections" ON public.reflections
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reflections" ON public.reflections
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reflections" ON public.reflections
    FOR DELETE USING (user_id = auth.uid());

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_reflection_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_reflections_updated_at ON public.reflections;
CREATE TRIGGER update_reflections_updated_at
    BEFORE UPDATE ON public.reflections
    FOR EACH ROW
    EXECUTE FUNCTION update_reflection_updated_at();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reflections_user_week ON public.reflections(user_id, week_of);
CREATE INDEX IF NOT EXISTS idx_reflections_submitted ON public.reflections(user_id, submitted_at) WHERE submitted_at IS NOT NULL;