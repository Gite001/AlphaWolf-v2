'use client';

import { useFormStatus } from 'react-dom';
import { handlePulseAnalysis } from '@/app/pulse/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeMarketplaceTrendsOutput } from '@/ai/flows/analyze-marketplace-trends';
import { Loader2 } from 'lucide-react';
import { PulseResults } from './pulse-results';
import { useI18n } from '@/hooks/use-i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supportedMarketplaces } from '@/lib/types';

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
      {t('PulseForm.submitButton')}
    </Button>
  );
}

export function PulseForm() {
  const [state, formAction] = useActionState(handlePulseAnalysis, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<AnalyzeMarketplaceTrendsOutput | null>(null);

  useEffect(() => {
    if (state.message && state.message !== 'Marketplace analysis complete.') {
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
        description: t('PulseForm.toast.successDescription'),
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
                <Label htmlFor="marketplace">{t('PulseForm.marketplace.label')}</Label>
                <Select name="marketplace" defaultValue={supportedMarketplaces[0]}>
                    <SelectTrigger id="marketplace">
                        <SelectValue placeholder={t('PulseForm.marketplace.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {supportedMarketplaces.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.marketplace && <p className="text-sm text-destructive">{state.errors.marketplace[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="productCategory">{t('PulseForm.productCategory.label')}</Label>
                <Input id="productCategory" name="productCategory" placeholder={t('PulseForm.productCategory.placeholder')} required />
                {state.errors?.productCategory && <p className="text-sm text-destructive">{state.errors.productCategory[0]}</p>}
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="region">{t('PulseForm.region.label')}</Label>
            <Input id="region" name="region" placeholder={t('PulseForm.region.placeholder')} required />
            {state.errors?.region && <p className="text-sm text-destructive">{state.errors.region[0]}</p>}
        </div>
        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <PulseResults results={result} />
        </div>
      )}
    </div>
  );
}
