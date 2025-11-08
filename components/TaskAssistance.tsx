import React from 'react';
import { ApplicationTask } from '../types';
import { ArrowLeftIcon, MagicWandIcon } from './icons';

interface TaskAssistanceProps {
  task: ApplicationTask;
  assistance: string;
  onBack: () => void;
}

const TaskAssistance: React.FC<TaskAssistanceProps> = ({ task, assistance, onBack }) => {

  const renderFormattedAssistance = (text: string) => {
    const lines = text.split('\n');
    // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const elements: React.ReactElement[] = [];
    // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    let listItems: React.ReactElement[] = [];
    let currentListType: 'ol' | 'ul' | null = null;

    const flushList = () => {
      if (listItems.length > 0) {
        const key = `${currentListType}-${elements.length}`;
        if (currentListType === 'ol') {
          elements.push(<ol key={key} className="list-decimal list-inside space-y-2 mb-4 pl-4">{listItems}</ol>);
        } else if (currentListType === 'ul') {
          elements.push(<ul key={key} className="list-disc list-inside space-y-2 mb-4 pl-4">{listItems}</ul>);
        }
        listItems = [];
        currentListType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.length === 0) {
          flushList();
          return;
      }

      const isOl = /^\d+\.\s/.test(trimmedLine);
      const isUl = /^[-*]\s/.test(trimmedLine);
      
      if (isOl) {
        if (currentListType !== 'ol') {
          flushList();
          currentListType = 'ol';
        }
        listItems.push(<li key={`li-${index}`}>{trimmedLine.replace(/^\d+\.\s/, '')}</li>);
      } else if (isUl) {
        if (currentListType !== 'ul') {
          flushList();
          currentListType = 'ul';
        }
        listItems.push(<li key={`li-${index}`}>{trimmedLine.replace(/^[-*]\s/, '')}</li>);
      } else if (trimmedLine.length < 80 && trimmedLine.endsWith(':')) {
        flushList();
        elements.push(<h5 key={`h5-${index}`} className="font-semibold text-gray-800 text-md mt-4 mb-2">{trimmedLine}</h5>);
      } else {
        flushList();
        elements.push(<p key={`p-${index}`} className="mb-2 leading-relaxed">{trimmedLine}</p>);
      }
    });

    flushList();
    return elements;
  };


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
        <div className="text-gray-700 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
           {renderFormattedAssistance(assistance)}
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
