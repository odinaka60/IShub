export interface UserProfile {
  fullName: string;
  countryOfOrigin: string;
  countryOfResidence: string;
  studyCountries: string[];
  major: string;
  currentCourse: string;
  academicLevel: string;
  budget: number;
  scholarshipInterest: boolean;
  currency: string;
}

export interface University {
  id: number;
  name:string;
  location: string;
  estimatedAnnualCost: number;
  program: string;
  websiteUrl: string;
}

export interface ApplicationTask {
  taskName: string;
  description: string;
}

export interface ApplicationStage {
  stageTitle: string;
  tasks: ApplicationTask[];
}

export interface ApplicationPlanData {
  plan: ApplicationStage[];
}

export type AppState = 'PROFILE' | 'RECOMMENDATIONS' | 'PLAN' | 'TASK_ASSISTANCE';