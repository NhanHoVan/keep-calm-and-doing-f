import { Project, Task } from '../types';
import { http } from './http';

export const tasksApi = {
  updateTask: async (projectId: string, taskId: string, updates: Partial<Task>): Promise<Project> => {
    return http<Project>(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  addTask: async (projectId: string, parentId: string | null, task: Task): Promise<Project> => {
    return http<Project>(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ parentId, task })
    });
  },

  deleteTask: async (projectId: string, taskId: string): Promise<Project> => {
    return http<Project>(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }
};
