import React, { useState } from 'react';
import { 
  Mic, 
  MessageSquare, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  Cpu, 
  Send,
  User,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';

const InterviewPage = () => {
  const [role, setRole] = useState('Full Stack Developer');
  const [level, setLevel] = useState('Entry-level');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API = 'http://localhost:8002';

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/api/interview/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, level, count: 5 })
      });
      const result = await response.json();
      if (result.success) {
        setQuestions(result.data.questions);
        setCurrentIndex(0);
        setEvaluation(null);
        setUserAnswer('');
      }
    } catch (err) {
      setError('AI backend is unavailable. Please verify API connection.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const response = await fetch(`${API}/api/interview/evaluate-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: questions[currentIndex].question,
          answer: userAnswer,
          role 
        })
      });
      const result = await response.json();
      if (result.success) {
        setEvaluation(result.data);
      }
    } catch (err) {
      setError('Evaluation failed.');
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setEvaluation(null);
      setUserAnswer('');
    } else {
      setCurrentIndex(-1);
      setQuestions([]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Cpu className="w-20 h-20 text-primary-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Mic size={32} className="text-primary-400" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">Gemini AI is preparing interview questions...</p>
          <p className="text-gray-500 italic">Personalizing scenario for {role}</p>
        </div>
      </div>
    );
  }

  if (currentIndex === -1) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl p-10 border-2 border-primary-100 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="bg-primary-600 p-8 rounded-3xl text-white shadow-2xl">
              <Mic size={80} className="drop-shadow-lg" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">AI Mock Interview</h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Connect your microphone or type your responses. Gemini AI will evaluate your answers against industry standards and provide actionable feedback.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Target Role</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:border-primary-500 focus:outline-none transition"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Experience Level</label>
                  <select 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:border-primary-500 focus:outline-none transition"
                  >
                    <option>Entry-level</option>
                    <option>Junior Role</option>
                    <option>Mid-level</option>
                    <option>Senior Management</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={startInterview}
                className="w-full sm:w-auto px-12 py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition shadow-xl flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <Play fill="currentColor" size={20} />
                Begin Simulation
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4"><Zap size={20} /></div>
            <h4 className="font-black text-gray-900">Real-time Feedback</h4>
            <p className="text-sm text-gray-500 mt-2 italic">Gemini scores your answers instantly based on professionalism and tech knowledge.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4"><Award size={20} /></div>
            <h4 className="font-black text-gray-900">STAR Method Analysis</h4>
            <p className="text-sm text-gray-500 mt-2 italic">AI checks if you provide Situation, Task, Action, and Result in your answers.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4"><Target size={20} /></div>
            <h4 className="font-black text-gray-900">Tailored Questions</h4>
            <p className="text-sm text-gray-500 mt-2 italic">Questions are dynamic and adapt to the role you specify.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      {/* Question Card */}
      <div className="bg-white rounded-3xl border-2 border-primary-50 shadow-2xl overflow-hidden">
        <div className="bg-primary-600 px-8 py-3 flex justify-between items-center">
          <span className="text-white font-black uppercase text-xs tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-primary-100 font-bold text-xs">{role} - {currentQ.category}</span>
        </div>
        
        <div className="p-10">
          <h2 className="text-2xl font-black text-gray-900 mb-8 leading-relaxed">
            {currentQ.question}
          </h2>
          
          <div className="mb-8">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
              <User size={12} /> Your Response
            </label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={evaluation}
              rows={6}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 font-medium text-gray-800 focus:border-primary-500 focus:outline-none transition resize-none text-lg leading-relaxed shadow-inner"
              placeholder="Start typing your response here or use voice-to-text..."
            />
          </div>

          <div className="flex gap-4">
            {!evaluation ? (
              <button
                onClick={submitAnswer}
                disabled={evaluating || !userAnswer.trim()}
                className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {evaluating ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
                Submit Answer for AI Review
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2 animate-bounceSubtle"
              >
                Next Question <ChevronRight size={20} />
              </button>
            )}
            <button className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition">
              <Mic />
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Feedback */}
      {evaluation && (
        <div className="bg-white rounded-3xl border-2 border-primary-100 shadow-2xl p-10 animate-slideUp">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Target size={32} className="text-primary-600" />
              AI Performance Analysis
            </h3>
            <div className="bg-primary-50 px-6 py-2 rounded-2xl border-2 border-primary-200">
              <p className="text-xs font-black text-primary-400 uppercase tracking-widest text-center">Score</p>
              <p className="text-3xl font-black text-primary-600">{evaluation.score}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <h4 className="font-black text-green-900 uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle size={14} /> Key Strengths
                </h4>
                <ul className="space-y-2">
                  {evaluation.strengths?.map((s, i) => (
                    <li key={i} className="text-green-800 font-bold text-sm flex items-center gap-2">• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h4 className="font-black text-red-900 uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                  <AlertCircle size={14} /> Room for Improvement
                </h4>
                <ul className="space-y-2">
                  {evaluation.improvements?.map((s, i) => (
                    <li key={i} className="text-red-800 font-bold text-sm flex items-center gap-2">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200">
              <h4 className="font-black text-gray-500 uppercase text-xs tracking-widest mb-4">Gemini Insight</h4>
              <p className="text-gray-900 font-bold text-lg leading-relaxed italic mb-6">
                "{evaluation.feedback}"
              </p>
              <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl">
                 <p className="text-xs font-bold text-gray-400 uppercase mb-2">Better Answer Sample</p>
                 <p className="text-gray-500 text-sm italic">{evaluation.sample_better_answer}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
