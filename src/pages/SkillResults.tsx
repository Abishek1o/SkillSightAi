import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, TrendingUp, BookOpen, Clock, Award, ExternalLink, Download, Share2 } from 'lucide-react';
import { LearningPath, Skill } from '../types';

export default function SkillResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState<any>(location.state?.analysisData);
  const [isLoading, setIsLoading] = useState(!analysisData && !!location.state?.analysisId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const analysisId = location.state?.analysisId;
      if (!analysisData && analysisId) {
        setIsLoading(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analysis/${analysisId}/`);
          const data = await response.json();
          if (response.ok) {
            setAnalysisData(data);
          } else {
            setError(data.error || 'Failed to fetch analysis data');
          }
        } catch (err) {
          console.error('Error fetching analysis:', err);
          setError('Network error. Failed to retrieve analysis.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnalysis();
  }, [location.state?.analysisId, analysisData]);

  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `SkillSight AI - ${analysisData?.role} Analysis`,
          text: `Check out my skill gaps and learning path for ${analysisData?.role}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Fallback or redirect if no data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'No Analysis Data'}</h2>
          <p className="text-gray-600 mb-8">We couldn't find the analysis you're looking for. It might have been deleted or there was a connection error.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            Start a new analysis
          </button>
        </div>
      </div>
    );
  }

  const matchPercentage = analysisData.match_percentage;

  // Transform API data to match UI types if needed
  const matchedSkills: Skill[] = analysisData.matched_skills.map((name: string) => ({
    name,
    category: 'Matched',
    proficiency: 100
  }));

  const missingSkills: Skill[] = analysisData.missing_skills.map((name: string) => ({
    name,
    category: 'Missing'
  }));

  const learningPaths: LearningPath[] = analysisData.recommendations.map((rec: any, index: number) => ({
    id: String(index),
    title: `Learn ${rec.skill}`,
    description: `Recommended resource: ${rec.resource}`,
    duration: 'Self-paced',
    difficulty: rec.difficulty || 'Beginner',
    skills: [rec.skill],
    platform: rec.resource,
    link: rec.link
  }));

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-cyan-600';
    return 'text-orange-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    return 'bg-indigo-100 text-indigo-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Skill Gap Analysis Results</h1>
              <p className="text-gray-600 dark:text-gray-400">Target Position: {analysisData.role}</p>
            </div>
            <div className="flex gap-3 no-print">
              <button
                onClick={handleExportPDF}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 bg-white dark:bg-gray-800"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 bg-white dark:bg-gray-800"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 mb-8 transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="animate-scale-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Overall Match Score</h2>
              <div className="relative w-64 h-64 mx-auto">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 112}`}
                    strokeDashoffset={`${2 * Math.PI * 112 * (1 - matchPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-6xl font-bold ${getMatchColor(matchPercentage)}`}>
                    {matchPercentage}%
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 font-medium mt-2">Match Score</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-2xl p-6 border border-green-200 dark:border-green-800/50">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500 mb-3" />
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">{matchedSkills.length}</p>
                <p className="text-green-700 dark:text-green-400 font-medium">Matched Skills</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-2xl p-6 border border-orange-200 dark:border-orange-800/50">
                <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-500 mb-3" />
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">{missingSkills.length}</p>
                <p className="text-orange-700 dark:text-orange-400 font-medium">Missing Skills</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800/50">
                <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-500 mb-3" />
                <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-1">Good</p>
                <p className="text-indigo-700 dark:text-indigo-400 font-medium">Match Level</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800/50">
                <BookOpen className="w-8 h-8 text-cyan-600 dark:text-cyan-500 mb-3" />
                <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-100 mb-1">{learningPaths.length}</p>
                <p className="text-cyan-700 dark:text-cyan-400 font-medium">Learning Paths</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Matched Skills</h2>
            </div>
            <div className="space-y-3">
              {matchedSkills.map((skill, index) => (
                <div key={index} className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{skill.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{skill.category}</p>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-green-200 dark:bg-green-900/40 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Skills to Develop</h2>
            </div>
            <div className="space-y-3">
              {missingSkills.map((skill, index) => (
                <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800/30 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{skill.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{skill.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 text-xs font-semibold rounded-full">
                      Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recommended Learning Paths</h2>
              <p className="text-gray-600 dark:text-gray-400">Curated courses to help you bridge the skill gap</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => window.open(path.link, '_blank')}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{path.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 ml-2" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {path.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)} dark:bg-indigo-900 dark:text-indigo-200`}>
                      {path.difficulty}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{path.platform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-8 shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Ready for Another Analysis?</h3>
                <p className="text-indigo-100">Compare your skills with different job positions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
