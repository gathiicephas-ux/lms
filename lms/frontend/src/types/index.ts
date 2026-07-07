/**
 * Frontend TypeScript Types
 */

// User Types
export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'facilitator' | 'admin';
  tier?: 'foundation' | 'authority' | 'domination';
  companyName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Course/Module Types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  orderNumber: number;
  durationHours?: number;
  lessonsCount: number;
  status: 'draft' | 'published' | 'archived';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  orderNumber: number;
  durationMinutes?: number;
  description?: string;
}

export interface Progress {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  watchDurationSeconds: number;
}

export interface CourseProgress {
  courseId: string;
  lessonsCompleted: number;
  totalLessons: number;
  completionPercentage: number;
  isPassed: boolean;
  passedAt?: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingScore: number;
  totalQuestions: number;
  durationMinutes?: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer';
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  answerText: string;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'in_progress' | 'submitted' | 'graded';
  startedAt: string;
  submittedAt?: string;
}

// Payment Types
export interface Payment {
  id: string;
  tier: 'foundation' | 'authority' | 'domination';
  amount: number;
  currency: 'KES' | 'USD';
  status: 'pending' | 'completed' | 'failed';
  paidAt?: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  certificateNumber: string;
  programmeName: string;
  issuedAt: string;
  pdfUrl?: string;
  verificationCode: string;
  status: 'active' | 'revoked' | 'expired';
}

// AI Prompt Types
export interface AIPrompt {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description?: string;
  inputFields: any[];
  category?: string;
}

export interface AIPromptExecution {
  id: string;
  promptId: string;
  inputData: any;
  outputText: string;
  status: 'success' | 'failed';
  createdAt: string;
}

// Community Types
export interface Discussion {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  content: string;
  viewsCount: number;
  repliesCount: number;
  upvotesCount: number;
  isPinned: boolean;
  createdAt: string;
}

export interface Reply {
  id: string;
  discussionId: string;
  authorId: string;
  content: string;
  upvotesCount: number;
  isSolution: boolean;
  createdAt: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Store Types
export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User) => void;
}

export interface CourseStore {
  courses: Course[];
  currentCourse: Course | null;
  lessons: Lesson[];
  currentLesson: Lesson | null;
  progress: Record<string, Progress>;
  courseProgress: Record<string, CourseProgress>;
  isLoading: boolean;
  loadCourses: () => Promise<void>;
  loadCourse: (slug: string) => Promise<void>;
  loadLessons: (courseId: string) => Promise<void>;
  loadProgress: (userId: string) => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
}
