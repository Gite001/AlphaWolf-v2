'use client';

import { useFormStatus } from 'react-dom';
import { handleTrendsAnalysis } from '@/app/trends/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';
import { Loader2 } from 'lucide-react';
import { TrendsResults } from './trends-results';

const initialState = {
  message: '',
  data: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Analyser les Tendances
    </Button>
  );
}

export function TrendsForm() {
  const [state, formAction] = useActionState(handleTrendsAnalysis, initialState);
  const { toast } = useToast();
  const [result, setResult] = useState<AnalyzeMarketTrendsOutput | null>(null);

  useEffect(() => {
    if (state.message && state.message !== 'Market analysis complete.') {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: state.message,
      });
    }
    if (state.data) {
      setResult(state.data);
      toast({
        title: 'Succès !',
        description: 'Votre analyse de marché est prête.',
      });
    }
  }, [state, toast]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="productCategory">Catégorie de Produit</Label>
            <Input id="productCategory" name="productCategory" placeholder="ex: Articles de maison durables" required />
            {state.errors?.productCategory && <p className="text-sm text-destructive">{state.errors.productCategory[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Région / Marché</Label>
            <Input id="region" name="region" placeholder="ex: Amérique du Nord, Europe" required />
            {state.errors?.region && <p className="text-sm text-destructive">{state.errors.region[0]}</p>}
          </div>
        </div>
        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <TrendsResults results={result} />
        </div>
      )}
    </div>
  );
}
