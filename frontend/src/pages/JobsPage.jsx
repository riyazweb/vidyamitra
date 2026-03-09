import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  CheckCircle, 
  Star, 
  Send,
  Zap,
  Globe,
  RefreshCw,
  Building,
  Target,
  Award,
  Filter
} from 'lucide-react';

const JobsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: 'Full Stack Developer',
    location: 'Remote',
    experience: '2 years'
  });

  const API = 'http://localhost:8002';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/api/jobs/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skills: ['React', 'Python', 'SQL', 'Node.js'],
          targetRole: filters.role,
          location: filters.location,
          experience: filters.experience
        })
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      setError('Gemini AI job engine is currently offline.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Briefcase className="w-20 h-20 text-primary-600 animate-bounce" />
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl border border-primary-100 shadow-lg">
             <Search size={24} className="text-secondary-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Scanning Global Markets...</p>
          <p className="text-gray-500 font-bold">Gemini AI is filtering 8,000+ listings for your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-20">
      {/* Header & Filters */}
      <div className="bg-white rounded-3xl p-10 border-2 border-primary-50 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-50 rounded-full -mr-48 -mt-48 opacity-30"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">
          <div className="text-center xl:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center xl:justify-start">
               <Zap className="fill-yellow-400 text-yellow-400" size={20} />
               <span className="font-black text-xs uppercase tracking-widest text-primary-500">AI-Personalized Job Feed</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">Your Next Career Move</h1>
            <p className="text-gray-500 text-lg max-w-xl font-medium leading-relaxed">
              We've analyzed your resume and combined it with market trends to find these high-relevance roles.
            </p>
          </div>

          <div className="w-full xl:w-auto bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Position</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    value={filters.role}
                    onChange={(e) => setFilters({...filters, role: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-bold text-gray-700 text-sm"
                  />
                </div>
             </div>
             <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Region</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-bold text-gray-700 text-sm"
                  />
                </div>
             </div>
             <div className="flex items-end">
                <button 
                  onClick={fetchJobs}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-black hover:bg-primary-700 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Filter size={18} /> Update Feed
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats Column */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-3xl p-6 border-2 border-primary-50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full -mr-8 -mt-8"></div>
             <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-500" /> Market Insights
             </h3>
             <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Average Salary (AI Projection)</p>
                   <p className="text-2xl font-black text-gray-900">{data?.insights?.avgSalary}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">High Demand Skills</p>
                   <div className="flex flex-wrap gap-2">
                      {data?.insights?.hotSkills?.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-black rounded-lg border border-primary-100">{s}</span>
                      ))}
                   </div>
                </div>
                <div className="pt-4 border-t border-gray-50">
                   <div className="flex items-start gap-2">
                      <Target size={16} className="text-secondary-500 mt-1" />
                      <p className="text-xs font-bold text-gray-500 leading-relaxed italic">"{data?.insights?.marketTrend}"</p>
                   </div>
                </div>
             </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-primary-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h4 className="font-black mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest"><Building size={14} /> Top Hiring Nodes</h4>
              <div className="space-y-3 relative z-10">
                 {data?.insights?.topCompanies?.map((c, i) => (
                   <div key={i} className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                      <span className="font-bold text-sm">{c}</span>
                      <TrendingUp size={12} className="text-green-300" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Jobs Feed Column */}
        <div className="lg:col-span-3 space-y-6">
           <div className="flex justify-between items-center mb-4">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Found {data?.jobs?.length} matching results</p>
              <div className="text-xs font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">Live AI Syncing</div>
           </div>

           <div className="grid grid-cols-1 gap-6">
             {data?.jobs?.map((job, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 border-2 border-transparent hover:border-primary-100 shadow-sm hover:shadow-2xl transition-all group relative">
                   <div className="absolute top-8 right-8 bg-green-50 text-green-700 px-4 py-2 rounded-2xl font-black text-sm border border-green-100 flex items-center gap-1 group-hover:scale-110 transition-transform">
                      <Star size={14} className="fill-green-500 text-green-500" />
                      {job.match}% Fit
                   </div>

                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-primary-50 transition-colors">
                         <Building size={32} className="text-gray-200 group-hover:text-primary-300 transition-colors" />
                      </div>
                      <div className="flex-1">
                         <div className="mb-6">
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition mb-1">{job.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                               <div className="flex items-center gap-1"><Building size={14} /> {job.company}</div>
                               <div className="flex items-center gap-1"><MapPin size={14} /> {job.location}</div>
                               <div className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</div>
                            </div>
                         </div>

                         <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 group-hover:bg-white transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                               <Zap size={14} className="text-primary-600" />
                               <span className="text-[10px] font-black uppercase text-primary-600 tracking-widest">Why it matches you</span>
                            </div>
                            <p className="text-sm font-bold text-gray-600 italic">"{job.whyGoodFit}"</p>
                         </div>

                         <div className="flex flex-wrap gap-2 mb-8">
                            {job.skills?.map((s, i) => (
                               <span key={i} className="px-3 py-1 bg-white text-gray-500 text-xs font-bold rounded-lg border border-gray-100">{s}</span>
                            ))}
                         </div>

                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-50">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                               <Globe size={12} /> Posted {job.posted} ago • {job.applicants} applicants
                            </p>
                            <div className="flex gap-4 w-full sm:w-auto">
                               <button className="flex-1 sm:px-8 py-3 bg-gray-900 px-4 text-white rounded-xl font-black hover:bg-primary-600 transition shadow-lg flex items-center justify-center gap-2">
                                  Quick Apply <Send size={16} />
                               </button>
                               <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary-50 hover:text-primary-600 border border-transparent hover:border-primary-100 transition">
                                  <Star size={20} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
