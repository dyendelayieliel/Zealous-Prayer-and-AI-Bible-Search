import { Verse } from '@/data/bibleVerses';
import { BookOpen, ChevronLeft, RefreshCw } from 'lucide-react';

interface FreeTextResultsProps {
  verses: Verse[];
  userInput: string;
  onBack: () => void;
  onTryAgain: () => void;
}

export function FreeTextResults({ verses, userInput, onBack, onTryAgain }: FreeTextResultsProps) {
  return (
    <div className="w-full animate-slide-up">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground mb-4 active:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="ios-card p-4 bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">You shared:</p>
          <p className="text-foreground italic">"{userInput}"</p>
        </div>
      </div>

      {/* Verses */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground px-1">
          Here's what God's Word says for you:
        </p>

        {verses.map((verse, index) => (
          <div
            key={index}
            className="ios-card p-5 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{verse.reference}</span>
            </div>
            
            <p className="text-lg leading-relaxed">
              "{verse.text}"
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onTryAgain}
          className="ios-button-primary w-full flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Share Another Feeling
        </button>
        
        <button
          onClick={onBack}
          className="ios-button-secondary w-full"
        >
          Browse by Category
        </button>
      </div>
    </div>
  );
}
