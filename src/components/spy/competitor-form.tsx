'use client';

import { useFormStatus } from 'react-dom';
import { handleCompetitorAnalysis } from '@/app/spy/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeCompetitorAdOutput } from '@/ai/flows/analyze-competitor-ad';
import { Loader2, HelpCircle } from 'lucide-react';
import { CompetitorResults } from './competitor-results';
import { useI18n } from '@/hooks/use-i18n';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const formRef = useRef<HTMLFormElement>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    // On success, clear manual mode and show results
    if (state.data) {
      setResult(state.data);
      setShowManualInput(false); // Reset on success
      toast({
        title: t('Toast.successTitle'),
        description: t('CompetitorForm.toast.successDescription'),
      });
      return;
    }
    
    // On error
    if (state.message && state.message !== 'Competitor analysis complete.') {
      // Check for the specific error to trigger Plan B
      if (state.message.includes('requires JavaScript to display content')) {
        setShowManualInput(true);
      } else {
        // For all other errors, show a toast
        setShowManualInput(false);
        toast({
          variant: 'destructive',
          title: t('Toast.errorTitle'),
          description: state.message,
        });
      }
    }
  }, [state, toast, t]);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        <div className="space-y-2">
            <Label htmlFor="url">{t('CompetitorForm.url.label')}</Label>
            <Input 
              id="url" 
              name="url" 
              placeholder="https://www.competitor.com/product-page" 
              required={!showManualInput} 
              type="url"
              readOnly={showManualInput}
              onFocus={() => {
                  // If user focuses the URL input again, reset to URL mode
                  setShowManualInput(false);
                  setResult(null);
              }}
            />
            {state.errors?.url && !showManualInput && <p className="text-sm text-destructive">{state.errors.url[0]}</p>}
        </div>
        
        {showManualInput && (
            <div className="space-y-4 animate-in fade-in duration-500">
                <Alert variant="default" className="border-accent text-accent-foreground">
                    <HelpCircle className="h-4 w-4 text-accent" />
                    <AlertTitle>{t('CompetitorForm.manualMode.title')}</AlertTitle>
                    <AlertDescription>
                        {t('CompetitorForm.manualMode.description')}
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Label htmlFor="pageContent">{t('CompetitorForm.manualMode.contentLabel')}</Label>
                    <Textarea
                        id="pageContent"
                        name="pageContent"
                        placeholder={t('CompetitorForm.manualMode.contentPlaceholder')}
                        rows={10}
                        required
                    />
                     {state.errors?.pageContent && <p className="text-sm text-destructive">{state.errors.pageContent[0]}</p>}
                </div>
            </div>
        )}

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
