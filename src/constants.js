// ============================================
// ЦВЕТА
// ============================================
export const COLORS = {
  bg: '#0a0908',
  bgCard: '#1a1714',
  bgCardHover: '#252220',
  gold: '#d4a853',
  goldLight: '#f0d78c',
  goldDark: '#8b6914',
  amber: '#b8860b',
  text: '#e8e4de',
  textMuted: '#8a8279',
  textDark: '#5a5550',
  success: '#4a9e6b',
  successSoft: '#2a4a3a',
  warning: '#d4a853',
  danger: '#c45c4a',
  dangerSoft: '#8b4a3a',
  border: '#2a2522',
  prayer: '#6b5b7a',
  prayerLight: '#8b7b9a',
  blue: '#4a7eb8',
  blueSoft: '#2a3a4a',
  red: '#b54a4a',
  redSoft: '#6b3a3a',
  yellow: '#b5944a',
  yellowSoft: '#6b5a3a',
};

// ============================================
// ИКОНКИ СФЕР
// ============================================
import { Wallet, Heart, Briefcase, BookOpen, Star, Target, Trophy, Sun, Moon, Sparkles, Circle, CheckCircle, XCircle } from 'lucide-react';

export const SPHERE_ICONS_LIST = [
  { id: 'wallet', icon: Wallet, label: 'Финансы' },
  { id: 'heart', icon: Heart, label: 'Здоровье' },
  { id: 'briefcase', icon: Briefcase, label: 'Бизнес' },
  { id: 'book', icon: BookOpen, label: 'Развитие' },
  { id: 'star', icon: Star, label: 'Звезда' },
  { id: 'target', icon: Target, label: 'Цель' },
  { id: 'trophy', icon: Trophy, label: 'Победа' },
  { id: 'sun', icon: Sun, label: 'Энергия' },
  { id: 'moon', icon: Moon, label: 'Покой' },
  { id: 'sparkles', icon: Sparkles, label: 'Магия' },
];

// ============================================
// ИКОНКИ ЦЕЛЕЙ
// ============================================
export const GOAL_ICONS = [
  '🎯', '⭐', '🏆', '💰', '💵', '📈', '🏠', '🚗', '✈️', '🎓',
  '📚', '💪', '🏃', '❤️', '👨‍👩‍👧', '🎨', '🎵', '💻', '📱', '🔧',
  '🌍', '🧘', '🍎', '⚡', '🔑', '💎', '🎁', '🌟', '🚀', '🎪'
];

// ============================================
// ПРИОРИТЕТЫ ЦЕЛЕЙ
// ============================================
export const GOAL_PRIORITIES = [
  { id: 'none', label: 'Обычная', color: COLORS.textMuted, bgColor: 'transparent', hasIcon: false },
  { id: 'important', label: 'Важная', color: COLORS.yellow, bgColor: COLORS.yellowSoft, hasIcon: true, iconFilled: false },
  { id: 'strategic_focus', label: 'Стратегический фокус', color: COLORS.red, bgColor: COLORS.redSoft, hasIcon: true, iconFilled: true },
];

// ============================================
// ТИПЫ КРИТЕРИЕВ
// ============================================
export const CRITERIA_TYPES = [
  { id: 'numeric', label: 'Числовой', desc: 'План и факт' },
  { id: 'text', label: 'Текстовый', desc: 'Описание + чекбокс' },
];

export const NUMERIC_TYPES = [
  { id: 'money', label: 'Деньги', unit: '₽' },
  { id: 'count', label: 'Количество', unit: 'шт' },
  { id: 'time', label: 'Время', unit: 'ч' },
  { id: 'percent', label: 'Проценты', unit: '%' },
  { id: 'points', label: 'Баллы', unit: 'б' },
  { id: 'custom', label: 'Своя единица', unit: '' },
];

// ============================================
// СОРТИРОВКА ЦЕЛЕЙ
// ============================================
export const SORT_OPTIONS = [
  { id: 'deadline', label: 'По дедлайну' },
  { id: 'dream', label: 'По мечтам' },
  { id: 'priority', label: 'По приоритету' },
];

// ============================================
// КВАРТАЛЫ
// ============================================
export const QUARTERS = [
  { id: 'Q1', label: 'Кв1', months: [1, 2, 3], monthNames: ['Январь', 'Февраль', 'Март'] },
  { id: 'Q2', label: 'Кв2', months: [4, 5, 6], monthNames: ['Апрель', 'Май', 'Июнь'] },
  { id: 'Q3', label: 'Кв3', months: [7, 8, 9], monthNames: ['Июль', 'Август', 'Сентябрь'] },
  { id: 'Q4', label: 'Кв4', months: [10, 11, 12], monthNames: ['Октябрь', 'Ноябрь', 'Декабрь'] },
];

// ============================================
// СТАТУСЫ РУБЕЖЕЙ
// ============================================
export const MILESTONE_STATUSES = [
  { id: 'pending', label: 'Ожидает', color: COLORS.textMuted, icon: Circle },
  { id: 'passed', label: 'Пройден', color: COLORS.success, icon: CheckCircle },
  { id: 'failed', label: 'Не пройден', color: COLORS.danger, icon: XCircle },
];

// ============================================
// СТАТУСЫ ШАГОВ
// ============================================
export const STEP_STATUSES = [
  { id: 'pending', label: 'В процессе', color: COLORS.textMuted },
  { id: 'completed', label: 'Выполнен', color: COLORS.success },
  { id: 'failed', label: 'Провален', color: COLORS.danger },
];
