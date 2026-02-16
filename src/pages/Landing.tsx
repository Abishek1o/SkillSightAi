
import { useNavigate } from 'react-router-dom';
import { Brain, Target, TrendingUp, ArrowRight, Rocket, Sparkles } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden selection:bg-blue-100 dark:selection:bg-blue-900/40 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 backdrop-blur-sm">
                {/* Animated Background Gradients */}
                <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 animate-fade-in shadow-sm border border-blue-100 dark:border-blue-800">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Driven Career Guidance</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8 animate-slide-up tracking-tight">
                        The Smart Way to<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            Master Your Career
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 animate-slide-up opacity-90 leading-relaxed font-medium" style={{ animationDelay: '0.1s' }}>
                        Personalized skill analysis and tailored learning paths powered by AI. Bridge your gaps and accelerate your professional growth today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            Get Started Free
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('features');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 shadow-sm"
                        >
                            Learn More
                        </button>
                    </div>

                    {/* Social Proof Placeholder */}
                    <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-2 font-bold text-xl"><Brain className="w-6 h-6" /> AI Engine</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Target className="w-6 h-6" /> Precision</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Rocket className="w-6 h-6" /> Velocity</div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                            Everything You Need to Succeed
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
                            We provide a comprehensive platform to identify your potential and guide your learning journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Intelligent Analysis</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Upload your resume or enter your skills. Our AI performs a deep comparison against industry requirements for your target role.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                                <Target className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Personalized Paths</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Get more than just a score. We provide direct links to high-quality resources for every missing skill we identify.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Progress Tracking</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Save your analyses and watch your skill score grow over time as you complete recommended courses and projects.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats/Proof Section */}
            <section className="py-24 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2 font-mono tracking-tighter">95%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Accuracy</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2 font-mono tracking-tighter">500+</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Resources</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2 font-mono tracking-tighter">10k+</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Analyses</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2 font-mono tracking-tighter">24/7</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">AI Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-24 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-blue-600 dark:bg-blue-700 -z-10"></div>
                <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-10 leading-tight">
                        Ready to bridge the gap in<br />your professional career?
                    </h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="group relative inline-flex items-center gap-3 px-12 py-6 bg-white text-blue-600 font-black rounded-3xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-black/20"
                    >
                        Start Your Analysis
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
                    </button>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black text-gray-900 dark:text-white">SkillSight AI</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        © 2026 SkillSight AI. All rights reserved. Built for professional growth.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
                        <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
