'use client';

import { useFormStatus } from 'react-dom';
import { handleCompetitorAnalysis } from '@/app/spy/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeCompetitorAdOutput } from '@/ai/flows/analyze-competitor-ad';
import { Loader2 } from 'lucide-react';
import { CompetitorResults } from './competitor-results';
import { useI18n } from '@/hooks/use-i18n';

const initialState = {
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
      {t('CompetitorForm.submitButton')}
    </Button>
  );
}

export function CompetitorForm() {
  const [state, formAction] = useActionState(handleCompetitorAnalysis, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<AnalyzeCompetitorAdOutput | null>(null);

  useEffect(() => {
    if (state.message && state.message !== 'Competitor analysis complete.') {
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
        description: t('CompetitorForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        <div className="space-y-2">
            <Label htmlFor="url">{t('CompetitorForm.url.label')}</Label>
            <Input id="url" name="url" placeholder="https://www.competitor.com/product-page" required type="url" />
            {state.errors?.url && <p className="text-sm text-destructive">{state.errors.url[0]}</p>}
        </div>
        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <CompetitorResults results={result} />
        </div>
      )}
    </div>
  );
}
