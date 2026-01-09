import { getVersesForMood, moods } from '@/data/bibleVerses';
import { BookOpen, ChevronLeft, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IOSVerseDisplayProps {
  moodId: string;
  onBack: () => void;
}

export function IOSVerseDisplay({ moodId, onBack }: IOSVerseDisplayProps) {
  const verses = getVersesForMood(moodId);
  const mood = moods.find(m => m.id === moodId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % verses.length);
  };

  if (verses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No verses found for this feeling.</p>
        <button
          onClick={onBack}
          className="mt-4 text-foreground"
        >
          Go back
        </button>
      </div>
    );
  }

  const currentVerse = verses[currentIndex];

  return (
    <div className="w-full animate-slide-up">
      {/* Navigation Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-muted-foreground mb-6 active:opacity-70 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      {/* Title */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-1">Scripture for when you feel</p>
        <h2 className="text-2xl font-semibold">{mood?.label}</h2>
      </div>

      {/* Verse Card */}
      <div className={`ios-card p-6 ${isAnimating ? 'animate-scale-in' : ''}`}>
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">{currentVerse.reference}</span>
        </div>
        
        <blockquote className="text-xl leading-relaxed mb-4">
          "{currentVerse.text}"
        </blockquote>

        {verses.length > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            {verses.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-foreground' : 'bg-muted'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        {verses.length > 1 && (
          <button
            onClick={handleNext}
            className="ios-button-primary w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Next Verse ({currentIndex + 1}/{verses.length})
          </button>
        )}
        
        <button
          onClick={onBack}
          className="ios-button-secondary w-full"
        >
          Choose Different Feeling
        </button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
