
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-6xl md:text-9xl font-extrabold text-blue-600 dark:text-blue-500">404</h1>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">Page Not Found</h2>
      <p className="mt-4 max-w-md text-lg text-gray-600 dark:text-gray-400">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="mt-8">
        <Button size="lg">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
