export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-2xl font-bold">SelfHQ</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
          <a href="/register" className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-16 max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
            Begin Your Journey
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-8">
          Welcome to your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SelfHQ
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          SelfHQ is your framework for a meaningful, fulfilled, and successful life. 
          Do you feel like you have no time to truly live? The solution often lies in 
          clarity, prioritization, and efficiency.
        </p>
        
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Whatever path you choose, the journey is yours to shape — and SelfHQ gives you 
          the tools to take it in your direction. Whether you&#39;re focused on building a business, 
          nurturing relationships, developing healthy habits, managing your finances, or simply 
          finding balance, SelfHQ helps you grow holistically — across all aspects of life.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="/register" className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-90 flex items-center gap-2 shadow-xl">
            Request to open your HQ
            <span>→</span>
          </a>
          <a href="/dashboard-preview" className="text-gray-900 font-medium text-lg hover:text-gray-700 flex items-center gap-2">
            See example of the dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">Self-awareness</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">Goal tracking</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">Life balance</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">AI tools and agents</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">Goal suggestions</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">Third-party integrations</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">Your annual strategy</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 text-sm">Your annual statement</h3>
          </div>
        </div>
      </section>

      {/* Comprehensive Development Framework */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Development Framework</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start using a holistic approach addressing all dimensions of personal growth to help you achieve balance and fulfillment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Values, Vision, Mission */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Values, Vision, Mission</h3>
            <p className="text-gray-600">
              Define your core values, craft a compelling vision, and establish your life mission.
            </p>
          </div>
          
          {/* Body & Physique */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Body & Physique</h3>
            <p className="text-gray-600">
              Build strength, flexibility, and overall physical wellbeing through tailored practices.
            </p>
          </div>
          
          {/* Mind & Mental */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mind & Mental</h3>
            <p className="text-gray-600">
              Develop cognitive abilities, emotional intelligence, and mental resilience.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Rest & Sleep */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Rest & Sleep</h3>
            <p className="text-gray-600">
              Optimize your rest patterns for recovery, rejuvenation, and peak performance.
            </p>
          </div>
          
          {/* Nutrition & Hydration */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nutrition & Hydration</h3>
            <p className="text-gray-600">
              Fuel your body with intentional nutrition and proper hydration habits.
            </p>
          </div>
          
          {/* Social Interaction */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Social Interaction</h3>
            <p className="text-gray-600">
              Cultivate meaningful relationships and enhance your social intelligence.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Time & Environment */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Time & Environment</h3>
            <p className="text-gray-600">
              Master time management and design environments that support your goals.
            </p>
          </div>
          
          {/* Finance & Business */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Finance & Business</h3>
            <p className="text-gray-600">
              Build financial literacy and develop sustainable wealth creation strategies.
            </p>
          </div>
          
          {/* Skills, Characteristics & Beliefs */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Skills, Characteristics & Beliefs</h3>
            <p className="text-gray-600">
              Acquire valuable skills and develop empowering beliefs and characteristics.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How It Works</h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            It&#39;s your life and your journey. You create, tailor & adjust it as you wish. SelfHQ just provides a 
            personalised holistic methodology designed to support and guide you through consistent, meaningful 
            progress across all areas of life based on your values, vision and mission.
          </p>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Set up your personal profile and identify your starting point across all development modules.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Set Module Goals</h3>
              <p className="text-gray-600">
                Establish specific, measurable goals for each area of development that align with your vision.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your advancement with our intuitive tracking tools and adjust your approach as needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Your Thoughts */}
      <section className="px-8 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your Thoughts</h2>
          <p className="text-gray-600">
            We value your feedback and suggestions to improve SelfHQ.
          </p>
        </div>
        
        <div className="space-y-4">
          <textarea
            placeholder="Your ideas, suggestions or feedback..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
          <button className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90">
            Submit Feedback
          </button>
        </div>
      </section>

      {/* Pilot Program Section */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Pilot Program</h2>
          <p className="text-gray-600 mb-8">
            Be among the first to experience SelfHQ when we launch our MVP. Sign up now for free early access.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90">
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-2xl font-bold">SelfHQ</span>
              </div>
              <p className="text-gray-600 text-sm">
                Empowering you to grow in all dimensions of life through structured development and meaningful progress.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Dashboard</a></li>
                <li><a href="#" className="hover:text-gray-900">Profile</a></li>
                <li><a href="#" className="hover:text-gray-900">About</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">FAQs</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms & Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Instagram</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-600">© 2025 SelfHQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
