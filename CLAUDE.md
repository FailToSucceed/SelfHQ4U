# 🌟 Project Name

SelfHQ

## 🎯 Project Mission

Create a modern platform that helps people:

- Identify and define their values, vision, and mission
- Discover and build habits that align with their values and support their vision and mission
- Connect with like-minded people, mentors, service providers, product vendors, and event organizers
- Track their personal development
- Set, follow, and share challenges
- Use AI agents for personalized guidance (agents can be provided by external providers too)
- Get personalized recommendations
- Purchase or offer free/paid habits, challenges, or entire life change programs

⚡ The platform should help service providers and event organizers reach the right audience efficiently.

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router, TypeScript, Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Hosting**: Vercel
- **Payments**: Planned Stripe integration
- **Affiliate Marketing**: Planned partner link tracking

## ⚙ Architecture Notes

- API via Supabase client (src/lib/supabase.ts)
- RLS (Row Level Security) protects data access
- Supabase Auth manages all user roles
- App designed for future extension (e.g. mobile, smartwatches, smartglasses, integrations)

## 👥 User Roles

### Registered user:
- Can create, share, and follow free or paid habits or challenges.
- Can connect with other users.
- Can purchase habits, challenges, or habit packs.

### Paid content provider (Mentor/Coach):
- Can offer paid habits, challenges, programs, or AI agents.
- Can create content and connect with users.
- Can offer paid services.
- Can advertise, offer services/products/events/other, and reach their audience.

### Admin:
- Moderates content and ensures platform integrity.

## 📌 Main Categories

1️⃣ Values, Vision, Mission
2️⃣ Body & Physique
3️⃣ Mind & Mental
4️⃣ Rest & Sleep
5️⃣ Nutrition & Hydration
6️⃣ Social Interaction
7️⃣ Time & Environment
8️⃣ Finance & Business
9️⃣ Skills, Characteristics & Beliefs

## 🔑 Security & Compliance

- Code must meet ESLint and Prettier standards
- GDPR and other data protection regulations fully respected
- Sensitive operations secured via RLS, validated inputs, and auth
- Environment variables secured
- No private keys in frontend code

## 📲 Future Extensibility

- Platform must support easy extension into mobile apps, smartwatch apps, smartglasses, IoT devices
- Easy integration with calendars, productivity apps, and other ecosystems

## 📝 Claude Instructions

1️⃣ Stick to the tech stack unless explicitly told otherwise
2️⃣ All code must be production-ready TypeScript compatible with Next.js App Router
3️⃣ Ensure DB structures work with Supabase Postgres
4️⃣ Prioritize security, RLS, and data privacy
5️⃣ Provide clear, copy-paste code or commands — no fluff
6️⃣ Make code clean, minimal, and maintainable
7️⃣ Use modern Next.js + Tailwind conventions
8️⃣ Align component suggestions with provided Figma (unfinished draft)
9️⃣ Consider future scalability and cross-device support

## 🎨 Design & Brand Guidelines

### 🎨 Visual Identity

SelfHQ should evoke exclusivity, prestige, and modern sophistication.

✅ Use premium gradients, subtle shadows, and refined typography  
✅ Implement glassmorphism effects (backdrop-blur, transparency)  
✅ Apply a luxury color palette with deep blues, elegant grays, and accent teals  
✅ Prioritize clean, minimal layouts with generous whitespace  
✅ Integrate polished micro-interactions and smooth animations  
✅ All components and interactions should feel premium and intentional  
✅ The look and feel should appeal to high achievers, ambitious professionals, and those seeking a top-tier experience  

### 🌈 Color Palette

| Color Name | Hex Code | Purpose |
|------------|----------|---------|
| Primary Blue | #2563EB | Main CTAs, buttons, links |
| Royal Purple | #7C3AED | Accent color, gradient stop |
| Teal Accent | #14B8A6 | Highlights, success states |
| Deep Navy | #0F172A | Headings, dark sections, contrast |
| Elegant Gray | #F1F5F9 | Backgrounds, cards |
| White | #FFFFFF | Base background, clean canvas |
| Soft Shadow Gray | #CBD5E1 | Shadows, subtle borders or dividers |

**✨ Gradient examples:**
- `bg-gradient-to-r from-[#2563EB] to-[#7C3AED]`
- `bg-gradient-to-r from-[#2563EB] to-[#14B8A6]`

### 🧩 Component Guidelines

- **Buttons:** Gradient backgrounds, rounded-xl, shadow-md, hover:scale-105, hover:brightness-110
- **Cards / Modules:** Glassmorphism: bg-white/30 + backdrop-blur-md, rounded-2xl, shadow-lg
- **Navigation:** Transparent navbar with blur on scroll, minimal active indicators
- **Progress bars:** rounded-full, gradient fill for progress
- **Typography:** Clean geometric sans (e.g. Inter, Poppins, Outfit), strong hierarchy, large clear headings

### ⚙ Tailwind Config Snippet

```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      accent: '#14B8A6',
      navy: '#0F172A',
      grayElegant: '#F1F5F9',
      shadowGray: '#CBD5E1',
    },
  },
},
```

### ✨ Interaction Design

✅ All UI elements should have clear, subtle animations:
- **Buttons:** scale, brightness change
- **Cards:** slight lift on hover
- **Progress indicators:** smooth fill animations
- **Transitions:** ease-in-out, duration-300 or smoother

**👉 Summary:**  
The entire interface should feel clean, purposeful, and elite — users should sense they're in a premium environment where every interaction is thoughtfully crafted.

## 🚀 Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout with AuthProvider
├── components/
│   └── auth/              # Authentication components
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
└── lib/
    ├── supabase.ts        # Supabase client configuration
    └── auth.ts            # Authentication utilities
```

## 🔐 Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ✅ Current Implementation Status

- [x] Supabase integration
- [x] User authentication (register/login/logout)
- [x] Protected routes
- [x] Authentication context
- [x] Responsive UI components
- [ ] User profiles
- [ ] Habit tracking system
- [ ] Social features
- [ ] Payment integration
- [ ] AI agent integration