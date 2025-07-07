'use client';

import { useFormStatus } from 'react-dom';
import { handleVideoGeneration } from '@/app/video/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { GenerateVideoStoryboardOutput } from '@/ai/flows/generate-video-storyboard';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { VideoResults } from './video-results';
import { videoStyles } from '@/lib/types';

const initialState: {
  data: GenerateVideoStoryboardOutput | null;
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
      {t('VideoGeneratorForm.submitButton')}
    </Button>
  );
}

export function VideoGeneratorForm() {
  const [state, formAction] = useActionState(handleVideoGeneration, initialState);
  const { toast } = useToast();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<GenerateVideoStoryboardOutput | null>(null);
  
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
        description: t('VideoGeneratorForm.toast.successDescription'),
      });
    }
  }, [state, toast, t]);
  
  const formRef = useRef<HTMLFormElement>(null);

  const videoStyleOptions = videoStyles;

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="productName">{t('VideoGeneratorForm.productName.label')}</Label>
                <Input id="productName" name="productName" placeholder={t('VideoGeneratorForm.productName.placeholder')} required />
                {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="targetAudience">{t('VideoGeneratorForm.targetAudience.label')}</Label>
                <Input id="targetAudience" name="targetAudience" placeholder={t('VideoGeneratorForm.targetAudience.placeholder')} required />
                {state.errors?.targetAudience && <p className="text-sm text-destructive">{state.errors.targetAudience[0]}</p>}
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productDescription">{t('VideoGeneratorForm.productDescription.label')}</Label>
          <Textarea id="productDescription" name="productDescription" placeholder={t('VideoGeneratorForm.productDescription.placeholder')} rows={4} required />
          {state.errors?.productDescription && <p className="text-sm text-destructive">{state.errors.productDescription[0]}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="videoStyle">{t('VideoGeneratorForm.videoStyle.label')}</Label>
             <Select name="videoStyle" defaultValue={videoStyleOptions[0]}>
                <SelectTrigger id="videoStyle">
                    <SelectValue placeholder={t('VideoGeneratorForm.videoStyle.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                    {videoStyleOptions.map(style => (
                        <SelectItem key={style} value={style}>
                            {t(`VideoStyles.${style.replace(/ /g, '').replace(/-/g, '').replace(/&/g, '')}`)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.errors?.videoStyle && <p className="text-sm text-destructive">{state.errors.videoStyle[0]}</p>}
        </div>


        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <VideoResults results={result} />
        </div>
      )}
    </div>
  );
}
