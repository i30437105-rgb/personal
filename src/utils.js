import { SPHERE_ICONS_LIST } from './constants';
import { Star } from 'lucide-react';

// ============================================
// ПОЛУЧИТЬ ИКОНКУ СФЕРЫ
// ============================================
export const getSphereIcon = (iconId) => {
  const found = SPHERE_ICONS_LIST.find(i => i.id === iconId);
  return found ? found.icon : Star;
};

// ============================================
// ДЕФОЛТНЫЕ СФЕРЫ
// ============================================
export const getDefaultSpheres = () => [
  { id: 'sphere_money', name: 'Финансы', iconId: 'wallet', isDefault: true, sortOrder: 1 },
  { id: 'sphere_health', name: 'Здоровье', iconId: 'heart', isDefault: true, sortOrder: 2 },
  { id: 'sphere_business', name: 'Бизнес', iconId: 'briefcase', isDefault: true, sortOrder: 3 },
  { id: 'sphere_relationships', name: 'Отношения', iconId: 'heart', isDefault: true, sortOrder: 4 },
  { id: 'sphere_growth', name: 'Саморазвитие', iconId: 'book', isDefault: true, sortOrder: 5 },
];

// ============================================
// ДЕФОЛТНЫЕ ДАННЫЕ
// ============================================
export const getDefaultData = () => ({
  pin: null,
  spheres: getDefaultSpheres(),
  dreams: [],
  goals: [],
  goalCriteria: [],
  milestones: [],
  steps: [],
  tasks: [],
});

// ============================================
// СОРТИРОВКА МЕЧТ
// ============================================
export const sortDreams = (dreams) => {
  return [...dreams].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dream' ? -1 : 1;
    if (a.type === 'dream') {
      if (a.isLeading !== b.isLeading) return a.isLeading ? -1 : 1;
      if (a.isFocused !== b.isFocused) return a.isFocused ? -1 : 1;
    }
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) return a.sortOrder - b.sortOrder;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

// ============================================
// СОРТИРОВКА ЦЕЛЕЙ
// ============================================
export const sortGoals = (goals, sortBy, dreams) => {
  return [...goals].sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'dream') {
      const dreamA = dreams.find(d => d.id === a.dreamId);
      const dreamB = dreams.find(d => d.id === b.dreamId);
      return (dreamA?.title || '').localeCompare(dreamB?.title || '');
    }
    if (sortBy === 'priority') {
      const priorityOrder = { strategic_focus: 0, important: 1, none: 2 };
      return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    }
    return 0;
  });
};

// ============================================
// РАСЧЁТ ПРОГРЕССА ЦЕЛИ
// ============================================
export const calculateGoalProgress = (goal, criteria) => {
  const goalCriteria = criteria.filter(c => c.goalId === goal.id);
  if (goalCriteria.length === 0) return 0;
  
  const progresses = goalCriteria.map(c => {
    if (c.type === 'numeric') {
      if (!c.targetValue || c.targetValue === 0) return 0;
      return Math.min(100, (c.actualValue || 0) / c.targetValue * 100);
    }
    return c.isCompleted ? 100 : 0;
  });
  
  return Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length);
};

// ============================================
// ДНИ ДО ДЕДЛАЙНА
// ============================================
export const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  return diff;
};

// ============================================
// ТЕКУЩИЙ КВАРТАЛ
// ============================================
export const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
};

// ============================================
// ФОРМАТИРОВАНИЕ ДАТЫ
// ============================================
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateLong = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};
