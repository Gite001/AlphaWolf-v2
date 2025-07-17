'use client';

import { useFormStatus } from 'react-dom';
import { getWinningProducts } from '@/app/finder/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bot } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import type { FindWinningProductsOutput } from '@/ai/flows/find-winning-products';
import { FinderResults } from './finder-results';
import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';
import { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const initialState: {
  data: FindWinningProductsOutput | null;
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
      {t('FinderForm.submitButton')}
    </Button>
  );
}

export function FinderForm() {
  const [state, formAction, isPending] = useActionState(getWinningProducts, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<FindWinningProductsOutput | null>(null);
  
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
        description: t('FinderForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="query">{t('FinderForm.query.label')}</Label>
            <Input id="query" name="query" placeholder={t('FinderForm.query.placeholder')} required />
            {state.errors?.query && <p className="text-sm text-destructive">{state.errors.query[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">{t('FinderForm.country.label')}</Label>
            <Input id="country" name="country" placeholder={t('FinderForm.country.placeholder')} required defaultValue="us" />
            {state.errors?.country && <p className="text-sm text-destructive">{state.errors.country[0]}</p>}
          </div>
        </div>
        <SubmitButton />
      </form>
      
      <div className="mt-8 pt-8 border-t">
        {isPending && (
            <div className="space-y-8 animate-in fade-in duration-500">
                <Card className="bg-card/30 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary animate-pulse" />
                            <span>{t('FinderAnalysis.loading.title')}</span>
                        </CardTitle>
                        <CardDescription>{t('FinderAnalysis.loading.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full bg-secondary/50" />
                        <Skeleton className="h-4 w-5/6 bg-secondary/50" />
                        <div className="pt-4 space-y-3">
                            <Skeleton className="h-24 w-full bg-secondary/50" />
                            <Skeleton className="h-24 w-full bg-secondary/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
        {result && !isPending && (
            <FinderResults results={result} />
        )}
      </div>
    </div>
  );
}
```