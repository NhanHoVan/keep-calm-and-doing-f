export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  BLOCKED = "BLOCKED",
  CANCELED = "CANCELED"
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  startDate?: string;
  endDate?: string;
  dueDate?: string; // Keeping for backward compatibility or as a primary deadline
  details?: string;
  subtasks?: Task[];
}

export type Language = 'en' | 'vi';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: number;
}

export interface Project {
  id: string;
  title: string;
  idea: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  createdAt: string;
}

export interface ProjectPlan {
  idea: string;
  duration: string;
  tasks: Task[];
}
