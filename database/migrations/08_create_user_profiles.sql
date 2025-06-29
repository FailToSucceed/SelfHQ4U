-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Basic profile information
    username TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT, -- Copy from auth.users for easy access
    
    -- Extended profile information
    bio TEXT,
    location TEXT,
    website TEXT,
    date_of_birth DATE,
    
    -- Profile settings
    is_public BOOLEAN DEFAULT true,
    show_real_name BOOLEAN DEFAULT false,
    show_location BOOLEAN DEFAULT false,
    show_stats BOOLEAN DEFAULT true,
    
    -- Avatar and customization
    avatar_url TEXT,
    theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
    
    -- Privacy settings
    allow_friend_requests BOOLEAN DEFAULT true,
    allow_challenges BOOLEAN DEFAULT true,
    show_in_leaderboards BOOLEAN DEFAULT true,
    
    -- Metadata
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create friend connections table
CREATE TABLE IF NOT EXISTS public.friend_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure no duplicate friend requests
    UNIQUE(requester_id, addressee_id),
    -- Ensure users can't friend themselves
    CHECK (requester_id != addressee_id)
);

-- Create friend invitations table (for email invites)
CREATE TABLE IF NOT EXISTS public.friend_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    invitation_code UUID DEFAULT gen_random_uuid() UNIQUE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate invitations to same email from same user
    UNIQUE(inviter_id, email)
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    challenge_type TEXT NOT NULL CHECK (challenge_type IN ('habit_streak', 'custom_goal', 'activity_count', 'duration_based')),
    
    -- Challenge parameters (flexible JSON for different challenge types)
    parameters JSONB NOT NULL DEFAULT '{}',
    
    -- Timing
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Settings
    is_public BOOLEAN DEFAULT false,
    max_participants INTEGER,
    requires_approval BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure end date is after start date
    CHECK (end_date > start_date)
);

-- Create challenge participants table
CREATE TABLE IF NOT EXISTS public.challenge_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'failed')),
    progress JSONB DEFAULT '{}', -- Store progress data specific to challenge type
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure unique participation per challenge
    UNIQUE(challenge_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view public profiles or their own" ON public.user_profiles
    FOR SELECT USING (
        is_public = true OR 
        user_id = auth.uid()
    );

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Friend connections policies
CREATE POLICY "Users can view their friend connections" ON public.friend_connections
    FOR SELECT USING (
        requester_id = auth.uid() OR 
        addressee_id = auth.uid()
    );

CREATE POLICY "Users can create friend requests" ON public.friend_connections
    FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update friend requests involving them" ON public.friend_connections
    FOR UPDATE USING (
        requester_id = auth.uid() OR 
        addressee_id = auth.uid()
    );

-- Friend invitations policies
CREATE POLICY "Users can view their sent invitations" ON public.friend_invitations
    FOR SELECT USING (inviter_id = auth.uid());

CREATE POLICY "Users can create invitations" ON public.friend_invitations
    FOR INSERT WITH CHECK (inviter_id = auth.uid());

CREATE POLICY "Users can update their invitations" ON public.friend_invitations
    FOR UPDATE USING (inviter_id = auth.uid());

-- Challenges policies
CREATE POLICY "Users can view public challenges or their own" ON public.challenges
    FOR SELECT USING (
        is_public = true OR 
        creator_id = auth.uid() OR
        id IN (
            SELECT challenge_id FROM public.challenge_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create challenges" ON public.challenges
    FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own challenges" ON public.challenges
    FOR UPDATE USING (creator_id = auth.uid());

-- Challenge participants policies
CREATE POLICY "Users can view participants of challenges they're involved in" ON public.challenge_participants
    FOR SELECT USING (
        user_id = auth.uid() OR
        challenge_id IN (
            SELECT id FROM public.challenges WHERE creator_id = auth.uid()
        ) OR
        challenge_id IN (
            SELECT id FROM public.challenges WHERE is_public = true
        )
    );

CREATE POLICY "Users can join challenges" ON public.challenge_participants
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participation" ON public.challenge_participants
    FOR UPDATE USING (user_id = auth.uid());

-- Create functions to automatically update updated_at
CREATE OR REPLACE FUNCTION update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_friend_connection_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_challenge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_updated_at();

DROP TRIGGER IF EXISTS update_friend_connections_updated_at ON public.friend_connections;
CREATE TRIGGER update_friend_connections_updated_at
    BEFORE UPDATE ON public.friend_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_friend_connection_updated_at();

DROP TRIGGER IF EXISTS update_challenges_updated_at ON public.challenges;
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON public.challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_challenge_updated_at();

-- Create function to automatically create user profile on user registration
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 0;
BEGIN
    -- Try to use provided username first
    IF NEW.raw_user_meta_data->>'username' IS NOT NULL THEN
        final_username := lower(NEW.raw_user_meta_data->>'username');
        
        -- Check if username is available
        IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE username = final_username) THEN
            base_username := final_username;
        ELSE
            -- Username taken, generate alternative
            base_username := final_username;
            WHILE EXISTS (SELECT 1 FROM public.user_profiles WHERE username = final_username) LOOP
                counter := counter + 1;
                final_username := base_username || counter;
            END LOOP;
        END IF;
    ELSE
        -- Extract base username from email (part before @)
        base_username := split_part(NEW.email, '@', 1);
        
        -- Clean username (remove non-alphanumeric characters)
        base_username := regexp_replace(base_username, '[^a-zA-Z0-9]', '', 'g');
        
        -- Ensure minimum length
        IF length(base_username) < 3 THEN
            base_username := 'user' || substring(NEW.id::text, 1, 8);
        END IF;
        
        -- Make it lowercase
        base_username := lower(base_username);
        final_username := base_username;
        
        -- Find available username
        WHILE EXISTS (SELECT 1 FROM public.user_profiles WHERE username = final_username) LOOP
            counter := counter + 1;
            final_username := base_username || counter;
        END LOOP;
    END IF;
    
    -- Create user profile
    INSERT INTO public.user_profiles (
        user_id,
        username,
        email,
        first_name,
        last_name
    ) VALUES (
        NEW.id,
        final_username,
        NEW.email,
        NEW.raw_user_meta_data->>'firstName',
        NEW.raw_user_meta_data->>'lastName'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_friend_connections_requester ON public.friend_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_friend_connections_addressee ON public.friend_connections(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friend_connections_status ON public.friend_connections(status);
CREATE INDEX IF NOT EXISTS idx_friend_invitations_email ON public.friend_invitations(email);
CREATE INDEX IF NOT EXISTS idx_friend_invitations_code ON public.friend_invitations(invitation_code);
CREATE INDEX IF NOT EXISTS idx_challenges_creator ON public.challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_public ON public.challenges(is_public);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id);