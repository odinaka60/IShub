import React, { useState, useCallback } from 'react';
import { UserProfile, University, ApplicationPlanData, AppState, ApplicationTask } from './types';
import { getUniversityRecommendations, getApplicationPlan, getTaskAssistance } from './services/geminiService';

import Header from './components/Header';
import Footer from './components/Footer';
import UserProfileForm from './components/UserProfileForm';
import UniversityList from './components/UniversityList';
import ApplicationPlan from './components/ApplicationPlan';
import TaskAssistance from './components/TaskAssistance';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('PROFILE');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<University[]>([]);
  const [applicationPlan, setApplicationPlan] = useState<ApplicationPlanData | null>(null);
  const [currentTask, setCurrentTask] = useState<ApplicationTask | null>(null);
  const [taskAssistanceContent, setTaskAssistanceContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSubmit = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);
    try {
      const recommendations = await getUniversityRecommendations(profile);
      setUniversities(recommendations);
      setAppState('RECOMMENDATIONS');
    } catch (e) {
      console.error(e);
      setError('Failed to fetch university recommendations. Please try again.');
      setAppState('PROFILE');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePlanGeneration = useCallback(async (selected: University[]) => {
    if (!userProfile) {
      setError('User profile is missing.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSelectedUniversities(selected);
    try {
      const plan = await getApplicationPlan(userProfile, selected);
      setApplicationPlan(plan);
      setAppState('PLAN');
    } catch (e) {
      console.error(e);
      setError('Failed to generate the application plan. Please try again.');
      setAppState('RECOMMENDATIONS');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  const handleGetTaskAssistance = useCallback(async (task: ApplicationTask) => {
    if (!userProfile || selectedUniversities.length === 0) {
      setError('User profile or selected universities are missing.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentTask(task);
    try {
      const assistance = await getTaskAssistance(userProfile, selectedUniversities, task);
      setTaskAssistanceContent(assistance);
      setAppState('TASK_ASSISTANCE');
    } catch (e) {
      console.error(e);
      setError('Failed to get assistance for this task. Please try again.');
      setAppState('PLAN'); // Stay on plan page on error
    } finally {
        setIsLoading(false);
    }
  }, [userProfile, selectedUniversities]);
  
  const handleStartOver = () => {
    setAppState('PROFILE');
    setUserProfile(null);
    setUniversities([]);
    setSelectedUniversities([]);
    setApplicationPlan(null);
    setCurrentTask(null);
    setTaskAssistanceContent(null);
    setError(null);
  };

  const handleBackToRecommendations = () => {
    setAppState('RECOMMENDATIONS');
    setApplicationPlan(null);
  };
  
  const handleBackToPlan = () => {
      setAppState('PLAN');
      setCurrentTask(null);
      setTaskAssistanceContent(null);
  };

  const renderContent = () => {
    if (isLoading) {
      let message = "Building your profile...";
      if (appState === 'RECOMMENDATIONS') message = "Finding the best universities for you...";
      if (appState === 'PLAN') message = "Crafting your detailed application plan...";
      if (appState === 'TASK_ASSISTANCE') message = "Getting some expert advice for you...";
      return <LoadingSpinner message={message} />;
    }
    
    if (error) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-bold text-lg">An Error Occurred</p>
                <p>{error}</p>
                <button
                    onClick={appState === 'PROFILE' ? () => setError(null) : handleStartOver}
                    className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                    {appState === 'PROFILE' ? 'Try Again' : 'Start Over'}
                </button>
            </div>
        );
    }

    switch (appState) {
      case 'PROFILE':
        return <UserProfileForm onSubmit={handleProfileSubmit} />;
      case 'RECOMMENDATIONS':
        return <UniversityList universities={universities} onGeneratePlan={handlePlanGeneration} onStartOver={handleStartOver} />;
      case 'PLAN':
        if (userProfile && applicationPlan) {
          return (
            <ApplicationPlan 
              userProfile={userProfile} 
              selectedUniversities={selectedUniversities} 
              planData={applicationPlan}
              onBack={handleBackToRecommendations}
              onGetHelp={handleGetTaskAssistance}
            />
          );
        }
        return null;
      case 'TASK_ASSISTANCE':
        if (currentTask && taskAssistanceContent) {
            return (
                <TaskAssistance
                    task={currentTask}
                    assistance={taskAssistanceContent}
                    onBack={handleBackToPlan}
                />
            );
        }
        return null;
      default:
        return <UserProfileForm onSubmit={handleProfileSubmit} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;