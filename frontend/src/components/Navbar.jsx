import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar({ onLogout }) {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    // Get user name from localStorage or state
    const storedEmail = localStorage.getItem('userEmail')
    if (storedEmail) {
      const name = storedEmail.split('@')[0]
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    onLogout()
    navigate('/login')
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogoClick}
            className="logo-container hover:opacity-75 transition-opacity"
            title="Go to Dashboard"
          >
            <img 
              src="/assets/logo.svg" 
              alt="VidyaMitra Logo" 
              className="nav-logo"
            />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 btn-secondary px-3 py-2 font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
