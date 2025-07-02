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
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Generate Copy
    </Button>
  );
}

export function CopyGeneratorForm() {
  const [state, formAction] = useActionState(handleCopyGeneration, initialState);
  const { toast } = useToast();
  const [result, setResult] = useState<ResultState>(null);

  useEffect(() => {
    if (state.message && state.message !== 'Copy generation complete.') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    if (state.data) {
      setResult(state.data);
      toast({
        title: 'Success!',
        description: 'Your new ad copy is ready.',
      });
    }
  }, [state, toast]);
  
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input id="productName" name="productName" placeholder="e.g., The All-Day Comfort Sneaker" required />
          {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input id="targetAudience" name="targetAudience" placeholder="e.g., Urban commuters, fitness enthusiasts" required />
          {state.errors?.targetAudience && <p className="text-sm text-destructive">{state.errors.targetAudience[0]}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productDescription">Product Description</Label>
          <Textarea id="productDescription" name="productDescription" placeholder="Describe the key features and benefits of your product..." rows={4} required />
          {state.errors?.productDescription && <p className="text-sm text-destructive">{state.errors.productDescription[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input id="keywords" name="keywords" placeholder="e.g., sustainable, lightweight, stylish (comma-separated)" />
          {state.errors?.keywords && <p className="text-sm text-destructive">{state.errors.keywords[0]}</p>}
        </div>

        <SubmitButton />
      </form>
      {result && (
        <div className="mt-8 pt-8 border-t">
            <CopyResults 
                variations={result.variations} 
                productName={result.originalInput.productName}
                productDescription={result.originalInput.productDescription}
            />
        </div>
      )}
    </div>
  );
}
