import React, { useState, useEffect } from 'react';
import { Folder, Loader2 } from 'lucide-react';
import { Task, TaskStatus, Project } from '../../types';
import { projectsApi } from '../../api/projects';
import { tasksApi } from '../../api/tasks';
import { Header } from '../../components/Header';
import { ProjectInput } from '../../components/ProjectInput';
import { TaskList } from '../../components/TaskList';
import { ProgressBar } from '../../components/ProgressBar';
import { TaskModal } from '../../components/TaskModal';
import { ProjectSidebar } from '../../components/ProjectSidebar';
import { ExpandableText } from '../../components/ExpandableText';
import { useLanguage } from '../../contexts/LanguageContext';

export const DashboardPage: React.FC = () => {
  const { language, t } = useLanguage();

  // Project Input State
  const [projectTitle, setProjectTitle] = useState('');
  const [idea, setIdea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // App State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);

  // Load projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectsApi.getProjects();
        setProjects(data);
        if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
        setError("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const tasks = selectedProject?.tasks || [];

  const handleGenerate = async () => {
    if (!projectTitle || !idea || !startDate || !endDate) {
      setError(t('project.error_missing_fields'));
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const newProject = await projectsApi.createProject({
        title: projectTitle,
        idea,
        startDate,
        endDate,
        language
      });
      
      setProjects(prev => [newProject, ...prev]);
      setSelectedProjectId(newProject.id);
      
      // Reset inputs and close modal
      setProjectTitle('');
      setIdea('');
      setStartDate('');
      setEndDate('');
      setIsProjectModalOpen(false);
    } catch (err) {
      setError(t('project.error_failed'));
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const propagateStatus = (task: Task): TaskStatus => {
    if (!task.subtasks || task.subtasks.length === 0) return task.status;
    const subStatuses = task.subtasks.map(s => propagateStatus(s));
    if (subStatuses.every(s => s === TaskStatus.DONE)) return TaskStatus.DONE;
    if (subStatuses.every(s => s === TaskStatus.CANCELED)) return TaskStatus.CANCELED;
    if (subStatuses.some(s => s === TaskStatus.IN_PROGRESS || s === TaskStatus.DONE)) return TaskStatus.IN_PROGRESS;
    if (subStatuses.some(s => s === TaskStatus.BLOCKED)) return TaskStatus.BLOCKED;
    return TaskStatus.TODO;
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    if (!selectedProjectId) return;

    try {
      // Optimistic update for UI responsiveness
      const updateRecursive = (list: Task[]): Task[] => {
        return list.map(t => {
          let updatedTask = { ...t };
          if (t.id === id) {
            updatedTask = { ...updatedTask, ...updates };
          } else if (t.subtasks) {
            updatedTask.subtasks = updateRecursive(t.subtasks);
          }
          if (updatedTask.subtasks && updatedTask.subtasks.length > 0) {
            updatedTask.status = propagateStatus(updatedTask);
          }
          return updatedTask;
        });
      };

      const optimisticTasks = updateRecursive(tasks);
      setProjects(prev => prev.map(p => 
        p.id === selectedProjectId ? { ...p, tasks: optimisticTasks } : p
      ));

      // Real API call
      const updatedProject = await tasksApi.updateTask(selectedProjectId, id, updates);
      
      // Sync with server response
      setProjects(prev => prev.map(p => 
        p.id === selectedProjectId ? updatedProject : p
      ));
      
      // Update selected task if it's the one being modified
      if (selectedTask) {
        const findTask = (list: Task[]): Task | undefined => {
          for (const t of list) {
            if (t.id === selectedTask.id) return t;
            if (t.subtasks) {
              const found = findTask(t.subtasks);
              if (found) return found;
            }
          }
          return undefined;
        };
        const updatedSelected = findTask(updatedProject.tasks);
        if (updatedSelected) setSelectedTask(updatedSelected);
      }
    } catch (err) {
      console.error("Failed to update task", err);
      // Revert or show error
    }
  };

  const handleAddTask = (parentId: string | null = null) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: t('task.new_task'),
      status: TaskStatus.TODO,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      details: '',
      subtasks: []
    };
    setSelectedTask(newTask);
    setIsCreating(true);
    setParentTaskId(parentId);
  };

  const handleSaveNewTask = async (taskUpdates: Partial<Task>) => {
    if (!selectedTask || !selectedProjectId) return;
    
    const newTask: Task = {
      ...selectedTask,
      ...taskUpdates,
    };

    try {
      const updatedProject = await tasksApi.addTask(selectedProjectId, parentTaskId, newTask);
      setProjects(prev => prev.map(p => p.id === selectedProjectId ? updatedProject : p));
      setSelectedTask(null);
      setIsCreating(false);
      setParentTaskId(null);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const deleteTask = async (id: string) => {
    if (!selectedProjectId) return;
    try {
      const updatedProject = await tasksApi.deleteTask(selectedProjectId, id);
      setProjects(prev => prev.map(p => p.id === selectedProjectId ? updatedProject : p));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm(t('project.delete_confirm'))) {
      try {
        await projectsApi.deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        if (selectedProjectId === id) {
          setSelectedProjectId(null);
        }
      } catch (err) {
        console.error("Failed to delete project", err);
      }
    }
  };

  const clearAll = async () => {
    if (confirm(t('project.clear_confirm'))) {
      try {
        await projectsApi.clearAllProjects();
        setProjects([]);
        setSelectedProjectId(null);
      } catch (err) {
        console.error("Failed to clear projects", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50/30">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Loading your workspace...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar */}
            <ProjectSidebar 
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onDeleteProject={handleDeleteProject}
              width={sidebarWidth}
              onWidthChange={setSidebarWidth}
              onCreateClick={() => setIsProjectModalOpen(true)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
              {/* Task List Section */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  {selectedProject ? (
                    <>
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Folder size={24} />
                          </div>
                          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{selectedProject.title}</h1>
                        </div>
                        <ExpandableText text={selectedProject.idea} />
                        
                        <ProgressBar tasks={tasks} />
                      </div>
                      
                      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                        <TaskList 
                          tasks={tasks}
                          onStatusChange={(id, status) => handleUpdateTask(id, { status })}
                          onDelete={deleteTask}
                          onTaskClick={(task) => {
                            setSelectedTask(task);
                            setIsCreating(false);
                          }}
                          onAddTask={() => handleAddTask(null)}
                          onAddSubtask={(parentId) => handleAddTask(parentId)}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                        <Folder className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{t('project.no_selected')}</h3>
                      <p className="text-slate-500 max-w-xs mt-2">{t('project.no_selected_desc')}</p>
                      <button
                        onClick={() => setIsProjectModalOpen(true)}
                        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                      >
                        {t('project.create_first')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Project Creation Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{t('project.create')}</h2>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <Folder size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-8">
              <ProjectInput 
                title={projectTitle}
                setTitle={setProjectTitle}
                idea={idea}
                setIdea={setIdea}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      <TaskModal 
        task={selectedTask} 
        onClose={() => {
          setSelectedTask(null);
          setIsCreating(false);
          setParentTaskId(null);
        }} 
        onStatusChange={(id, status) => handleUpdateTask(id, { status })}
        onUpdate={handleUpdateTask}
        isNew={isCreating}
        onSaveNew={handleSaveNewTask}
      />
    </div>
  );
};
