import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md w-full">
                <div className="flex justify-center mb-6 text-indigo-600">
                    <AlertCircle size={80} />
                </div>
                <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
                <p className="text-2xl font-semibold text-gray-700 mb-8">Page Not Found</p>
                <p className="text-gray-500 mb-10">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    <Home className="mr-2" size={20} />
                    Go back home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
