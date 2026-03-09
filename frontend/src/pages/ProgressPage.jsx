import { useState } from 'react'
import { TrendingUp, Award, Flame, Target, CheckCircle, Calendar } from 'lucide-react'

export default function ProgressPage() {
  const [timeframe, setTimeframe] = useState('week')

  const progressData = {
    fullName: 'Sarah Johnson',
    joinDate: 'January 15, 2025',
    totalHours: 125,
    currentStreak: 12,
    longestStreak: 28,
    overallProgress: 68,
    level: 'Intermediate Learner'
  }

  const courses = [
    {
      id: 1,
      name: 'Python Fundamentals',
      progress: 100,
      completed: true,
      completedDate: 'Feb 10, 2025',
      timeSpent: '32 hours',
      score: 95,
      modules: 12,
      modulesCompleted: 12
    },
    {
      id: 2,
      name: 'Web Development with React',
      progress: 65,
      completed: false,
      timeSpent: '28 hours',
      modules: 18,
      modulesCompleted: 12
    },
    {
      id: 3,
      name: 'Data Structures Essentials',
      progress: 45,
      completed: false,
      timeSpent: '18 hours',
      modules: 15,
      modulesCompleted: 7
    },
    {
      id: 4,
      name: 'Machine Learning Basics',
      progress: 20,
      completed: false,
      timeSpent: '12 hours',
      modules: 14,
      modulesCompleted: 3
    },
    {
      id: 5,
      name: 'Database Design & SQL',
      progress: 85,
      completed: false,
      timeSpent: '25 hours',
      modules: 13,
      modulesCompleted: 11
    },
    {
      id: 6,
      name: 'Backend Development with Node.js',
      progress: 35,
      completed: false,
      timeSpent: '10 hours',
      modules: 16,
      modulesCompleted: 6
    }
  ]

  const skills = [
    { name: 'Python', level: 'Advanced', proficiency: 90 },
    { name: 'JavaScript', level: 'Intermediate', proficiency: 72 },
    { name: 'React', level: 'Intermediate', proficiency: 68 },
    { name: 'SQL', level: 'Intermediate', proficiency: 75 },
    { name: 'Problem Solving', level: 'Intermediate', proficiency: 70 },
    { name: 'Git', level: 'Beginner', proficiency: 55 },
    { name: 'Web Development', level: 'Intermediate', proficiency: 65 },
    { name: 'Data Structures', level: 'Beginner', proficiency: 50 }
  ]

  const quizScores = [
    { name: 'Python Basics', score: 95, date: 'Mar 8, 2025' },
    { name: 'Data Structures', score: 82, date: 'Mar 7, 2025' },
    { name: 'Web Development', score: 88, date: 'Mar 6, 2025' },
    { name: 'SQL Queries', score: 91, date: 'Mar 5, 2025' },
    { name: 'Algorithms', score: 78, date: 'Mar 4, 2025' },
    { name: 'AI Concepts', score: 85, date: 'Mar 3, 2025' }
  ]

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first module', icon: '🚀', unlocked: true, date: 'Jan 18, 2025' },
    { id: 2, name: 'Python Master', description: 'Complete Python Fundamentals course', icon: '🐍', unlocked: true, date: 'Feb 10, 2025' },
    { id: 3, name: 'Week Warrior', description: 'Maintain 7-day learning streak', icon: '⚡', unlocked: true, date: 'Feb 15, 2025' },
    { id: 4, name: 'Quiz Legend', description: 'Score 90% on 5 quizzes', icon: '🏆', unlocked: true, date: 'Mar 2, 2025' },
    { id: 5, name: 'Code Contributor', description: 'Complete 3 coding challenges', icon: '💻', unlocked: false, date: null },
    { id: 6, name: 'Full Stack Developer', description: 'Complete Frontend + Backend courses', icon: '🌐', unlocked: false, date: null },
    { id: 7, name: 'AI Expert', description: 'Complete AI/ML courses', icon: '🤖', unlocked: false, date: null },
    { id: 8, name: 'Century Club', description: 'Learn 100+ hours', icon: '📚', unlocked: true, date: 'Mar 5, 2025' }
  ]

  const dailyActivity = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 2 },
    { day: 'Fri', hours: 4 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 2 }
  ]

  const maxHours = Math.max(...dailyActivity.map(d => d.hours))

  const stats = [
    { label: 'Courses Started', value: courses.length, icon: '📚' },
    { label: 'Courses Completed', value: courses.filter(c => c.completed).length, icon: '✅' },
    { label: 'Total Learning Hours', value: progressData.totalHours, icon: '⏱️' },
    { label: 'Current Streak', value: `${progressData.currentStreak} days`, icon: '🔥' },
    { label: 'Quiz Average', value: '86%', icon: '⭐' },
    { label: 'Achievements Earned', value: achievements.filter(a => a.unlocked).length, icon: '🏅' }
  ]

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">📊 My Progress</h1>
        <p className="text-gray-600 text-lg">Track your learning journey and celebrate your achievements</p>
      </div>

      {/* Welcome Card */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {progressData.fullName}! 👋</h2>
            <p className="text-gray-600 mb-3">Joined on {progressData.joinDate} • {progressData.level}</p>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-1">Overall Progress</p>
              <div className="w-64 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${progressData.overallProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{progressData.overallProgress}% Complete</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-600">{progressData.currentStreak}</p>
              <p className="text-xs text-gray-600">Day Streak</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">{progressData.longestStreak}</p>
              <p className="text-xs text-gray-600">Best Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="card bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-purple-600">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Weekly Activity</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {dailyActivity.map((activity, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-200 rounded-t hover:bg-blue-400 transition" style={{ height: `${(activity.hours / maxHours) * 120}px` }}></div>
              <p className="text-xs font-bold text-gray-600 mt-2">{activity.day}</p>
              <p className="text-xs text-gray-500">{activity.hours}h</p>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Progress */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Course Progress</h3>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{course.name}</h4>
                  <p className="text-sm text-gray-600">
                    {course.modulesCompleted} of {course.modules} modules • {course.timeSpent}
                  </p>
                </div>
                {course.completed && <CheckCircle className="w-6 h-6 text-green-600" />}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${course.completed ? 'bg-green-600' : 'bg-blue-600'}`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                <span>{course.progress}%</span>
                {course.completed && <span className="text-green-600 font-semibold">Completed - Score: {course.score}%</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Skills Proficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-900">{skill.name}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  skill.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                  skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {skill.level}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{skill.proficiency}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Scores */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">⭐ Recent Quiz Scores</h3>
        <div className="space-y-2">
          {quizScores.map((quiz, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{quiz.name}</p>
                <p className="text-xs text-gray-600">{quiz.date}</p>
              </div>
              <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                quiz.score >= 90 ? 'bg-green-100 text-green-700' :
                quiz.score >= 80 ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {quiz.score}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg text-center transition transform hover:scale-105 ${
                achievement.unlocked
                  ? 'bg-yellow-50 border-2 border-yellow-400 cursor-pointer'
                  : 'bg-gray-100 border-2 border-gray-300 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">{achievement.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
              {achievement.unlocked && (
                <p className="text-xs text-green-600 font-semibold">✓ {achievement.date}</p>
              )}
              {!achievement.unlocked && (
                <p className="text-xs text-gray-600">Locked</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg p-6">
        <h4 className="font-bold text-lg text-gray-900 mb-3">🎯 Your Learning Goals</h4>
        <ul className="space-y-2 text-gray-700">
          <li><strong>📅 Short-term:</strong> Complete React course by end of March</li>
          <li><strong>📅 Mid-term:</strong> Master Data Structures & Algorithms (90%+)</li>
          <li><strong>📅 Long-term:</strong> Transition to Software Engineer role</li>
          <li><strong>🔥 Streak Goal:</strong> Maintain 30-day learning streak</li>
        </ul>
      </div>
    </div>
  )
}
