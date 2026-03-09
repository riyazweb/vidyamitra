import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  TrendingUp, 
  Cpu,
  Github,
  Linkedin,
  Mail,
  RefreshCw,
  BookOpen,
  Mic,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const API = 'http://localhost:8002';

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API}/api/resume/analyze`, {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || 'Failed to analyze resume. Please try again.');
      }

      setResults(payload.data);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 border-2 border-primary-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Resume AI Analyzer</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Upload your resume and let our Gemini AI provide instant medical professional evaluation and industry matching.
          </p>
        </div>
      </div>

      {!results ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileSelect}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
              <Upload size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {file ? file.name : "Choose your resume (PDF)"}
              </h3>
              <p className="text-gray-500 mt-1 italic">Professional parsing by Gemini Advanced</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {!file ? (
              <label
                htmlFor="resume-upload"
                className="mt-4 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition transform hover:-translate-y-1 shadow-lg cursor-pointer"
              >
                Browse Files
              </label>
            ) : (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition transform hover:-translate-y-1 shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Cpu size={20} />
                      Power Analyze
                    </>
                  )}
                </button>
                <button
                  onClick={() => setFile(null)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 pb-12">
          {/* Header Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-primary-50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-green-50 rounded-xl text-green-600">
                <Star size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall Score</p>
                <p className="text-3xl font-black text-gray-900">{results.score}/100</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border-2 border-primary-50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
                <TrendingUp size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">ATS Friendly</p>
                <p className="text-3xl font-black text-gray-900">{results.atsScore}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-primary-50 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-purple-50 rounded-xl text-purple-600">
                <Cpu size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Industry Fit</p>
                <p className="text-3xl font-black text-gray-900">Premium</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Technical Breakdown */}
            <div className="lg:col-span-2 space-y-8">
              {/* Identified Skills */}
              <div className="bg-white rounded-2xl border-2 border-primary-50 shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="text-green-500" />
                  Skills Recognized by Gemini AI
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.skills?.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-semibold flex items-center gap-2">
                      <Star size={14} className="fill-primary-200" />
                      {skill.name || skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Critical Gaps */}
              <div className="bg-white rounded-2xl border-2 border-primary-50 shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AlertCircle className="text-red-500" />
                  Critical Industry Gaps
                </h3>
                <div className="space-y-4">
                  {results.gaps?.map((gap, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
                      <div className="text-red-500 font-bold">0{i+1}.</div>
                      <p className="text-gray-700">{gap.skill || gap.reason || gap}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recommendations */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award />
                  Gemini Verdict
                </h3>
                <p className="text-primary-50 leading-relaxed mb-6">
                  "Your resume demonstrates strong technical foundations. However, to advance in senior medical logistics, consider emphasizing your experience with regulatory compliance and modern ERP systems."
                </p>
                <div className="space-y-3">
                  <button onClick={() => navigate('/skills')} className="w-full py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-opacity-90 transition">
                    Fix Missing Skills
                  </button>
                  <button onClick={() => navigate('/training')} className="w-full py-3 border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition">
                    View Course Route
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-primary-50 p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4">Improve for Next Cycle</h4>
                <p className="text-gray-500 text-sm mb-4">Our AI can rewrite sections of your resume to better match target JD descriptions.</p>
                <button onClick={() => navigate('/jobs')} className="text-primary-600 font-bold hover:underline flex items-center gap-2">
                  Search Compatible Jobs <TrendingUp size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div onClick={() => navigate('/skills')} className="card text-center cursor-pointer hover:shadow-lg transition bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-2xl">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <h4 className="font-bold text-gray-900">Skill Assessment</h4>
              <p className="text-sm text-gray-500 mt-1">AI gap analysis →</p>
            </div>
            <div onClick={() => navigate('/training')} className="card text-center cursor-pointer hover:shadow-lg transition bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-2xl">
              <BookOpen className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <h4 className="font-bold text-gray-900">Training Plan</h4>
              <p className="text-sm text-gray-500 mt-1">Personalized learning →</p>
            </div>
            <div onClick={() => navigate('/interview')} className="card text-center cursor-pointer hover:shadow-lg transition bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-2xl">
              <Mic className="w-10 h-10 text-purple-500 mx-auto mb-2" />
              <h4 className="font-bold text-gray-900">Mock Interview</h4>
              <p className="text-sm text-gray-500 mt-1">AI practice →</p>
            </div>
          </div>

          <button onClick={reset} className="w-full py-3 border-2 border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition">
            ↑ Analyze Another Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumePage;
