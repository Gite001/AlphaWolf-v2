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
      Analyser la Performance
    </Button>
  );
}

export function AnalysisForm() {
  const [state, formAction] = useActionState(handleAnalysis, initialState);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const [result, setResult] = useState<AnalyzeAdPerformanceOutput | null>(null);

  useEffect(() => {
    if (state.message && state.message !== 'Analysis complete.') {
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
        description: 'Votre analyse publicitaire est prête.',
      });
    }
  }, [state, toast]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="productType">Type de Produit</Label>
            <Input id="productType" name="productType" placeholder="ex: Soins de la peau, Vêtements" required />
            {state.errors?.productType && <p className="text-sm text-destructive">{state.errors.productType[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Audience Cible</Label>
            <Input id="targetAudience" name="targetAudience" placeholder="ex: Jeunes professionnels, Parents" required />
            {state.errors?.targetAudience && <p className="text-sm text-destructive">{state.errors.targetAudience[0]}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adText">Texte de la Publicité</Label>
          <Textarea id="adText" name="adText" placeholder="Saisissez le contenu textuel complet de votre publicité..." rows={5} required />
          {state.errors?.adText && <p className="text-sm text-destructive">{state.errors.adText[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="adVisual">Visuel de la Publicité</Label>
          <div 
            className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input ref={fileInputRef} id="adVisual" name="adVisual" type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Aperçu de la publicité" className="max-h-48 mx-auto rounded-md" />
            ) : (
              <div className="text-muted-foreground">
                <Upload className="mx-auto h-12 w-12" />
                <p className="mt-2">Cliquez pour télécharger ou glissez-déposez</p>
                <p className="text-xs">PNG, JPG, GIF jusqu'à 4MB</p>
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
