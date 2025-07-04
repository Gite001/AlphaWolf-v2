'use client';

import { useFormStatus } from 'react-dom';
import { handlePlanGeneration } from '@/app/plan/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateMarketingPlanOutput } from '@/ai/flows/generate-marketing-plan';
import { budgetLevels, marketingGoals } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PlanResults } from './plan-results';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const initialState: {
  message: string;
  data: GenerateMarketingPlanOutput | null;
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
      {t('PlanForm.submitButton')}
    </Button>
  );
}

export function PlanForm() {
  const [state, formAction] = useActionState(handlePlanGeneration, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<GenerateMarketingPlanOutput | null>(null);
  
  useEffect(() => {
    if (state.message && state.message !== 'Plan generation complete.') {
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
        description: t('PlanForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        
        <div className="space-y-2">
            <Label htmlFor="productName">{t('PlanForm.productName.label')}</Label>
            <Input id="productName" name="productName" placeholder={t('PlanForm.productName.placeholder')} required />
            {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="productDescription">{t('PlanForm.productDescription.label')}</Label>
            <Textarea id="productDescription" name="productDescription" placeholder={t('PlanForm.productDescription.placeholder')} rows={3} required />
            {state.errors?.productDescription && <p className="text-sm text-destructive">{state.errors.productDescription[0]}</p>}
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="targetAudience">{t('PlanForm.targetAudience.label')}</Label>
            <Input id="targetAudience" name="targetAudience" placeholder={t('PlanForm.targetAudience.placeholder')} required />
            {state.errors?.targetAudience && <p className="text-sm text-destructive">{state.errors.targetAudience[0]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <Label>{t('PlanForm.budgetLevel.label')}</Label>
                <RadioGroup name="budgetLevel" defaultValue={budgetLevels[0]} className="flex gap-4">
                    {budgetLevels.map(level => (
                        <div key={level} className="flex items-center space-x-2">
                            <RadioGroupItem value={level} id={`budget-${level}`} />
                            <Label htmlFor={`budget-${level}`}>{t(`PlanForm.budgetLevel.${level}`)}</Label>
                        </div>
                    ))}
                </RadioGroup>
                {state.errors?.budgetLevel && <p className="text-sm text-destructive">{state.errors.budgetLevel[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="marketingGoal">{t('PlanForm.marketingGoal.label')}</Label>
                <Select name="marketingGoal" defaultValue={marketingGoals[1]}>
                    <SelectTrigger id="marketingGoal">
                        <SelectValue placeholder={t('PlanForm.marketingGoal.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {marketingGoals.map(goal => (
                            <SelectItem key={goal} value={goal}>{t(`PlanForm.marketingGoal.${goal.replace(' ','')}`)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.marketingGoal && <p className="text-sm text-destructive">{state.errors.marketingGoal[0]}</p>}
            </div>
        </div>

        <SubmitButton />
        <p className="text-xs text-center text-muted-foreground mt-2 px-4">{t('PlanForm.outputHint')}</p>
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <PlanResults results={result} />
        </div>
      )}
    </div>
  );
}
