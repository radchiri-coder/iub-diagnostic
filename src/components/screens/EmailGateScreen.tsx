import { useState } from 'react';
import type { LeadCapture } from '@/engine/types';
import { validateLeadInput } from '@/engine/validation';
import { sanitizeInput } from '@/utils/email';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EmailGateScreenProps {
  onSubmit: (lead: LeadCapture) => void;
  onSkip: () => void;
}

export function EmailGateScreen({ onSubmit, onSkip }: EmailGateScreenProps) {
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [errors, setErrors] = useState<{ email?: string; telegram?: string }>({});

  const handleSubmit = () => {
    const trimEmail = email.trim();
    const trimTg = telegram.trim();
    const validation = validateLeadInput(
      trimEmail || undefined,
      trimTg || undefined
    );

    if (!validation.isValid) {
      setErrors({
        email: validation.emailError,
        telegram: validation.telegramError,
      });
      return;
    }

    setErrors({});
    onSubmit({
      status: 'completed',
      email: trimEmail ? sanitizeInput(trimEmail) : undefined,
      telegram: trimTg ? sanitizeInput(trimTg) : undefined,
      consentGiven: true,
      capturedAt: Date.now(),
    });
  };

  return (
    <Container className="min-h-[100dvh] flex flex-col justify-center">
      <div className="animate-fade-up">
        <h2 className="font-serif text-2xl font-bold">
          Ваш отчёт готов
        </h2>
        <p className="mt-3 text-[15px] text-ink-secondary leading-relaxed">
          Укажите контакт, чтобы получить полный отчёт с детальными
          интерпретациями и персональными рекомендациями.
        </p>

        <div className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="name@company.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="text-xs text-ink-muted">или</span>
            <div className="h-px flex-1 bg-ink/10" />
          </div>
          <Input
            label="Telegram"
            type="text"
            placeholder="@username"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            error={errors.telegram}
          />
        </div>

        <div className="mt-8 space-y-3">
          <Button onClick={handleSubmit} className="w-full">
            Получить полный отчёт
          </Button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-center text-sm text-ink-muted hover:text-ink transition-colors py-2"
          >
            Пропустить и посмотреть базовый результат
          </button>
        </div>

        <p className="mt-6 text-xs text-ink-muted leading-relaxed">
          Демо-версия: данные сохраняются только в вашем браузере
          и не отправляются на сервер.
        </p>
      </div>
    </Container>
  );
}
