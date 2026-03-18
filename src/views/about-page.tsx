'use client';

import { useContentStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/router';
import { ArrowLeft, Info } from 'lucide-react';

export default function AboutPage() {
  const { goBack } = useRouter();
  const { content } = useContentStore();

  return (
    <div className="container max-w-4xl py-12 px-4 md:px-8">
      <Button variant="ghost" onClick={goBack} className="mb-8 p-0 hover:bg-transparent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <Info className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">About Us</h1>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border shadow-sm text-lg leading-relaxed whitespace-pre-wrap font-medium">
          {content.aboutUs}
        </div>
      </div>
    </div>
  );
}
