import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'KeepCalmAndDoing',
    'project.title': 'Project Title',
    'project.idea': 'Your Idea',
    'project.start': 'Start Date',
    'project.end': 'End Date',
    'project.generate': 'Generate AI Plan',
    'project.generating': 'Generating Your Plan...',
    'project.create': 'Create New Project',
    'project.no_selected': 'No project selected',
    'project.no_selected_desc': 'Select a project from the sidebar or create a new one to get started.',
    'project.create_first': 'Create Your First Project',
    'project.title_placeholder': 'e.g., Personal Portfolio 2024',
    'project.idea_placeholder': 'e.g., Build a personal portfolio website with Next.js',
    'project.error_missing_fields': 'Please enter a title, idea, and select both start and end dates.',
    'project.error_failed': 'Failed to generate plan. Please try again.',
    'project.delete_confirm': 'Are you sure you want to delete this project?',
    'project.clear_confirm': 'Are you sure you want to clear all projects?',
    'sidebar.projects': 'Projects',
    'sidebar.no_projects': 'No projects yet.',
    'sidebar.create_new': 'Create New',
    'progress.overall': 'Overall Completion',
    'task.list_title': 'Project Tasks',
    'task.main_tasks': 'Main Tasks',
    'task.no_plan': 'No plan generated yet',
    'task.no_plan_desc': 'Enter your project idea and duration above to get a detailed AI-powered task breakdown.',
    'task.edit': 'Edit',
    'task.start_time': 'Start Time',
    'task.end_time': 'End Time',
    'task.execution_plan': 'Execution Plan & Resources',
    'task.details_placeholder': 'Enter detailed instructions, description, and links...',
    'task.no_details': 'No details provided.',
    'task.save_changes': 'Save Changes',
    'task.close': 'Close',
    'task.overdue': 'OVERDUE',
    'task.due': 'Due',
    'task.new_task': 'New Task',
    'task.add': 'Add Task',
    'task.add_sub': 'Add Subtask',
    'task.delete': 'Delete',
    'task.status.todo': 'To Do',
    'task.status.in_progress': 'In Progress',
    'task.status.done': 'Done',
    'task.status.blocked': 'Blocked',
    'task.status.canceled': 'Canceled',
    'common.read_more': 'Read more',
    'common.show_less': 'Show less',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.not_set': 'Not set',
    'common.delete_confirm': 'Are you sure you want to delete this?',
    'common.english': 'English',
    'common.vietnamese': 'Vietnamese',
    'auth.sign_out': 'Sign Out',
    'auth.profile': 'Profile',
    'auth.settings': 'Settings',
    'login.tagline': 'AI-Powered Project Planning & Management',
    'login.google': 'Continue with Google',
    'login.demo': 'Demo Access',
    'login.enter': 'Enter Dashboard',
    'login.terms': 'By continuing, you agree to our Terms of Service and Privacy Policy.',
  },
  vi: {
    'app.title': 'KeepCalmAndDoing',
    'project.title': 'Tiêu đề dự án',
    'project.idea': 'Ý tưởng của bạn',
    'project.start': 'Ngày bắt đầu',
    'project.end': 'Ngày kết thúc',
    'project.generate': 'Lập kế hoạch AI',
    'project.generating': 'Đang lập kế hoạch...',
    'project.create': 'Tạo dự án mới',
    'project.no_selected': 'Chưa chọn dự án',
    'project.no_selected_desc': 'Chọn một dự án từ thanh bên hoặc tạo dự án mới để bắt đầu.',
    'project.create_first': 'Tạo dự án đầu tiên',
    'project.title_placeholder': 'vd: Portfolio cá nhân 2024',
    'project.idea_placeholder': 'vd: Xây dựng website portfolio cá nhân bằng Next.js',
    'project.error_missing_fields': 'Vui lòng nhập tiêu đề, ý tưởng và chọn cả ngày bắt đầu và ngày kết thúc.',
    'project.error_failed': 'Không thể lập kế hoạch. Vui lòng thử lại.',
    'project.delete_confirm': 'Bạn có chắc chắn muốn xóa dự án này không?',
    'project.clear_confirm': 'Bạn có chắc chắn muốn xóa tất cả dự án không?',
    'sidebar.projects': 'Dự án',
    'sidebar.no_projects': 'Chưa có dự án nào.',
    'sidebar.create_new': 'Tạo mới',
    'progress.overall': 'Tiến độ tổng thể',
    'task.list_title': 'Danh sách công việc',
    'task.main_tasks': 'Công việc chính',
    'task.no_plan': 'Chưa có kế hoạch nào',
    'task.no_plan_desc': 'Nhập ý tưởng và thời gian dự án ở trên để nhận bảng phân tích công việc chi tiết từ AI.',
    'task.edit': 'Chỉnh sửa',
    'task.start_time': 'Thời gian bắt đầu',
    'task.end_time': 'Thời gian kết thúc',
    'task.execution_plan': 'Kế hoạch thực hiện & Tài nguyên',
    'task.details_placeholder': 'Nhập hướng dẫn chi tiết, mô tả và các liên kết...',
    'task.no_details': 'Không có chi tiết nào được cung cấp.',
    'task.save_changes': 'Lưu thay đổi',
    'task.close': 'Đóng',
    'task.overdue': 'QUÁ HẠN',
    'task.due': 'Hạn',
    'task.new_task': 'Công việc mới',
    'task.add': 'Thêm công việc',
    'task.add_sub': 'Thêm việc con',
    'task.delete': 'Xóa',
    'task.status.todo': 'Cần làm',
    'task.status.in_progress': 'Đang làm',
    'task.status.done': 'Hoàn thành',
    'task.status.blocked': 'Bị chặn',
    'task.status.canceled': 'Đã hủy',
    'common.read_more': 'Xem thêm',
    'common.show_less': 'Thu gọn',
    'common.cancel': 'Hủy',
    'common.save': 'Lưu',
    'common.not_set': 'Chưa thiết lập',
    'common.delete_confirm': 'Bạn có chắc chắn muốn xóa không?',
    'common.english': 'Tiếng Anh',
    'common.vietnamese': 'Tiếng Việt',
    'auth.sign_out': 'Đăng xuất',
    'auth.profile': 'Hồ sơ',
    'auth.settings': 'Cài đặt',
    'login.tagline': 'Lập kế hoạch & Quản lý dự án bằng AI',
    'login.google': 'Tiếp tục với Google',
    'login.demo': 'Truy cập Demo',
    'login.enter': 'Vào Dashboard',
    'login.terms': 'Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('keepcalm_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('keepcalm_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
