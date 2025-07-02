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
import { TrendsResults } from '@/components/trends/trends-results';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

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
      Analyser maintenant
    </Button>
  );
}

export function MarketSnapshot() {
  const [state, formAction] = useActionState(handleTrendsAnalysis, initialState);
  const { toast } = useToast();
  const [result, setResult] = useState<AnalyzeMarketTrendsOutput | null>(null);

  useEffect(() => {
    if (state.message && !state.data) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: state.message,
      });
    }
    if (state.data) {
      setResult(state.data);
    }
  }, [state, toast]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Aperçu du Marché</CardTitle>
            <CardDescription>Obtenez une analyse rapide de n'importe quelle catégorie de produits.</CardDescription>
        </CardHeader>
        <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="productCategoryDashboard">Catégorie de Produit</Label>
                    <Input id="productCategoryDashboard" name="productCategory" placeholder="ex: Équipement de fitness à domicile" required />
                    {state.errors?.productCategory && <p className="text-sm text-destructive">{state.errors.productCategory[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="regionDashboard">Région / Marché</Label>
                    <Input id="regionDashboard" name="region" placeholder="ex: France" required />
                    {state.errors?.region && <p className="text-sm text-destructive">{state.errors.region[0]}</p>}
                </div>
                <SubmitButton />
            </form>
            {result && (
                <div className="mt-6 pt-6 border-t">
                    <TrendsResults results={result} />
                </div>
            )}
        </CardContent>
    </Card>
  );
}
