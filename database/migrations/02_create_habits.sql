-- Create or update habits table to match application requirements
-- This handles both new installations and existing tables

-- First, check if habits table exists and what columns it has
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'habits'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        -- Create new habits table
        CREATE TABLE public.habits (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT,
            category_id UUID,
            user_id UUID,
            creator_id UUID,
            difficulty TEXT DEFAULT 'medium',
            frequency TEXT DEFAULT 'daily',
            estimated_time TEXT DEFAULT '15 minutes',
            tags TEXT[],
            is_private BOOLEAN DEFAULT FALSE,
            price DECIMAL(10,2) DEFAULT 0.00,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created new habits table';
    ELSE
        RAISE NOTICE 'Habits table already exists, adding missing columns...';
        
        -- Add missing columns one by one
        -- is_private column
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'habits' AND column_name = 'is_private' AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.habits ADD COLUMN is_private BOOLEAN DEFAULT FALSE;
            RAISE NOTICE 'Added is_private column';
        END IF;
        
        -- price column
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'habits' AND column_name = 'price' AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.habits ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;
            RAISE NOTICE 'Added price column';
        END IF;
        
        -- creator_id column
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'habits' AND column_name = 'creator_id' AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.habits ADD COLUMN creator_id UUID;
            RAISE NOTICE 'Added creator_id column';
        END IF;
        
        -- category_id column
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'habits' AND column_name = 'category_id' AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.habits ADD COLUMN category_id UUID;
            RAISE NOTICE 'Added category_id column';
        END IF;
        
        -- Copy user_id to creator_id for existing records
        UPDATE public.habits 
        SET creator_id = user_id 
        WHERE creator_id IS NULL AND user_id IS NOT NULL;
        
        -- Update category_id based on existing category text values
        UPDATE public.habits 
        SET category_id = (
            SELECT c.id FROM public.categories c 
            WHERE c.name = public.habits.category
        ) 
        WHERE category_id IS NULL AND category IS NOT NULL;
        
        RAISE NOTICE 'Updated existing data';
    END IF;
END $$;

-- Add foreign key constraints (safe for both new and existing tables)
DO $$ 
BEGIN
    -- Foreign key to categories
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_habits_category'
        AND table_name = 'habits'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.habits 
        ADD CONSTRAINT fk_habits_category 
        FOREIGN KEY (category_id) REFERENCES public.categories(id);
        RAISE NOTICE 'Added category foreign key constraint';
    END IF;
    
    -- Foreign key to users
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_habits_creator'
        AND table_name = 'habits'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.habits 
        ADD CONSTRAINT fk_habits_creator 
        FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added creator foreign key constraint';
    END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "Public habits are readable by all" ON public.habits;
DROP POLICY IF EXISTS "Users can create habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;

-- Create RLS policies
CREATE POLICY "Public habits are readable by all" ON public.habits
    FOR SELECT USING (
        is_private = false OR 
        creator_id = auth.uid()
    );

CREATE POLICY "Users can create habits" ON public.habits
    FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own habits" ON public.habits
    FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own habits" ON public.habits
    FOR DELETE USING (creator_id = auth.uid());

-- Show final table structure for verification
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    CASE WHEN column_name IN ('is_private', 'price', 'creator_id', 'category_id') 
         THEN '← NEW' 
         ELSE '' 
    END as status
FROM information_schema.columns 
WHERE table_name = 'habits' AND table_schema = 'public'
ORDER BY ordinal_position;