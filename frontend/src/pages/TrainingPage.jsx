import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Map, 
  Award, 
  Cpu, 
  ChevronRight, 
  CheckCircle, 
  Play, 
  Star, 
  Zap, 
  Clock,
  TrendingUp,
  RefreshCw,
  Target,
  AlertCircle
} from 'lucide-react';

const TrainingPage = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [timeAvailable, setTimeAvailable] = useState('10 hours/week');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [activePhase, setActivePhase] = useState(0);

  const API = 'http://localhost:8002';

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/api/training/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetRole, 
          timeAvailable, 
          currentLevel,
          skills: ['React', 'Python'] // Dummy skills
        })
      });
      const result = await response.json();
      if (result.success) {
        setPlan(result.data);
        setActivePhase(0);
      }
    } catch (err) {
      setError('AI backend service is currently unreachable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Map className="w-20 h-20 text-primary-600 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center animate-spin">
             <Layers className="text-secondary-400" size={32} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900 uppercase tracking-widest">Architecting Your Path...</p>
          <p className="text-gray-500 font-bold">Gemini AI is calculating optimal learning curves</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl p-10 border-2 border-primary-100 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50 transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="bg-primary-600 p-8 rounded-3xl text-white shadow-2xl">
              <BookOpen size={80} className="drop-shadow-lg" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">AI Learning Roadmap</h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Gemini 2.5 parses industry demands and your schedule to build a minute-by-minute training curriculum tailored to your career goals.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Goal Role</label>
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Time Budget</label>
                  <select 
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700"
                  >
                    <option>5 hours/week</option>
                    <option>10 hours/week</option>
                    <option>20 hours/week</option>
                    <option>40 hours/week (Intensive)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Current Base</label>
                  <select 
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced Professional</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={generatePlan}
                className="w-full sm:w-auto px-12 py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition shadow-xl flex items-center justify-center gap-3"
              >
                <Zap fill="currentColor" size={20} />
                Generate Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* Left Sidebar - Plan Overview */}
        <div className="w-full lg:w-80 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white rounded-3xl p-6 border-2 border-primary-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="text-primary-600" /> Plan Profile
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Target</span>
                <span className="text-gray-900 font-black">{targetRole}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Duration</span>
                <span className="text-primary-600 font-black">{plan.duration}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Total Intensity</span>
                <span className="text-gray-900 font-black">{plan.totalHours} Hours</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 mb-2">
                 <Target className="text-secondary-600" size={16} />
                 <span className="font-black text-xs uppercase text-gray-400">Career Outcome</span>
              </div>
              <p className="text-sm font-bold text-gray-600 italic">"{plan.careerOutcome}"</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-primary-700 rounded-3xl p-6 text-white shadow-xl">
            <h4 className="font-black mb-4 flex items-center gap-2 uppercase text-xs tracking-widest"><TrendingUp size={16} /> Gemini Tips</h4>
            <div className="space-y-3">
              {plan.tips?.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm leading-relaxed text-blue-50">
                  <span className="font-black text-primary-200">0{i+1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={() => setPlan(null)} className="w-full py-4 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:border-red-500 hover:text-red-500 transition">Reset Plan</button>
        </div>

        {/* Main Content - Phases and Modules */}
        <div className="flex-1 space-y-8">
           <div className="bg-white rounded-3xl p-8 border-2 border-primary-50 shadow-sm">
              <h2 className="text-4xl font-black text-gray-900 mb-2">{plan.planTitle}</h2>
              <p className="text-gray-500 text-xl font-medium mb-10">{plan.overview}</p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                {plan.phases?.map((p, i) => (
                   <button 
                    key={i}
                    onClick={() => setActivePhase(i)}
                    className={`px-8 py-3 rounded-2xl font-black transition-all border-2 flex items-center gap-2 ${
                      activePhase === i ? 'bg-primary-600 text-white border-primary-600 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-primary-200'
                    }`}
                   >
                     Phase 0{p.phase}
                     <span className={`text-xs uppercase font-bold ${activePhase === i ? 'text-primary-100' : 'text-gray-300'}`}>{p.title}</span>
                   </button>
                ))}
              </div>

              {plan.phases && (
                <div className="space-y-8 animate-slideUp">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                       <h3 className="text-2xl font-black text-gray-900">{plan.phases[activePhase].title}</h3>
                       <p className="text-primary-500 font-black uppercase text-xs tracking-widest">{plan.phases[activePhase].duration} Exploration</p>
                    </div>
                    <div className="flex gap-2">
                       {plan.phases[activePhase].goals?.map((g, i) => (
                         <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-black border border-green-100">{g}</span>
                       ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {plan.phases[activePhase].modules?.map((m, i) => (
                      <div key={i} className="group bg-gray-50 rounded-3xl p-8 border-2 border-transparent hover:border-primary-100 hover:bg-white transition-all shadow-sm hover:shadow-xl">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-4">
                                <span className="bg-primary-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">{i+1}</span>
                                <h4 className="text-xl font-black text-gray-900">{m.title}</h4>
                             </div>
                             <p className="text-gray-500 font-bold mb-6 italic">"{m.description}"</p>
                             
                             <div className="flex flex-wrap gap-2 mb-6">
                               {m.topics?.map((t, idx) => (
                                 <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-500 border border-gray-100 shadow-sm">{t}</span>
                               ))}
                             </div>

                             <div className="p-4 bg-white/60 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-xs font-black text-primary-400 uppercase mb-2 flex items-center gap-1"><Star size={12} /> Key Project</p>
                                <p className="text-gray-700 font-bold">{m.projects[0]}</p>
                             </div>
                           </div>
                           <div className="w-full md:w-48 space-y-4">
                              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Duration</p>
                                <div className="flex items-center gap-2 text-primary-600 font-black">
                                   <Clock size={16} /> {m.duration}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Lessons</p>
                                <div className="flex items-center gap-2 text-indigo-600 font-black">
                                   <Layers size={16} /> {m.lessons} Units
                                </div>
                              </div>
                              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-primary-600 transition shadow-lg flex items-center justify-center gap-2">
                                <Play size={16} fill="currentColor" /> Preview
                              </button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
