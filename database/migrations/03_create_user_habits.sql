-- Create user_habits table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.user_habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    adopted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    streak_count INTEGER DEFAULT 0,
    last_completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, habit_id)
);

-- Enable RLS
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;

-- Create policies for user_habits
CREATE POLICY "Users can manage their own habits" ON public.user_habits
    FOR ALL USING (user_id = auth.uid());