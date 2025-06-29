'use client'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

const developmentModules = [
  {
    id: 1,
    title: 'Values, Vision, Mission',
    description: 'Define your core values, craft a compelling vision, and establish your life mission.',
    progress: 25,
    icon: '⭐',
    color: 'bg-purple-500'
  },
  {
    id: 2,
    title: 'Body & Physique',
    description: 'Build strength, flexibility, and overall physical wellbeing through tailored practices.',
    progress: 40,
    icon: '❤️',
    color: 'bg-red-500'
  },
  {
    id: 3,
    title: 'Mind & Mental',
    description: 'Develop cognitive abilities, emotional intelligence, and mental resilience.',
    progress: 60,
    icon: '🧠',
    color: 'bg-blue-500'
  },
  {
    id: 4,
    title: 'Rest & Sleep',
    description: 'Optimize your rest patterns for recovery, rejuvenation, and peak performance.',
    progress: 30,
    icon: '🌙',
    color: 'bg-indigo-500'
  },
  {
    id: 5,
    title: 'Nutrition & Hydration',
    description: 'Fuel your body with intentional nutrition and proper hydration habits.',
    progress: 45,
    icon: '🥗',
    color: 'bg-green-500'
  },
  {
    id: 6,
    title: 'Social Interaction',
    description: 'Cultivate meaningful relationships and enhance your social intelligence.',
    progress: 35,
    icon: '👥',
    color: 'bg-yellow-500'
  },
  {
    id: 7,
    title: 'Time & Environment',
    description: 'Master time management and design environments that support your goals.',
    progress: 20,
    icon: '⏰',
    color: 'bg-teal-500'
  },
  {
    id: 8,
    title: 'Finance & Business',
    description: 'Build financial literacy and develop sustainable wealth creation strategies.',
    progress: 50,
    icon: '💰',
    color: 'bg-green-600'
  },
  {
    id: 9,
    title: 'Skills, Characteristics & Beliefs',
    description: 'Acquire valuable skills and develop empowering beliefs and characteristics.',
    progress: 15,
    icon: '🎯',
    color: 'bg-orange-500'
  }
]

export default function DashboardPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">SelfHQ</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#" className="text-gray-900 font-medium">Dashboard Preview</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </nav>
            
            {/* CTA */}
            <div className="flex items-center gap-4">
              <a href="/register" className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg">
                Reserve Your SelfHQ
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Reserve Button */}
      <div className="text-center py-8 bg-gradient-to-r from-teal-500/10 to-blue-600/10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Experience Your Elite Dashboard
          </h1>
          <p className="text-gray-600 mb-6 text-lg">Preview the sophisticated interface designed for high achievers</p>
          <a 
            href="/register" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-xl"
          >
            Reserve Your SelfHQ Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Dashboard Preview */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Development Modules
            </h2>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Premium Dashboard
            </div>
          </div>
          
          {/* Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {developmentModules.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Icon and Progress */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                    {module.icon}
                  </div>
                  <span className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-full">
                    {module.progress}% Complete
                  </span>
                </div>
                
                {/* Title and Description */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">{module.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Continue Button */}
                <button className="w-full flex items-center justify-center gap-2 text-gray-900 font-medium hover:text-teal-600 transition-colors group py-2 px-4 rounded-lg hover:bg-gray-50">
                  <span>Continue Journey</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="text-center py-12 bg-gradient-to-r from-teal-500/10 to-blue-600/10">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Ready to Transform Your Life?
          </h3>
          <p className="text-gray-600 mb-6">Join the exclusive community of high achievers</p>
          <a 
            href="/register" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-xl"
          >
            Reserve Your SelfHQ Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}