import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user data from API
    // const fetchUser = async () => { ... }
  }, [])

  return (
    <div className="fade-in">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">Welcome to VidyaMitra 🎓</h1>
      <p className="text-lg text-gray-600 mb-8">Your AI-Powered Career Intelligence Platform</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Resume Score', value: '85%', icon: '📄' },
          { title: 'Skills Assessed', value: '12', icon: '🎯' },
          { title: 'Quizzes Completed', value: '5', icon: '✅' },
          { title: 'Interview Progress', value: '3/10', icon: '🎤' },
        ].map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card hover:shadow-lg transition border-l-4 border-blue-500 cursor-pointer">
          <h2 className="text-2xl font-bold mb-4">📄 Resume Analysis</h2>
          <p className="text-gray-600 mb-4">Upload your resume for AI-powered analysis and skill gap identification.</p>
          <button 
            onClick={() => navigate('/resume')}
            className="btn-primary font-bold hover:shadow-lg transition w-full"
          >
            Analyze Resume →
          </button>
        </div>

        <div className="card hover:shadow-lg transition border-l-4 border-green-500 cursor-pointer">
          <h2 className="text-2xl font-bold mb-4">🎯 Skill Assessment</h2>
          <p className="text-gray-600 mb-4">Evaluate your current skills against job market demands.</p>
          <button 
            onClick={() => navigate('/skills')}
            className="btn-primary font-bold hover:shadow-lg transition w-full"
          >
            Start Assessment →
          </button>
        </div>

        <div className="card hover:shadow-lg transition border-l-4 border-purple-500 cursor-pointer">
          <h2 className="text-2xl font-bold mb-4">📚 Training Plans</h2>
          <p className="text-gray-600 mb-4">Get personalized learning paths tailored to your goals.</p>
          <button 
            onClick={() => navigate('/training')}
            className="btn-primary font-bold hover:shadow-lg transition w-full"
          >
            View Plans →
          </button>
        </div>

        <div className="card hover:shadow-lg transition border-l-4 border-orange-500 cursor-pointer">
          <h2 className="text-2xl font-bold mb-4">🎤 Mock Interviews</h2>
          <p className="text-gray-600 mb-4">Practice interviews with AI feedback and scoring.</p>
          <button 
            onClick={() => navigate('/interview')}
            className="btn-primary font-bold hover:shadow-lg transition w-full"
          >
            Start Interview →
          </button>
        </div>
      </div>

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition text-center cursor-pointer" onClick={() => navigate('/quiz')}>
          <div className="text-5xl mb-3">❓</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Section</h3>
          <p className="text-gray-600 mb-4">Test your knowledge with 20 questions</p>
          <button className="btn-primary w-full">Take Quiz</button>
        </div>

        <div className="card hover:shadow-lg transition text-center cursor-pointer" onClick={() => navigate('/jobs')}>
          <div className="text-5xl mb-3">💼</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Job Listings</h3>
          <p className="text-gray-600 mb-4">Browse 10+ matched opportunities</p>
          <button className="btn-primary w-full">View Jobs</button>
        </div>

        <div className="card hover:shadow-lg transition text-center cursor-pointer" onClick={() => navigate('/progress')}>
          <div className="text-5xl mb-3">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">My Progress</h3>
          <p className="text-gray-600 mb-4">Track your learning journey</p>
          <button className="btn-primary w-full">View Progress</button>
        </div>
      </div>
    </div>
  )
}
