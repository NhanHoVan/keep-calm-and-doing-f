import { 
  Circle, 
  PlayCircle, 
  CheckCircle2, 
  AlertCircle, 
  XCircle 
} from 'lucide-react';
import { TaskStatus } from './types';

export const STATUS_CONFIG = {
  [TaskStatus.TODO]: { icon: Circle, color: 'text-slate-400', label: 'To Do', class: 'status-todo' },
  [TaskStatus.IN_PROGRESS]: { icon: PlayCircle, color: 'text-blue-500', label: 'In Progress', class: 'status-progress' },
  [TaskStatus.DONE]: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Done', class: 'status-done' },
  [TaskStatus.BLOCKED]: { icon: AlertCircle, color: 'text-rose-500', label: 'Blocked', class: 'status-blocked' },
  [TaskStatus.CANCELED]: { icon: XCircle, color: 'text-slate-300', label: 'Canceled', class: 'status-canceled' },
};
