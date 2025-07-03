'use client';

import { useFormStatus } from 'react-dom';
import { handleCopyGeneration } from '@/app/generate/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateAdCopyOutput, GenerateAdCopyInput } from '@/ai/flows/generate-ad-copy';
import { Loader2 } from 'lucide-react';
import { CopyResults } from './copy-results';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';

type ResultState = {
    variations: GenerateAdCopyOutput['variations'];
    originalInput: GenerateAdCopyInput;
} | null;

const initialState: {
  message: string;
  data: ResultState;
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
      {t('CopyGeneratorForm.submitButton')}
    </Button>
  );
}

export function CopyGeneratorForm() {
  const [state, formAction] = useActionState(handleCopyGeneration, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<ResultState>(null);
  const searchParams = useSearchParams();
  
  const productName = searchParams.get('productName') || '';
  const productDescription = searchParams.get('productDescription') || '';
  const keywords = searchParams.get('keywords') || '';

  useEffect(() => {
    if (state.message && state.message !== 'Copy generation complete.') {
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
        description: t('CopyGeneratorForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        <div className="space-y-2">
          <Label htmlFor="productName">{t('CopyGeneratorForm.productName.label')}</Label>
          <Input id="productName" name="productName" placeholder={t('CopyGeneratorForm.productName.placeholder')} required defaultValue={productName} />
          {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">{t('CopyGeneratorForm.targetAudience.label')}</Label>
          <Input id="targetAudience" name="targetAudience" placeholder={t('CopyGeneratorForm.targetAudience.placeholder')} required />
          {state.errors?.targetAudience && <p className="text-sm text-destructive">{state.errors.targetAudience[0]}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productDescription">{t('CopyGeneratorForm.productDescription.label')}</Label>
          <Textarea id="productDescription" name="productDescription" placeholder={t('CopyGeneratorForm.productDescription.placeholder')} rows={4} required defaultValue={productDescription} />
          {state.errors?.productDescription && <p className="text-sm text-destructive">{state.errors.productDescription[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">{t('CopyGeneratorForm.keywords.label')}</Label>
          <Input id="keywords" name="keywords" placeholder={t('CopyGeneratorForm.keywords.placeholder')} defaultValue={keywords}/>
          {state.errors?.keywords && <p className="text-sm text-destructive">{state.errors.keywords[0]}</p>}
        </div>

        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <CopyResults 
                variations={result.variations}
            />
        </div>
      )}
    </div>
  );
}
