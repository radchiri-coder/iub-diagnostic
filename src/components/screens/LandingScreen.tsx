import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <Container className="flex min-h-[100dvh] flex-col justify-between">
      <div className="flex-1 flex flex-col justify-center py-12">
        {/* Hero */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
          Где ваш бизнес теряет энергию?
        </h1>
        <p className="mt-4 text-lg text-ink-secondary leading-relaxed">
          21 ситуация из жизни управленца. 7 минут.
          <br className="hidden sm:block" />
          Карта системных рисков вашей компании.
        </p>

        {/* Benefits */}
        <ul className="mt-8 space-y-3">
          {[
            'Увидите 6 зон управляемости — от стратегии до работы с людьми',
            'Получите персонализированный отчёт с конкретными рекомендациями',
            'Сравните свой результат с ориентирами для похожих компаний',
          ].map((text) => (
            <li key={text} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-[15px] text-ink-secondary leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-10">
          <Button onClick={onStart} className="w-full sm:w-auto text-base px-8 py-3.5">
            Начать диагностику
          </Button>
        </div>
      </div>

      {/* Trust block */}
      <footer className="border-t border-ink/10 pt-6 pb-4 space-y-3">
        <p className="text-sm text-ink-secondary">
          <span className="font-medium text-ink">Ирина Радченко</span> — независимый управленческий
          консультант, 17+ лет опыта, фасилитатор стратегических сессий.
        </p>
        <p className="text-xs text-ink-muted leading-relaxed">
          Методология основана на практике работы с компаниями от 10 до 250 сотрудников
          в IT, EdTech, медиа, производстве и сервисных отраслях. Это экспертный инструмент
          рефлексии, а не психометрический тест. Результат — не диагноз, а карта для разговора.
        </p>
      </footer>
    </Container>
  );
}
