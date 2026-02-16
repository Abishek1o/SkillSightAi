export interface Skill {
  name: string;
  category: string;
  proficiency?: number;
}

export interface SkillGapAnalysis {
  matchPercentage: number;
  matchedSkills: Skill[];
  missingSkills: Skill[];
  learningPaths: LearningPath[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  platform: string;
  link: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AnalysisHistory {
  id: string | number;
  date: string;
  jobTitle: string;
  matchPercentage: number;
  missingSkills?: string[];
}
