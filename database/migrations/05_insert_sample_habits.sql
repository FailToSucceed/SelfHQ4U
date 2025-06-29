-- Insert sample habits for testing
-- Note: We'll use NULL for creator_id for sample data, or use an existing user if available

-- Insert Daily Meditation if it doesn't exist
INSERT INTO public.habits (title, description, category, category_id, creator_id, is_private, price, difficulty, frequency, estimated_time) 
SELECT 
    'Daily Meditation',
    '10 minutes of mindfulness meditation every morning',
    c.name,
    c.id,
    (SELECT id FROM auth.users LIMIT 1), -- Use first available user, or NULL if none
    false,
    0.00,
    'easy',
    'daily',
    10
FROM public.categories c 
WHERE c.name = 'Mind & Mental'
AND NOT EXISTS (
    SELECT 1 FROM public.habits WHERE title = 'Daily Meditation'
);

-- Insert Gratitude Journal if it doesn't exist
INSERT INTO public.habits (title, description, category, category_id, creator_id, is_private, price, difficulty, frequency, estimated_time) 
SELECT 
    'Gratitude Journal',
    'Write 3 things you''re grateful for each evening',
    c.name,
    c.id,
    (SELECT id FROM auth.users LIMIT 1), -- Use first available user, or NULL if none
    false,
    0.00,
    'easy',
    'daily',
    5
FROM public.categories c 
WHERE c.name = 'Mind & Mental'
AND NOT EXISTS (
    SELECT 1 FROM public.habits WHERE title = 'Gratitude Journal'
);

-- Insert Morning Workout if it doesn't exist
INSERT INTO public.habits (title, description, category, category_id, creator_id, is_private, price, difficulty, frequency, estimated_time) 
SELECT 
    'Morning Workout',
    '30-minute strength training session',
    c.name,
    c.id,
    (SELECT id FROM auth.users LIMIT 1), -- Use first available user, or NULL if none
    false,
    0.00,
    'medium',
    'daily',
    30
FROM public.categories c 
WHERE c.name = 'Body & Physique'
AND NOT EXISTS (
    SELECT 1 FROM public.habits WHERE title = 'Morning Workout'
);

-- Alternative: If you want to create sample habits without a creator, 
-- you can temporarily disable the foreign key constraint:
-- ALTER TABLE public.habits DROP CONSTRAINT IF EXISTS fk_habits_creator;
-- -- Run the inserts with NULL creator_id
-- -- Then re-add the constraint:
-- ALTER TABLE public.habits ADD CONSTRAINT fk_habits_creator 
-- FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;