import React, { useRef, useState } from 'react';
import { UserProfile, University, ApplicationPlanData, ApplicationTask } from '../types';
import { getTextToSpeechAudio } from '../services/geminiService';
import { DownloadIcon, VolumeUpIcon, ArrowLeftIcon, UserCircleIcon, UniversityIcon, GraduationCapIcon, MagicWandIcon } from './icons';

// TypeScript declarations for global libraries from CDN
declare const jspdf: any;
declare const html2canvas: any;

interface ApplicationPlanProps {
  userProfile: UserProfile;
  selectedUniversities: University[];
  planData: ApplicationPlanData;
  onBack: () => void;
  onGetHelp: (task: ApplicationTask) => void;
}

const ApplicationPlan: React.FC<ApplicationPlanProps> = ({ userProfile, selectedUniversities, planData, onBack, onGetHelp }) => {
  const planContentRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleDownloadPdf = async () => {
    const contentToCapture = planContentRef.current;
    if (!contentToCapture) return;

    // Hide buttons during capture for a cleaner PDF
    const buttons = contentToCapture.querySelectorAll('.task-help-button');
    buttons.forEach(btn => (btn as HTMLElement).style.display = 'none');
    
    // Use html2canvas to capture the entire content element, not just the visible part.
    // The options scrollY, windowWidth, and windowHeight are key to capturing content that overflows the viewport.
    const canvas = await html2canvas(contentToCapture, { 
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY, 
        windowWidth: contentToCapture.scrollWidth,
        windowHeight: contentToCapture.scrollHeight
    });

    // Restore button visibility after capture
    buttons.forEach(btn => (btn as HTMLElement).style.display = 'inline-flex');

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = jspdf;
    
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
    });

    const imgProperties = pdf.getImageProperties(imgData);
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    const totalImageHeightInPDF = (imgProperties.height * pdfPageWidth) / imgProperties.width;

    let heightLeft = totalImageHeightInPDF;
    let position = 0;

    // Add the first page/part of the image
    pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, totalImageHeightInPDF);
    heightLeft -= pdfPageHeight;

    // Loop to add more pages if the content is taller than a single page
    while (heightLeft > 0) {
      position -= pdfPageHeight; // Shift the image up for the next page
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, totalImageHeightInPDF);
      heightLeft -= pdfPageHeight;
    }
    
    pdf.save('Ishub-Application-Plan.pdf');
  };
  
  const handleReadAloud = async () => {
      if (!planContentRef.current) return;
      setIsSpeaking(true);
      try {
          const textToRead = planContentRef.current.innerText;
          await getTextToSpeechAudio(textToRead);
      } catch (error) {
          console.error("TTS Error:", error);
          alert("Sorry, we couldn't read the plan aloud at this time.");
      } finally {
          setIsSpeaking(false);
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 md:p-8">
        <div ref={planContentRef}>
            <div className="text-center mb-10">
                <div className="flex justify-center items-center gap-2">
                    <GraduationCapIcon className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-800"><span className="text-blue-600">I</span>shub</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">Your Personal Application Plan</h2>
            </div>

            {/* User Profile Summary */}
            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-xl text-gray-700 flex items-center gap-2"><UserCircleIcon className="h-6 w-6" /> Profile Summary</h3>
                <p className="text-gray-600 mt-2"><strong>Name:</strong> {userProfile.fullName}</p>
                <p className="text-gray-600"><strong>From:</strong> {userProfile.countryOfOrigin}</p>
            </div>

            {/* Selected Schools */}
            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-xl text-gray-700 flex items-center gap-2"><UniversityIcon className="h-6 w-6"/> Selected Universities</h3>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                    {selectedUniversities.map(uni => <li key={uni.id}>{uni.name} ({uni.program})</li>)}
                </ul>
            </div>

            {/* To-Do List */}
            <div>
                <h3 className="font-bold text-xl text-gray-700 mb-4">Application To-Do List</h3>
                <div className="space-y-6">
                    {planData.plan.map((stage, index) => (
                        <div key={index}>
                            <h4 className="font-bold text-lg text-blue-700 border-b-2 border-blue-200 pb-2 mb-3">{stage.stageTitle}</h4>
                            <ul className="space-y-3">
                                {stage.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex} className="flex items-start justify-between p-2 rounded-md hover:bg-gray-50">
                                        <div className="flex items-start">
                                            <span className="text-blue-500 font-bold mr-3 mt-1">&#10003;</span>
                                            <div>
                                                <p className="font-semibold text-gray-800">{task.taskName}</p>
                                                <p className="text-sm text-gray-600">{task.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onGetHelp(task)}
                                            className="task-help-button ml-4 flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors"
                                            aria-label={`Get help with ${task.taskName}`}
                                        >
                                            <MagicWandIcon className="h-4 w-4" />
                                            Get Help
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="p-6 border-t mt-4 flex flex-col md:flex-row gap-4">
        <button onClick={onBack} className="flex items-center justify-center gap-2 w-full md:w-auto flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
            <ArrowLeftIcon className="h-5 w-5"/> Back
        </button>
        <button onClick={handleReadAloud} disabled={isSpeaking} className="flex items-center justify-center gap-2 w-full md:w-auto flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors">
             <VolumeUpIcon className="h-5 w-5"/> {isSpeaking ? 'Reading...' : 'Read Aloud'}
        </button>
        <button onClick={handleDownloadPdf} className="flex items-center justify-center gap-2 w-full md:w-auto flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <DownloadIcon className="h-5 w-5"/> Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ApplicationPlan;