import axios, { AxiosInstance, AxiosError } from 'axios'
import { APIResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class APIService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle responses and errors
    this.api.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        // Handle 401 - try to refresh token
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });
              localStorage.setItem('accessToken', data.accessToken);
              // Retry original request
              return this.api.request(error.config!);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Endpoints
  async register(data: any): Promise<APIResponse> {
    return this.api.post('/auth/register', data);
  }

  async login(email: string, password: string): Promise<APIResponse> {
    return this.api.post('/auth/login', { email, password });
  }

  async logout(refreshToken: string): Promise<APIResponse> {
    return this.api.post('/auth/logout', { refreshToken });
  }

  async getCurrentUser(): Promise<APIResponse> {
    return this.api.get('/auth/me');
  }

  async refreshToken(refreshToken: string): Promise<APIResponse> {
    return this.api.post('/auth/refresh', { refreshToken });
  }

  // Course Endpoints
  async getCourses(): Promise<APIResponse> {
    return this.api.get('/courses');
  }

  async getCourse(slug: string): Promise<APIResponse> {
    return this.api.get(`/courses/${slug}`);
  }

  async enrollCourse(courseId: string): Promise<APIResponse> {
    return this.api.post(`/courses/${courseId}/enroll`);
  }

  // Lesson Endpoints
  async getLesson(lessonId: string): Promise<APIResponse> {
    return this.api.get(`/lessons/${lessonId}`);
  }

  async markLessonComplete(lessonId: string): Promise<APIResponse> {
    return this.api.post(`/lessons/${lessonId}/mark-complete`);
  }

  // Progress Endpoints
  async getProgress(): Promise<APIResponse> {
    return this.api.get('/progress');
  }

  async updateProgress(data: any): Promise<APIResponse> {
    return this.api.post('/progress/update', data);
  }

  // Quiz Endpoints
  async getQuiz(quizId: string): Promise<APIResponse> {
    return this.api.get(`/quizzes/${quizId}`);
  }

  async startQuizAttempt(quizId: string): Promise<APIResponse> {
    return this.api.post(`/quizzes/${quizId}/attempt`);
  }

  async submitQuiz(quizId: string, answers: any): Promise<APIResponse> {
    return this.api.post(`/quizzes/${quizId}/submit`, { answers });
  }

  async getQuizResults(quizId: string): Promise<APIResponse> {
    return this.api.get(`/quizzes/${quizId}/results`);
  }

  // Payment Endpoints
  async createPaymentIntent(tier: string): Promise<APIResponse> {
    return this.api.post('/payments/create-intent', { tier });
  }

  async getPaymentHistory(): Promise<APIResponse> {
    return this.api.get('/payments/history');
  }

  // Certificate Endpoints
  async getCertificates(): Promise<APIResponse> {
    return this.api.get('/certificates');
  }

  async downloadCertificate(certificateId: string): Promise<APIResponse> {
    return this.api.get(`/certificates/${certificateId}/download`);
  }

  async verifyCertificate(verificationCode: string): Promise<APIResponse> {
    return this.api.get(`/certificates/verify/${verificationCode}`);
  }

  // AI Prompt Endpoints
  async getAIPrompts(): Promise<APIResponse> {
    return this.api.get('/ai-prompts');
  }

  async executePrompt(promptId: string, inputData: any): Promise<APIResponse> {
    return this.api.post(`/ai-prompts/${promptId}/execute`, { inputData });
  }

  async getAIHistory(): Promise<APIResponse> {
    return this.api.get('/ai-prompts/history');
  }

  // Community Endpoints
  async getDiscussions(): Promise<APIResponse> {
    return this.api.get('/community/discussions');
  }

  async createDiscussion(data: any): Promise<APIResponse> {
    return this.api.post('/community/discussions', data);
  }

  async replyToDiscussion(discussionId: string, content: string): Promise<APIResponse> {
    return this.api.post(`/community/${discussionId}/reply`, { content });
  }

  async upvoteDiscussion(discussionId: string): Promise<APIResponse> {
    return this.api.post(`/community/${discussionId}/upvote`);
  }

  // Admin Endpoints
  async getAdminDashboard(): Promise<APIResponse> {
    return this.api.get('/admin/dashboard');
  }

  async getAllUsers(): Promise<APIResponse> {
    return this.api.get('/admin/users');
  }

  async getAnalytics(): Promise<APIResponse> {
    return this.api.get('/admin/analytics');
  }

  async exportDataAsCSV(): Promise<APIResponse> {
    return this.api.post('/admin/export/csv');
  }
}

export const apiService = new APIService();
