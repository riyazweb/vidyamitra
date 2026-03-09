import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Cpu, 
  Zap, 
  BarChart3, 
  BookOpen,
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const API = 'http://localhost:8002';

  // Demo skills for comparison - in real app, these would come from the user's resume or profile
  const currentSkills = ['React', 'Python', 'SQL', 'Node.js', 'Rest API'];

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/skills/compare-roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSkills })
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error('Failed to load data');
      }
    } catch (err) {
      setError('Could not connect to Gemini AI. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssessRole = async (roleName) => {
    setAssessing(true);
    setSelectedRole(roleName);
    try {
      const response = await fetch(`${API}/api/skills/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skills: currentSkills,
          targetRole: roleName,
          experienceLevel: "Entry-level"
        })
      });
      const result = await response.json();
      if (result.success) {
        setAssessmentResult(result.data);
      }
    } catch (err) {
      setError('AI assessment failed.');
    } finally {
      setAssessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="animate-spin text-primary-600" size={48} />
        <p className="text-xl font-bold text-gray-700">Gemini AI is analyzing market roles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="bg-white rounded-2xl p-8 border-2 border-primary-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">AI Skill Assessment</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Our Gemini AI engine compares your current skills against {data?.comparisons?.length || 5} high-demand industry roles.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl flex items-center gap-4 text-red-700">
          <AlertCircle size={32} />
          <div>
            <p className="font-bold text-lg">Backend Connection Error</p>
            <p>Please ensure the FastAPI server is running on port 8002.</p>
          </div>
        </div>
      )}

      {/* Top Recommendation */}
      {data?.topRecommendation && (
        <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl transform transition hover:scale-[1.01]">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm border border-white/30">
              <Award size={64} className="text-yellow-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="fill-yellow-400 text-yellow-400" size={20} />
                <span className="font-bold tracking-widest uppercase text-sm text-primary-100">AI Top Pick</span>
              </div>
              <h2 className="text-3xl font-black mb-4">You're a strong match for {data.topRecommendation}!</h2>
              <p className="text-primary-50 text-lg leading-relaxed mb-6">
                {data.reasoning}
              </p>
              <button 
                onClick={() => handleAssessRole(data.topRecommendation)}
                className="px-8 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition flex items-center gap-2"
              >
                Deep Dive Assessment <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.comparisons?.map((role, idx) => (
          <div 
            key={idx} 
            className={`bg-white rounded-2xl border-2 transition-all p-6 relative group ${
              selectedRole === role.role ? 'border-primary-500 shadow-md ring-2 ring-primary-100' : 'border-gray-100 hover:border-primary-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">{role.role}</h3>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-black flex items-center gap-1 border border-green-100">
                <Target size={16} />
                {role.match}%
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">Key Strengths</p>
                <div className="flex flex-wrap gap-1">
                  {role.strengths?.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-semibold">{s}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">Missing Capabilities</p>
                <div className="flex flex-wrap gap-1">
                  {role.missingSkills?.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md font-semibold">{s}</span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-gray-500">
                  <TrendingUp size={14} />
                  <span className="text-xs font-bold">{role.avgSalary}</span>
                </div>
                <div className="text-xs font-bold text-primary-600">{role.timeToReady} Prep</div>
              </div>
            </div>

            <button 
              onClick={() => handleAssessRole(role.role)}
              disabled={assessing && selectedRole === role.role}
              className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-primary-600 hover:text-white transition flex items-center justify-center gap-2 group-hover:bg-primary-600 group-hover:text-white"
            >
              {assessing && selectedRole === role.role ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                'Run Gap Analysis'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Deep Dive Results */}
      {assessmentResult && (
        <div id="deep-dive" className="bg-white rounded-3xl border-2 border-primary-100 shadow-2xl p-10 mt-12 animate-slideUp">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Detailed Gap Analysis: {selectedRole}</h2>
              <div className="bg-primary-100 text-primary-700 px-4 py-1 rounded-full font-bold inline-block text-sm">
                Confidence Match: {assessmentResult.overallMatch}%
              </div>
            </div>
            <button 
              onClick={() => navigate('/training')} 
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-2"
            >
              Start Learning Path <BookOpen size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <section>
                <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-500" />
                  Your Top Assets
                </h4>
                <div className="space-y-4">
                  {assessmentResult.strengths?.map((s, i) => (
                    <div key={i} className="p-4 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{s.skill}</p>
                        <p className="text-sm text-green-700">{s.relevance}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-black rounded-lg">{s.level}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-500" />
                  Market Demand Context
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {assessmentResult.marketDemand?.map((m, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <span className="font-bold text-gray-800">{m.skill}</span>
                      <div className="text-right">
                        <p className="text-blue-600 font-black text-sm">{m.demand} Demand</p>
                        <p className="text-xs text-blue-400">{m.salaryImpact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-500" />
                  Critical Learning Gaps
                </h4>
                <div className="space-y-4">
                  {assessmentResult.gaps?.map((g, i) => (
                    <div key={i} className="p-5 bg-red-50 rounded-3xl border border-red-100 relative overflow-hidden group">
                      <div className="relative z-10 flex justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-red-900 text-xl">{g.skill}</p>
                          <p className="text-red-600 text-sm mb-2">{g.timeToLearn} to master</p>
                          <p className="text-gray-600 text-sm leading-relaxed bg-white/50 p-2 rounded-lg italic">
                            Resources: {g.resources}
                          </p>
                        </div>
                        <span className={`px-4 py-1 h-fit font-black text-xs uppercase rounded-full ${
                          g.priority === 'High' ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900'
                        }`}>
                          {g.priority} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-gray-50 rounded-3xl p-6 border-2 border-dashed border-gray-200">
                <h4 className="font-black text-gray-900 mb-2 italic">Gemini Verdict</h4>
                <p className="text-gray-600 leading-relaxed italic">
                  "{assessmentResult.verdict}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
