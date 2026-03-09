import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Brain, 
  ChevronRight, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Star, 
  Zap, 
  Target,
  Clock,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const QuizPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);

  const API = 'http://localhost:8002';

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${API}/api/quiz/topics`);
      const result = await response.json();
      if (result.success) setTopics(result.topics);
    } catch (err) {
      setError('Could not connect to AI quiz engine.');
    }
  };

  const startQuiz = async (topic) => {
    setLoading(true);
    setError(null);
    setSelectedTopic(topic);
    try {
      const response = await fetch(`${API}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          difficulty,
          count: 5 
        })
      });
      const result = await response.json();
      if (result.success) {
        setQuizData(result.data.questions);
        setStartTime(Date.now());
        setCurrentQuestion(0);
        setScore(0);
        setShowResults(false);
      }
    } catch (err) {
      setError('AI failed to generate quiz. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    if (index === quizData[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
    setSelectedTopic(null);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Brain className="w-20 h-20 text-primary-600 animate-pulse" />
          <RefreshCw className="w-8 h-8 text-primary-400 animate-spin absolute -bottom-2 -right-2" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">Gemini AI is crafting questions...</p>
          <p className="text-gray-500 italic">Curating challenges for {selectedTopic}</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const percentage = Math.round((score / quizData.length) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl p-10 border-2 border-primary-100 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-lg" />
          <h2 className="text-4xl font-black text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-500 mb-8 font-medium">Topic: {selectedTopic} ({difficulty})</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <Star className="text-primary-600 mx-auto mb-2" />
              <p className="text-3xl font-black text-gray-900">{score}/{quizData.length}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Correct Answers</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <Clock className="text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-gray-900">{timeTaken}s</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Time Spent</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <Zap className="text-yellow-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-gray-900">{percentage}%</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Proficiency</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => startQuiz(selectedTopic)}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg flex items-center gap-2"
            >
              <RefreshCw size={20} /> Retry Topic
            </button>
            <button 
              onClick={resetQuiz}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Explore Other Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizData) {
    const question = quizData[currentQuestion];
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-slideUp">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-lg font-black text-sm uppercase tracking-wider">
              Question {currentQuestion + 1}/{quizData.length}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 font-bold">{selectedTopic}</span>
          </div>
          <button onClick={resetQuiz} className="text-gray-400 hover:text-red-500 font-bold text-sm transition">Exit Quiz</button>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-primary-50 shadow-xl">
          <h3 className="text-2xl font-black text-gray-900 mb-10 leading-relaxed">
            {question.question}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {question.options.map((opt, i) => {
              let style = "border-gray-100 hover:border-primary-400 bg-gray-50 hover:bg-white";
              let icon = <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition">{String.fromCharCode(65 + i)}</div>;
              
              if (selectedAnswer !== null) {
                if (i === question.correct) {
                  style = "bg-green-50 border-green-500 text-green-900 ring-2 ring-green-100";
                  icon = <CheckCircle className="text-green-600" />;
                } else if (i === selectedAnswer) {
                  style = "bg-red-50 border-red-500 text-red-900 ring-2 ring-red-100";
                  icon = <XCircle className="text-red-600" />;
                } else {
                  style = "opacity-50 grayscale bg-gray-50";
                }
              }

              return (
                <button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(i)}
                  className={`group p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-4 ${style}`}
                >
                  {icon}
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white p-2 rounded-lg mt-1">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-1">AI Explanation</h4>
                  <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className="mt-6 w-full py-4 bg-primary-600 text-white rounded-xl font-black hover:bg-primary-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                {currentQuestion === quizData.length - 1 ? 'Finish Assessment' : 'Proceed to Next'} <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 border-2 border-primary-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">AI Quiz Engine</h1>
            <p className="text-gray-600 text-lg max-w-xl">
              Challenge yourself with dynamically generated questions powered by Gemini Pro 2.5.
            </p>
          </div>
          <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                  difficulty === lvl ? 'bg-white text-primary-600 shadow-sm shadow-primary-100' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 flex items-center gap-4 text-red-600">
          <AlertCircle /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {topics.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => startQuiz(topic)}
            className="group bg-white p-6 rounded-2xl border-2 border-gray-50 hover:border-primary-400 hover:shadow-xl transition-all text-left relative overflow-hidden"
          >
            <div className="absolute -bottom-4 -right-4 text-gray-50 group-hover:text-primary-50 transition-colors">
              <Brain size={100} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition">
                <Zap size={24} />
              </div>
              <h3 className="font-black text-gray-900 text-lg group-hover:text-primary-700">{topic}</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter mt-1 group-hover:text-primary-500 transition">Start Challenge ?</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
