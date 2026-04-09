import type { Category, CompanyStage } from '@/engine/types';

export const CATEGORIES: Category[] = [
  {
    id: 'clarity',
    name: 'Ясность курса',
    shortName: 'Курс',
    description: 'Стратегический фокус, фильтрация возможностей, стабильность приоритетов',
    color: '#0F6E56',
    icon: '◎',
    order: 1,
    systemicDependencyWeight: 0.9,
    stagePriorityMap: { survival: 0.6, stabilization: 0.8, growth: 1.0, rebuild: 0.9 },
  },
  {
    id: 'decisions',
    name: 'Принятие решений',
    shortName: 'Решения',
    description: 'Скорость, уровень делегирования, разрешение конфликтов',
    color: '#185FA5',
    icon: '⟐',
    order: 2,
    systemicDependencyWeight: 0.85,
    stagePriorityMap: { survival: 0.9, stabilization: 0.7, growth: 0.8, rebuild: 0.7 },
  },
  {
    id: 'execution',
    name: 'Доведение до результата',
    shortName: 'Результат',
    description: 'Исполнительская дисциплина, контроль, прозрачность задач',
    color: '#993C1D',
    icon: '▸',
    order: 3,
    systemicDependencyWeight: 0.8,
    stagePriorityMap: { survival: 0.8, stabilization: 0.9, growth: 0.9, rebuild: 0.6 },
  },
  {
    id: 'structure',
    name: 'Структура и роли',
    shortName: 'Структура',
    description: 'Зоны ответственности, замещаемость, распределение задач',
    color: '#534AB7',
    icon: '⊞',
    order: 4,
    systemicDependencyWeight: 0.75,
    stagePriorityMap: { survival: 0.4, stabilization: 0.9, growth: 1.0, rebuild: 0.8 },
  },
  {
    id: 'teamwork',
    name: 'Командное взаимодействие',
    shortName: 'Команда',
    description: 'Доверие, открытость ошибок, горизонтальные связи',
    color: '#993556',
    icon: '⬡',
    order: 5,
    systemicDependencyWeight: 0.7,
    stagePriorityMap: { survival: 0.5, stabilization: 0.7, growth: 0.8, rebuild: 0.6 },
  },
  {
    id: 'people',
    name: 'Работа с людьми',
    shortName: 'Люди',
    description: 'Адаптация, обратная связь, удержание, развитие',
    color: '#854F0B',
    icon: '⏣',
    order: 6,
    systemicDependencyWeight: 0.65,
    stagePriorityMap: { survival: 0.4, stabilization: 0.6, growth: 0.9, rebuild: 0.5 },
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<string, Category>;

export function getCategoryColor(id: string): string {
  return CATEGORY_MAP[id]?.color ?? '#6B6B66';
}
