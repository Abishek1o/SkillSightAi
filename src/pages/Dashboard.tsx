import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, TrendingUp, Target, Award, Clock, ArrowRight, BarChart3, Trash2, Share2, Download } from 'lucide-react';
import { AnalysisHistory } from '../types';

interface DashboardData {
  total_analyses: number;
  avg_match_score: string;
  skills_acquired: number;
  learning_hours: number;
  recent_analyses: AnalysisHistory[];
  recommended_skills: { name: string; category: string; priority: string }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard-stats/?uid=${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const handleAnalysisClick = (analysisId: string | number) => {
    setSelectedAnalysisId(analysisId);
  };

  const handleExportPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  const handleShare = async (e: React.MouseEvent, analysis: AnalysisHistory) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/results?id=${analysis.id}`; // Constructing a shareable URL
    try {
      if (navigator.share) {
        await navigator.share({
          title: `SkillSight AI - ${analysis.jobTitle} Analysis`,
          text: `Check out my skill gaps and learning path for ${analysis.jobTitle}!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDeleteAnalysis = async (e: React.MouseEvent, analysisId: string | number) => {
    e.stopPropagation(); // Prevent row click
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analysis/${analysisId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        if (dashboardData) {
          setDashboardData({
            ...dashboardData,
            recent_analyses: dashboardData.recent_analyses.filter(a => a.id !== analysisId),
            total_analyses: dashboardData.total_analyses - 1
          });
        }
        if (selectedAnalysisId === analysisId) {
          setSelectedAnalysisId(null);
        }
      } else {
        alert('Failed to delete analysis');
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
      alert('Error connecting to backend');
    }
  };

  const handleViewResults = (analysisId: string | number | null) => {
    const id = analysisId || (recentAnalyses.length > 0 ? recentAnalyses[0].id : null);
    if (id) {
      navigate('/results', { state: { analysisId: id } });
    }
  };

  const statsList = [
    {
      title: 'Total Analyses',
      value: isLoading ? '...' : dashboardData?.total_analyses.toString() || '0',
      change: 'Lifetime total',
      icon: BarChart3,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Avg Match Score',
      value: isLoading ? '...' : dashboardData?.avg_match_score || '0%',
      change: 'Based on history',
      icon: TrendingUp,
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
    {
      title: 'Skills Acquired',
      value: isLoading ? '...' : dashboardData?.skills_acquired.toString() || '0',
      change: 'Matched skills count',
      icon: Award,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Learning Hours',
      value: isLoading ? '...' : dashboardData?.learning_hours.toString() || '0',
      change: 'Estimated effort',
      icon: Clock,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  const recentAnalyses = dashboardData?.recent_analyses || [];

  // Derive recommendations: Show specific ones if an analysis is selected, otherwise show global ones
  const activeAnalysis = selectedAnalysisId
    ? recentAnalyses.find(a => String(a.id) === String(selectedAnalysisId))
    : null;

  const recommendationsToDisplay = activeAnalysis?.missingSkills
    ? activeAnalysis.missingSkills.map(s => ({ name: s, category: 'Technical', priority: 'High' as const }))
    : dashboardData?.recommended_skills || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your skill development overview</p>
            </div>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              New Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsList.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-105 animate-slide-up"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Recent Analyses
              </h2>
              <div className="flex items-center gap-4">
                {selectedAnalysisId && (
                  <button
                    onClick={(e) => handleDeleteAnalysis(e, selectedAnalysisId)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                )}
                <button
                  onClick={() => handleViewResults(selectedAnalysisId || (recentAnalyses[0]?.id))}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1 transition-colors"
                  disabled={recentAnalyses.length === 0}
                >
                  View Full Results
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {recentAnalyses.length > 0 ? (
                recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer border ${(String(selectedAnalysisId) === String(analysis.id) || (!selectedAnalysisId && analysis === recentAnalyses[0]))
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 shadow-md transform scale-[1.01]'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    onClick={() => handleAnalysisClick(analysis.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${(String(selectedAnalysisId) === String(analysis.id) || (!selectedAnalysisId && analysis === recentAnalyses[0])) ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        }`}>
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{analysis.jobTitle}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{analysis.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.matchPercentage}%</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Match Score</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleShare(e, analysis)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Share Analysis"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleExportPDF(e)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Export PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteAnalysis(e, analysis.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <ArrowRight className={`w-5 h-5 transition-transform ${(String(selectedAnalysisId) === String(analysis.id) || (!selectedAnalysisId && analysis === recentAnalyses[0])) ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' : 'text-gray-300 dark:text-gray-600'
                        }`} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No recent analyses found</p>
                  <button
                    onClick={() => navigate('/analyze')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
                  >
                    Start your first analysis
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              Recommended Skills
            </h2>
            <div className="space-y-3 flex-1">
              {recommendationsToDisplay.slice(0, 6).map((skill, index) => (
                <div
                  key={index}
                  className="p-3 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-700 dark:to-indigo-900/30 rounded-xl border border-gray-200 dark:border-gray-600 transition-all hover:scale-105 duration-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{skill.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${skill.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {skill.priority}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{skill.category}</p>
                </div>
              ))}
              {recommendationsToDisplay.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 italic">
                  Select an analysis to see recommendations
                </p>
              )}
            </div>
            <button
              onClick={() => handleViewResults(selectedAnalysisId || (recentAnalyses[0]?.id))}
              className="w-full mt-6 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-semibold py-3 rounded-xl transition-all border border-indigo-100 dark:border-indigo-800 flex items-center justify-center gap-2"
              disabled={recommendationsToDisplay.length === 0}
            >
              View All Recommendations
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-8 shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Ready to analyze your skills?</h3>
                <p className="text-indigo-100">Get personalized insights in minutes</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              Start New Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
