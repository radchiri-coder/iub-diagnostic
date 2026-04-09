import { useState } from 'react';
import type { CompanySize, CompanyStage, IndustryId } from '@/engine/types';
import { COMPANY_SIZES, COMPANY_STAGES, INDUSTRIES } from '@/config/context-options';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { RadioCard } from '@/components/ui/RadioCard';

interface ContextScreenProps {
  onSubmit: (size: CompanySize, stage: CompanyStage, industry: IndustryId) => void;
  initialSize?: CompanySize;
  initialStage?: CompanyStage;
  initialIndustry?: IndustryId;
}

export function ContextScreen({ onSubmit, initialSize, initialStage, initialIndustry }: ContextScreenProps) {
  const [size, setSize] = useState<CompanySize | ''>(initialSize ?? '');
  const [stage, setStage] = useState<CompanyStage | ''>(initialStage ?? '');
  const [industry, setIndustry] = useState<IndustryId | ''>(initialIndustry ?? '');

  const canProceed = size !== '' && stage !== '' && industry !== '';

  const handleSubmit = () => {
    if (canProceed) {
      onSubmit(size as CompanySize, stage as CompanyStage, industry as IndustryId);
    }
  };

  return (
    <Container>
      <h2 className="font-serif text-2xl font-bold">О вашей компании</h2>
      <p className="mt-2 text-sm text-ink-secondary">
        Эти данные помогут дать более точную интерпретацию результатов.
      </p>

      {/* Size */}
      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-ink-secondary mb-3">
          Сколько человек работает в компании?
        </legend>
        <div className="grid gap-2">
          {COMPANY_SIZES.map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={size === opt.value}
              accentColor="#0F6E56"
              onClick={() => setSize(opt.value)}
            />
          ))}
        </div>
      </fieldset>

      {/* Stage */}
      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-ink-secondary mb-3">
          Что лучше описывает текущую ситуацию?
        </legend>
        <div className="grid gap-2">
          {COMPANY_STAGES.map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={stage === opt.value}
              accentColor="#0F6E56"
              onClick={() => setStage(opt.value)}
            />
          ))}
        </div>
      </fieldset>

      {/* Industry */}
      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-ink-secondary mb-3">
          Отрасль
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INDUSTRIES.map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              selected={industry === opt.value}
              accentColor="#0F6E56"
              onClick={() => setIndustry(opt.value)}
            />
          ))}
        </div>
      </fieldset>

      {/* CTA */}
      <div className="mt-10">
        <Button onClick={handleSubmit} disabled={!canProceed} className="w-full sm:w-auto">
          К вопросам
        </Button>
      </div>
    </Container>
  );
}
