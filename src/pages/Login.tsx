
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, AlertTriangle, ArrowRight, Target, TrendingUp } from 'lucide-react';
import { auth } from '../firebase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signUp, googleSignIn, resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Full Authentication Error:", err);
      const errorCode = err.code;

      if (errorCode === 'auth/invalid-api-key' || errorCode === 'auth/api-key-not-valid') {
        setError('Firebase Configuration Error: Invalid API Key. Please verify your firebase.ts settings.');
      } else if (errorCode === 'auth/configuration-not-found') {
        setError('Firebase Configuration Error: Auth Domain or project ID not found.');
      } else if (errorCode === 'auth/user-not-found') {
        setError('Account not found. Please click "Sign up" below to create a new account.');
      } else if (errorCode === 'auth/wrong-password') {
        setError('Incorrect password. Please try again or reset your password.');
      } else if (errorCode === 'auth/invalid-credential') {
        setError('Invalid credentials. If you haven\'t created an account yet, please click "Sign up" below.');
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (errorCode === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in the Firebase Console. Go to Authentication > Sign-in method to enable it.');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please check the console for details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await resetPassword(email);
      // Success - no message state currently used in UI
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      if (!auth.app.options.apiKey || auth.app.options.apiKey === "YOUR_API_KEY") {
        throw new Error("Firebase API Key is missing. Please configure src/firebase.ts");
      }
      await googleSignIn();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-gray-50 to-gray-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4 py-12 transition-colors duration-300">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Left Side: Branding and Features */}
        <div className="hidden md:block space-y-12 px-8 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-5 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300 animate-float">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                  SkillSight AI
                </h1>
                <div className="h-1 w-12 bg-blue-600 dark:bg-blue-400 rounded-full mt-1"></div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                Discover Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                  Skill Potential
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg font-medium">
                Intelligent skill gap analysis powered by AI to help students identify learning opportunities and accelerate career growth.
              </p>
            </div>

            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI-Powered Analysis</h3>
                  <p className="text-gray-500 dark:text-gray-400">Get instant insights into your skill gaps</p>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/40 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Personalized Learning Paths</h3>
                  <p className="text-gray-500 dark:text-gray-400">Customized recommendations for your goals</p>
                </div>
              </div>
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/40 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Track Your Progress</h3>
                  <p className="text-gray-500 dark:text-gray-400">Monitor your skill development journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex justify-center md:justify-end">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="text-center mb-8">
              <button
                onClick={() => navigate('/')}
                className="md:hidden mb-6 text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to home
              </button>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {isLogin ? 'Sign in to continue your skill journey' : 'Sign up to start your journey'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Sign in with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase text-gray-400 dark:text-gray-500">
                  <span className="px-4 bg-white dark:bg-gray-800">Or sign in with email</span>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 transition-all font-medium"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 pl-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span className="ml-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors focus:outline-none"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
