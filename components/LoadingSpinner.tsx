
import React from 'react';

interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-lg">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      <p className="mt-6 text-lg font-semibold text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
