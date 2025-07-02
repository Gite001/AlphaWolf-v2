'use client';

import { useFormStatus } from 'react-dom';
import { handleAnalysis } from '@/app/analyze/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResults } from './analysis-results';
import type { AnalyzeAdPerformanceOutput } from '@/ai/flows/analyze-ad-performance';
import { Loader2, Upload } from 'lucide-react';
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
      {t('AnalysisForm.submitButton')}
    </Button>
  );
}

export function AnalysisForm() {
  const [state, formAction] = useActionState(handleAnalysis, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const [result, setResult] = useState<AnalyzeAdPerformanceOutput | null>(null);

  useEffect(() => {
    if (state.message && state.message !== 'Analysis complete.') {
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
        description: t('AnalysisForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('');
      setPreview(null);
    }
  };
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="productType">{t('AnalysisForm.productType.label')}</Label>
            <Input id="productType" name="productType" placeholder={t('AnalysisForm.productType.placeholder')} required />
            {state.errors?.productType && <p className="text-sm text-destructive">{state.errors.productType[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">{t('AnalysisForm.targetAudience.label')}</Label>
            <Input id="targetAudience" name="targetAudience" placeholder={t('AnalysisForm.targetAudience.placeholder')} required />
            {state.errors?.targetAudience && <p className="text-sm text-destructive">{state.errors.targetAudience[0]}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adText">{t('AnalysisForm.adText.label')}</Label>
          <Textarea id="adText" name="adText" placeholder={t('AnalysisForm.adText.placeholder')} rows={5} required />
          {state.errors?.adText && <p className="text-sm text-destructive">{state.errors.adText[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="adVisual">{t('AnalysisForm.adVisual.label')}</Label>
          <div 
            className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input ref={fileInputRef} id="adVisual" name="adVisual" type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt={t('AnalysisForm.adVisual.alt')} className="max-h-48 mx-auto rounded-md" />
            ) : (
              <div className="text-muted-foreground">
                <Upload className="mx-auto h-12 w-12" />
                <p className="mt-2">{t('AnalysisForm.adVisual.uploadText')}</p>
                <p className="text-xs">{t('AnalysisForm.adVisual.uploadHint')}</p>
              </div>
            )}
            {fileName && <p className="text-sm mt-2 font-medium">{fileName}</p>}
          </div>
          {state.errors?.adVisual && <p className="text-sm text-destructive">{state.errors.adVisual[0]}</p>}
        </div>

        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <AnalysisResults results={result} />
        </div>
      )}
    </div>
  );
}
