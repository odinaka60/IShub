import React from 'react';
import { ApplicationTask } from '../types';
import { ArrowLeftIcon, MagicWandIcon } from './icons';

interface TaskAssistanceProps {
  task: ApplicationTask;
  assistance: string;
  onBack: () => void;
}

const TaskAssistance: React.FC<TaskAssistanceProps> = ({ task, assistance, onBack }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <MagicWandIcon className="h-7 w-7 text-blue-600" />
          Task Assistance
        </h2>
      </div>
      
      {/* Task Info */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-bold text-lg text-gray-800">{task.taskName}</h3>
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      </div>

      {/* AI Guidance */}
      <div>
        <h4 className="font-bold text-xl text-gray-700 mb-3">Your AI-Powered Guide</h4>
        <div className="prose prose-blue max-w-none text-gray-700 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
           {assistance.split('\n').map((paragraph, index) => (
             <p key={index}>{paragraph}</p>
           ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button onClick={onBack} className="flex items-center justify-center gap-2 w-full md:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
            <ArrowLeftIcon className="h-5 w-5"/> Back to Your Plan
        </button>
      </div>
    </div>
  );
};

export default TaskAssistance;