import type { ContextOption, CompanySize, CompanyStage, IndustryId } from '@/engine/types';

export const COMPANY_SIZES: ContextOption<CompanySize>[] = [
  { value: 'up_to_15', label: 'До 15 человек', description: 'Микрокоманда' },
  { value: '15_to_50', label: '15–50 человек', description: 'Малый бизнес' },
  { value: '50_to_150', label: '50–150 человек', description: 'Средний бизнес' },
  { value: '150_plus', label: 'Более 150 человек', description: 'Крупный МСБ' },
];

export const COMPANY_STAGES: ContextOption<CompanyStage>[] = [
  {
    value: 'survival',
    label: 'Выживаем',
    description: 'Задача — сохранить рентабельность',
  },
  {
    value: 'stabilization',
    label: 'Стабилизируемся',
    description: 'Наводим порядок после роста или кризиса',
  },
  {
    value: 'growth',
    label: 'Растём',
    description: 'Масштабируем то, что работает',
  },
  {
    value: 'rebuild',
    label: 'Перестраиваемся',
    description: 'Меняем модель, продукт или рынок',
  },
];

export const INDUSTRIES: ContextOption<IndustryId>[] = [
  { value: 'it', label: 'IT и разработка' },
  { value: 'manufacturing', label: 'Производство' },
  { value: 'retail', label: 'Розничная торговля' },
  { value: 'services', label: 'Услуги и сервис' },
  { value: 'construction', label: 'Строительство' },
  { value: 'logistics', label: 'Логистика и транспорт' },
  { value: 'education', label: 'Образование и EdTech' },
  { value: 'healthcare', label: 'Медицина и здоровье' },
  { value: 'horeca', label: 'HoReCa' },
  { value: 'media', label: 'Медиа и реклама' },
  { value: 'finance', label: 'Финансы и страхование' },
  { value: 'other', label: 'Другое' },
];
