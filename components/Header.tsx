
import React from 'react';
import { GraduationCapIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCapIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-600">I</span>shub
          </h1>
        </div>
        <p className="hidden md:block text-gray-500">Your International Student Hub</p>
      </div>
    </header>
  );
};

export default Header;
