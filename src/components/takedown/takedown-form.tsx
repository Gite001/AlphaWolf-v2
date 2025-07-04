'use client';

import { useFormStatus } from 'react-dom';
import { handleTakedownGeneration } from '@/app/takedown/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateTakedownPlanOutput } from '@/ai/flows/generate-takedown-plan';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { TakedownResults } from './takedown-results';

const initialState: {
  message: string;
  data: GenerateTakedownPlanOutput | null;
  errors: any;
} = {
  message: '',
  data: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {t('TakedownForm.submitButton')}
    </Button>
  );
}

export function TakedownForm() {
  const [state, formAction] = useActionState(handleTakedownGeneration, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<GenerateTakedownPlanOutput | null>(null);
  
  useEffect(() => {
    if (state.message && state.message !== 'Takedown plan generation complete.') {
      toast({
        variant: 'destructive',
        title: t('Toast.errorTitle'),
        description: state.message,
      });
    }
    if (state.data) {
      setResult(state.data);
      toast({
        title: t('Toast.successTitle'),
        description: t('TakedownForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        
        <div className="space-y-2">
            <Label htmlFor="url">{t('TakedownForm.url.label')}</Label>
            <Input id="url" name="url" placeholder="https://www.competitor.com/product" required type="url" />
            {state.errors?.url && <p className="text-sm text-destructive">{state.errors.url[0]}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="yourProductName">{t('TakedownForm.yourProductName.label')}</Label>
            <Input id="yourProductName" name="yourProductName" placeholder={t('TakedownForm.yourProductName.placeholder')} required />
            {state.errors?.yourProductName && <p className="text-sm text-destructive">{state.errors.yourProductName[0]}</p>}
        </div>

        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <TakedownResults results={result} />
        </div>
      )}
    </div>
  );
}
