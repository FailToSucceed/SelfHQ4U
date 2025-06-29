# SelfHQ Database Setup

This directory contains the database schema and migration files for the SelfHQ platform.

## Database Structure

The SelfHQ platform uses **Supabase (PostgreSQL)** with the following core tables:

### Core Tables

1. **categories** - Content categories (Values, Body, Mind, etc.)
2. **habits** - User-created habits with public/private options
3. **user_habits** - Many-to-many relationship for adopted habits
4. **challenges** - Time-bound challenges and programs
5. **user_challenges** - User participation in challenges
6. **events** - Workshops, seminars, and other events
7. **event_attendees** - Event registration and attendance
8. **ai_agents** - AI coaching agents and mentors
9. **user_ai_agents** - User subscriptions to AI agents
10. **user_subscriptions** - Premium subscription management
11. **purchases** - Transaction history for paid content
12. **profiles** - Extended user profile information

## Setup Instructions

### 1. Initial Database Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Note your project URL and anon key** from Settings > API
3. **Add environment variables** to your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 2. Run Database Migrations

Copy and paste the SQL from these files **one by one** into your Supabase SQL Editor:

1. **`01_create_categories.sql`** - Creates development categories
2. **`02_create_habits.sql`** - Creates/updates habits table with monetization features
3. **`03_create_user_habits.sql`** - Enables users to adopt and track habits
4. **`04_create_subscriptions.sql`** - Premium subscription system
5. **`05_insert_sample_habits.sql`** - Sample data for testing

**Important**: Run each migration separately and wait for it to complete before running the next one.

**Note**: The `02_create_habits.sql` migration is smart - it will either create a new habits table or update your existing one by adding missing columns (`is_private`, `price`, `creator_id`, `category_id`) while preserving your existing data.

### 3. Verify Setup

After running the migrations, you should see:
- ✅ All tables created with proper relationships
- ✅ Row Level Security (RLS) enabled
- ✅ Basic sample data inserted
- ✅ Default categories populated

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies for:
- **Public content**: Readable by all users
- **Private content**: Only accessible by creators and purchasers
- **User data**: Only accessible by the owning user

### Content Visibility
- **Habits**: Public by default, private with premium subscription
- **Challenges**: Public by default, private for premium creators
- **Events**: Public events visible to all, private events restricted
- **AI Agents**: Based on creator settings and user subscriptions

## Monetization Features

The database supports multiple monetization models:

1. **Premium Subscriptions** (`user_subscriptions`)
   - Basic, Premium, Elite tiers
   - Stripe integration ready

2. **Content Sales** (`purchases`)
   - Paid habits, challenges, events
   - Commission tracking
   - Refund support

3. **AI Agent Services**
   - Per-session, subscription, or one-time pricing
   - Creator revenue sharing

## Development Notes

### TypeScript Integration
- Full TypeScript interfaces available in `/src/types/database.ts`
- Type-safe database operations with Supabase client
- Auto-completion for all database operations

### Testing Data
The migration includes sample habits for testing:
- Daily Meditation
- Gratitude Journal  
- Morning Workout

### Future Extensions
The schema is designed to support:
- Mobile app integration
- IoT device connectivity
- Advanced analytics
- Multi-language content
- Affiliate marketing

## Common Queries

### Get User's Active Habits
```sql
SELECT h.*, c.name as category_name
FROM habits h
JOIN user_habits uh ON h.id = uh.habit_id
JOIN categories c ON h.category_id = c.id
WHERE uh.user_id = auth.uid() AND uh.is_active = true;
```

### Get Public Habits by Category
```sql
SELECT h.*, c.name as category_name, p.first_name || ' ' || p.last_name as creator_name
FROM habits h
JOIN categories c ON h.category_id = c.id
JOIN profiles p ON h.creator_id = p.id
WHERE h.is_private = false AND c.name = 'Mind & Mental';
```

### Check User Premium Status
```sql
SELECT subscription_type, is_active
FROM user_subscriptions
WHERE user_id = auth.uid() AND is_active = true
ORDER BY created_at DESC
LIMIT 1;
```

## Backup and Maintenance

### Regular Backups
- Supabase provides automatic backups
- Consider additional backup strategy for production

### Performance Optimization
- Indexes are automatically created for foreign keys
- Consider additional indexes for frequently queried columns
- Monitor query performance in Supabase dashboard

## Support

For database-related issues:
1. Check Supabase logs in the dashboard
2. Verify RLS policies if access issues occur
3. Test queries in the SQL editor
4. Review migration files for proper table creation