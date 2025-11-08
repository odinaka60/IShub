
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Ishub. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Empowering global education journeys.</p>
      </div>
    </footer>
  );
};

export default Footer;
