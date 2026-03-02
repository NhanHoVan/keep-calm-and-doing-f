import { Project, Task, TaskStatus, User, Language } from '../types';
import { generatePlan } from '../services/gemini';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated Database
const DB_KEYS = {
  PROJECTS: 'keepcalm_projects_v2',
  AUTH: 'keepcalm_auth',
  USER: 'keepcalm_user'
};

const getStored = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setStored = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export function setupMocks() {
  // Enable mocks if VITE_MODE is DEV or if we are in development mode and VITE_MODE is not explicitly set to something else
  const isDev = import.meta.env.DEV || import.meta.env.VITE_MODE === "DEV";
  if (!isDev) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).__MOCK_ENABLED__) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__MOCK_ENABLED__ = true;

  const originalFetch = window.fetch.bind(window);

  const mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let urlString: string;
    let method: string;
    let body: any = null;

    if (input instanceof Request) {
      urlString = input.url;
      method = init?.method ?? input.method;
    } else {
      urlString = input.toString();
      method = init?.method ?? "GET";
    }

    const url = new URL(urlString, window.location.origin);
    const path = url.pathname;

    if (init?.body) {
      try {
        body = JSON.parse(init.body as string);
      } catch (e) {
        body = init.body;
      }
    }

    console.log(`[Mock Fetch] ${method} ${path}`, body);

    // Auth
    if (path === "/api/auth/login" && method === "POST") {
      const user = await mockHandlers.login();
      return new Response(JSON.stringify(user), { status: 200 });
    }
    if (path === "/api/auth/google" && method === "POST") {
      const user = await mockHandlers.login(); // Reuse mock login for simplicity
      return new Response(JSON.stringify(user), { status: 200 });
    }
    if (path === "/api/auth/logout" && method === "POST") {
      await mockHandlers.logout();
      return new Response(null, { status: 204 });
    }
    if (path === "/api/auth/session" && method === "GET") {
      const user = await mockHandlers.getCurrentUser();
      if (user) return new Response(JSON.stringify(user), { status: 200 });
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Projects
    if (path === "/api/projects" && method === "GET") {
      const projects = await mockHandlers.getProjects();
      return new Response(JSON.stringify(projects), { status: 200 });
    }
    if (path === "/api/projects" && method === "POST") {
      const project = await mockHandlers.createProject(body);
      return new Response(JSON.stringify(project), { status: 201 });
    }
    if (path.match(/\/api\/projects\/[^/]+$/) && method === "GET") {
      const id = path.split('/').pop()!;
      const projects = await mockHandlers.getProjects();
      const project = projects.find(p => p.id === id);
      if (project) return new Response(JSON.stringify(project), { status: 200 });
      return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
    }
    if (path.match(/\/api\/projects\/[^/]+$/) && method === "DELETE") {
      const id = path.split('/').pop()!;
      await mockHandlers.deleteProject(id);
      return new Response(null, { status: 204 });
    }
    if (path === "/api/projects" && method === "DELETE") {
      await mockHandlers.clearAllProjects();
      return new Response(null, { status: 204 });
    }

    // Tasks
    if (path.match(/\/api\/projects\/[^/]+\/tasks$/) && method === "POST") {
      const parts = path.split('/');
      const projectId = parts[parts.length - 2];
      const project = await mockHandlers.addTask(projectId, body.parentId, body.task);
      return new Response(JSON.stringify(project), { status: 201 });
    }
    if (path.match(/\/api\/projects\/[^/]+\/tasks\/[^/]+$/) && method === "PATCH") {
      const parts = path.split('/');
      const taskId = parts.pop()!;
      const projectId = parts[parts.length - 2];
      const project = await mockHandlers.updateTask(projectId, taskId, body);
      return new Response(JSON.stringify(project), { status: 200 });
    }
    if (path.match(/\/api\/projects\/[^/]+\/tasks\/[^/]+$/) && method === "DELETE") {
      const parts = path.split('/');
      const taskId = parts.pop()!;
      const projectId = parts[parts.length - 2];
      const project = await mockHandlers.deleteTask(projectId, taskId);
      return new Response(JSON.stringify(project), { status: 200 });
    }

    return originalFetch(input, init);
  };

  try {
    window.fetch = mockFetch;
  } catch (e) {
    console.warn("Direct fetch override failed, trying Object.defineProperty", e);
    Object.defineProperty(window, 'fetch', {
      value: mockFetch,
      configurable: true,
      writable: true
    });
  }
}

export const mockHandlers = {
  // Auth
  login: async (): Promise<User> => {
    await delay(800);
    const mockUser: User = {
      id: '1',
      name: 'Nhan Ho Van',
      email: 'nhanhv.qt@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nhan',
      role: 'USER',
      status: 1
    };
    localStorage.setItem(DB_KEYS.AUTH, 'true');
    setStored(DB_KEYS.USER, mockUser);
    return mockUser;
  },

  logout: async (): Promise<void> => {
    await delay(500);
    localStorage.removeItem(DB_KEYS.AUTH);
    localStorage.removeItem(DB_KEYS.USER);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const auth = localStorage.getItem(DB_KEYS.AUTH);
    const user = getStored<User>(DB_KEYS.USER);
    if (auth === 'true' && user) return user;
    return null;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    await delay(600);
    return getStored<Project[]>(DB_KEYS.PROJECTS) || [];
  },

  createProject: async (data: { title: string; idea: string; startDate: string; endDate: string; language: Language }): Promise<Project> => {
    await delay(1500);
    const tasks = await generatePlan(data.idea, data.startDate, data.endDate, data.language);
    
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      idea: data.idea,
      startDate: data.startDate,
      endDate: data.endDate,
      tasks: tasks,
      createdAt: new Date().toISOString()
    };

    const projects = getStored<Project[]>(DB_KEYS.PROJECTS) || [];
    setStored(DB_KEYS.PROJECTS, [newProject, ...projects]);
    return newProject;
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay(400);
    const projects = getStored<Project[]>(DB_KEYS.PROJECTS) || [];
    setStored(DB_KEYS.PROJECTS, projects.filter(p => p.id !== id));
  },

  clearAllProjects: async (): Promise<void> => {
    await delay(500);
    setStored(DB_KEYS.PROJECTS, []);
  },

  // Tasks
  updateTask: async (projectId: string, taskId: string, updates: Partial<Task>): Promise<Project> => {
    await delay(300);
    const projects = getStored<Project[]>(DB_KEYS.PROJECTS) || [];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    const project = { ...projects[projectIndex] };
    const updateRecursive = (list: Task[]): Task[] => {
      return list.map(t => {
        let updatedTask = { ...t };
        if (t.id === taskId) {
          updatedTask = { ...updatedTask, ...updates };
        } else if (t.subtasks) {
          updatedTask.subtasks = updateRecursive(t.subtasks);
        }
        return updatedTask;
      });
    };

    project.tasks = updateRecursive(project.tasks);
    projects[projectIndex] = project;
    setStored(DB_KEYS.PROJECTS, projects);
    return project;
  },

  addTask: async (projectId: string, parentId: string | null, task: Task): Promise<Project> => {
    await delay(400);
    const projects = getStored<Project[]>(DB_KEYS.PROJECTS) || [];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    const project = { ...projects[projectIndex] };
    if (parentId) {
      const addRecursive = (list: Task[]): Task[] => {
        return list.map(t => {
          if (t.id === parentId) {
            return {
              ...t,
              subtasks: [...(t.subtasks || []), task],
              status: TaskStatus.IN_PROGRESS
            };
          }
          if (t.subtasks) {
            return { ...t, subtasks: addRecursive(t.subtasks) };
          }
          return t;
        });
      };
      project.tasks = addRecursive(project.tasks);
    } else {
      project.tasks = [...project.tasks, task];
    }

    projects[projectIndex] = project;
    setStored(DB_KEYS.PROJECTS, projects);
    return project;
  },

  deleteTask: async (projectId: string, taskId: string): Promise<Project> => {
    await delay(300);
    const projects = getStored<Project[]>(DB_KEYS.PROJECTS) || [];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    const project = { ...projects[projectIndex] };
    const deleteRecursive = (list: Task[]): Task[] => {
      return list
        .filter(t => t.id !== taskId)
        .map(t => t.subtasks ? { ...t, subtasks: deleteRecursive(t.subtasks) } : t);
    };

    project.tasks = deleteRecursive(project.tasks);
    projects[projectIndex] = project;
    setStored(DB_KEYS.PROJECTS, projects);
    return project;
  }
};
