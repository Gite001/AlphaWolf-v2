'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AppFooter() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">AdInsights</span>
          </div>
          <div className="text-center md:text-left text-sm text-muted-foreground">
            <p>&copy; {year} AdInsights. Tous droits réservés.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Conditions d'Utilisation
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
