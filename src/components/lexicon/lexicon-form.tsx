'use client';

import { useFormStatus } from 'react-dom';
import { handleTermDefinition } from '@/app/lexicon/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { DefineAdTermOutput } from '@/ai/flows/define-ad-term';
import { Loader2 } from 'lucide-react';
import { LexiconResults } from './lexicon-results';
import { useI18n } from '@/hooks/use-i18n';

type ResultState = (DefineAdTermOutput & { term: string }) | null;

const initialState: {
  data: ResultState;
  error: string | null;
  errors: any;
} = {
  data: null,
  error: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {t('LexiconForm.submitButton')}
    </Button>
  );
}

export function LexiconForm() {
  const [state, formAction] = useActionState(handleTermDefinition, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<ResultState>(null);
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: t('Toast.errorTitle'),
        description: state.error,
      });
    }
    if (state.data) {
      setResult(state.data);
      toast({
        title: t('Toast.successTitle'),
        description: t('LexiconForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        
        <div className="space-y-2">
            <Label htmlFor="term">{t('LexiconForm.term.label')}</Label>
            <Input id="term" name="term" placeholder={t('LexiconForm.term.placeholder')} required />
            {state.errors?.term && <p className="text-sm text-destructive">{state.errors.term[0]}</p>}
        </div>

        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <LexiconResults results={result} />
        </div>
      )}
    </div>
  );
}
