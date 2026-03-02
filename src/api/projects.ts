import { Project, Language } from '../types';
import { http } from './http';

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    return http<Project[]>('/api/projects');
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    return http<Project>(`/api/projects/${id}`);
  },

  createProject: async (data: { title: string; idea: string; startDate: string; endDate: string; language: Language }): Promise<Project> => {
    return http<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteProject: async (id: string): Promise<void> => {
    return http<void>(`/api/projects/${id}`, { method: 'DELETE' });
  },

  clearAllProjects: async (): Promise<void> => {
    return http<void>('/api/projects', { method: 'DELETE' });
  }
};
