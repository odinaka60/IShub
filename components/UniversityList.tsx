
import React, { useState } from 'react';
import { University } from '../types';
import { ExternalLinkIcon } from './icons';

interface UniversityListProps {
  universities: University[];
  onGeneratePlan: (selected: University[]) => void;
  onStartOver: () => void;
}

const UniversityList: React.FC<UniversityListProps> = ({ universities, onGeneratePlan, onStartOver }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleSelect = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleGeneratePlan = () => {
    const selected = universities.filter(u => selectedIds.has(u.id));
    onGeneratePlan(selected);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Your University Recommendations</h2>
      <p className="text-center text-gray-500 mb-8">Here are some universities that match your profile. Select one or more to create an application plan.</p>
      
      <div className="space-y-4">
        {universities.map(uni => (
          <div
            key={uni.id}
            onClick={() => handleSelect(uni.id)}
            className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedIds.has(uni.id) ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(uni.id)}
              readOnly
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="ml-4 flex-grow">
              <h3 className="font-bold text-lg text-gray-900">{uni.name}</h3>
              <p className="text-sm text-gray-600">{uni.location}</p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Program:</span> {uni.program}
              </p>
              <a
                href={uni.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2 group"
              >
                Visit Website
                <ExternalLinkIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-blue-600">${uni.estimatedAnnualCost.toLocaleString()}</p>
              <p className="text-sm text-gray-500">/ year (est.)</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={onStartOver}
          className="w-full md:w-auto flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Start Over
        </button>
        <button
          onClick={handleGeneratePlan}
          disabled={selectedIds.size === 0}
          className="w-full md:w-auto flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Generate Application Plan ({selectedIds.size})
        </button>
      </div>
    </div>
  );
};

export default UniversityList;