'use client'


interface WelcomePopupProps {
  isOpen: boolean
  onClose: () => void
  onStartAssessment: () => void
  onSkipAssessment: () => void
}

export default function WelcomePopup({ isOpen, onClose, onStartAssessment, onSkipAssessment }: WelcomePopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 max-w-lg w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Welcome content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">S</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome to your SelfHQ!
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-2">
            🎉 Welcome to the exclusive ecosystem!
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            You're now part of an elite community dedicated to holistic personal development. 
            To get you started on your transformation journey, we recommend beginning with our 
            comprehensive assessment.
          </p>

          {/* Assessment info */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 mb-8 border border-teal-200">
            <h3 className="font-semibold text-gray-900 mb-3">Default Assessment Includes:</h3>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span>
                Values reflection and identification
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span>
                Vision crafting exercise
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span>
                Mission statement development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600">✓</span>
                Personalized recommendations based on your profile
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={onStartAssessment}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Start Assessment & Foundation Building
            </button>
            
            <button
              onClick={onSkipAssessment}
              className="w-full text-gray-600 hover:text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors border border-gray-200 hover:border-gray-300"
            >
              Skip for now - I'll explore at my own pace
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-6">
            You can always access the assessment later through the Values, Vision, Mission module.
          </p>
        </div>
      </div>
    </div>
  )
}