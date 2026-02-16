import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, FileText, Briefcase, Upload, Sparkles, ChevronRight } from 'lucide-react';

export default function SkillAnalyze() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    yourSkills: '',
    experience: '',
    resumeText: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'resume'>('manual');

  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setUploadError(null);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/parse-resume/`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, resumeText: data.text });
      } else {
        // Try to get JSON error, fallback to status text
        try {
          const data = await response.json();
          setUploadError(data.error || `Server error (${response.status})`);
        } catch {
          setUploadError(`Server returned an error (${response.status}). Check if the file is too large.`);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Connection refused. Please check your internet or try again in a moment.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      // Create skills array from comma-separated string
      const skillsList = formData.yourSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_role: formData.jobTitle,
          skills: activeTab === 'manual' ? skillsList : [],
          resume_text: activeTab === 'resume' ? formData.resumeText : '',
          firebase_uid: user?.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/results', {
          state: {
            analysisData: data
          }
        });
      } else {
        console.error('Analysis failed:', data);
        alert(`Analysis failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('Error connecting to backend. Make sure the Django server is running on port 8000.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exampleSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'];

  const loadingMessages = [
    'Analyzing your skills...',
    'Comparing with job requirements...',
    'Identifying skill gaps...',
    'Generating personalized recommendations...',
  ];

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Rotate loading messages
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  return (
    <>
      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4 animate-slide-up">
            <div className="flex flex-col items-center gap-6">
              {/* Animated Brain Icon */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
                  <Brain className="w-14 h-14 text-white animate-pulse" />
                </div>
                {/* Spinning Ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-2xl animate-spin"></div>
              </div>

              {/* Loading Spinner */}
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 rounded-full animate-spin"></div>

              {/* Loading Message */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Analyzing Your Skills
                </h3>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                  {loadingMessages[loadingMessageIndex]}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === loadingMessageIndex
                      ? 'bg-indigo-600 scale-125'
                      : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mb-4 flex items-center gap-2 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Brain className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Skill Gap Analysis</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Let's analyze your skills and find opportunities for growth</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'manual'
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Manual Entry
                </div>
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'resume'
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  Resume Upload
                </div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Target Job Title *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <select
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                      required
                    >
                      <option value="">Select a target role</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                      <option value="Python Developer">Python Developer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="block w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years (Entry Level)</option>
                    <option value="1-3">1-3 years (Junior)</option>
                    <option value="3-5">3-5 years (Mid-Level)</option>
                    <option value="5+">5+ years (Senior)</option>
                  </select>
                </div>
              </div>

              {activeTab === 'manual' ? (
                <>
                  <div>
                    <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Job Description / Required Skills *
                    </label>
                    <textarea
                      id="jobDescription"
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      rows={6}
                      className="block w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      placeholder="Paste the job description or list the required skills..."
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Include all technical skills, tools, and qualifications mentioned in the job posting
                    </p>
                  </div>

                  <div>
                    <label htmlFor="yourSkills" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Your Current Skills *
                    </label>
                    <textarea
                      id="yourSkills"
                      value={formData.yourSkills}
                      onChange={(e) => setFormData({ ...formData, yourSkills: e.target.value })}
                      rows={6}
                      className="block w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      placeholder="List your skills separated by commas..."
                      required
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Quick add:</span>
                      {exampleSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            const current = formData.yourSkills;
                            const separator = current && !current.endsWith(',') ? ', ' : '';
                            setFormData({
                              ...formData,
                              yourSkills: current + separator + skill
                            });
                          }}
                          className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-sm rounded-full transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="p-8 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl bg-indigo-50/30 dark:bg-indigo-900/10 text-center hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group relative">
                    <input
                      type="file"
                      id="resumeFile"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.txt"
                      disabled={isParsing}
                    />
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                        {isParsing ? (
                          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {isParsing ? 'Processing your resume...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Supported formats: PDF, DOCX, TXT (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span>⚠️</span> {uploadError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="resumeText" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Extracted Resume Text
                    </label>
                    <textarea
                      id="resumeText"
                      value={formData.resumeText}
                      onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                      rows={10}
                      className="block w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      placeholder="Upload your resume above or paste your text here..."
                      required
                    />
                    <div className="mt-3 p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl">
                      <div className="flex gap-3">
                        <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-cyan-900 dark:text-cyan-300">
                          <p className="font-semibold mb-1">AI Extraction Ready</p>
                          <p>Our AI will analyze the text below to extract your skills and experience. Feel free to edit the text if needed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Skills
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Advanced algorithms analyze your skills against job requirements</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get comprehensive skill gap analysis in seconds</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <ChevronRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Learning Paths</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive personalized recommendations to bridge skill gaps</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
