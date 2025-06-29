-- Create resources table for user-suggested books, audiobooks, podcasts, etc.
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Resource details
    title TEXT NOT NULL,
    description TEXT,
    author TEXT, -- For books/audiobooks
    host TEXT, -- For podcasts
    resource_type TEXT NOT NULL CHECK (resource_type IN ('book', 'audiobook', 'podcast', 'video', 'article', 'course', 'tool', 'other')),
    category_id UUID REFERENCES public.categories(id),
    
    -- External links
    url TEXT, -- Link to resource (Amazon, podcast platform, etc.)
    affiliate_link TEXT, -- For future monetization
    
    -- User ratings and engagement
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_time TEXT, -- e.g., "2 hours", "45 minutes", "6 weeks"
    
    -- Tags for categorization
    tags TEXT[], -- Array of tags
    
    -- Moderation and quality control
    is_approved BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    
    -- Statistics
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resource votes table for tracking user votes
CREATE TABLE IF NOT EXISTS public.resource_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one vote per user per resource
    UNIQUE(user_id, resource_id)
);

-- Create resource views table for tracking views
CREATE TABLE IF NOT EXISTS public.resource_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;

-- RLS policies for resources
CREATE POLICY "Approved resources are readable by all" ON public.resources
    FOR SELECT USING (is_approved = true OR user_id = auth.uid());

CREATE POLICY "Users can create resources" ON public.resources
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own resources" ON public.resources
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own resources" ON public.resources
    FOR DELETE USING (user_id = auth.uid());

-- RLS policies for resource votes
CREATE POLICY "Users can view all votes" ON public.resource_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own votes" ON public.resource_votes
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own votes" ON public.resource_votes
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own votes" ON public.resource_votes
    FOR DELETE USING (user_id = auth.uid());

-- RLS policies for resource views
CREATE POLICY "Users can view all resource views" ON public.resource_views
    FOR SELECT USING (true);

CREATE POLICY "Users can create resource views" ON public.resource_views
    FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Create functions to update vote counts
CREATE OR REPLACE FUNCTION update_resource_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'upvote' THEN
            UPDATE public.resources SET upvotes = upvotes + 1 WHERE id = NEW.resource_id;
        ELSE
            UPDATE public.resources SET downvotes = downvotes + 1 WHERE id = NEW.resource_id;
        END IF;
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        -- Handle vote change
        IF OLD.vote_type = 'upvote' AND NEW.vote_type = 'downvote' THEN
            UPDATE public.resources SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.resource_id;
        ELSIF OLD.vote_type = 'downvote' AND NEW.vote_type = 'upvote' THEN
            UPDATE public.resources SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.resource_id;
        END IF;
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'upvote' THEN
            UPDATE public.resources SET upvotes = upvotes - 1 WHERE id = OLD.resource_id;
        ELSE
            UPDATE public.resources SET downvotes = downvotes - 1 WHERE id = OLD.resource_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update view count
CREATE OR REPLACE FUNCTION update_resource_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.resources SET view_count = view_count + 1 WHERE id = NEW.resource_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_resource_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_resource_votes_trigger ON public.resource_votes;
CREATE TRIGGER update_resource_votes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.resource_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_votes();

DROP TRIGGER IF EXISTS update_resource_view_count_trigger ON public.resource_views;
CREATE TRIGGER update_resource_view_count_trigger
    AFTER INSERT ON public.resource_views
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_view_count();

DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION update_resource_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_approved ON public.resources(is_approved);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON public.resources(is_featured);
CREATE INDEX IF NOT EXISTS idx_resources_rating ON public.resources(rating);
CREATE INDEX IF NOT EXISTS idx_resources_created ON public.resources(created_at);
CREATE INDEX IF NOT EXISTS idx_resource_votes_resource ON public.resource_votes(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_views_resource ON public.resource_views(resource_id);