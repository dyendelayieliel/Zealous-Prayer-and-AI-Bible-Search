import { getVersesForMood, moods } from '@/data/bibleVerses';
import { BookOpen, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VerseDisplayProps {
  moodId: string;
  onBack: () => void;
}

export function VerseDisplay({ moodId, onBack }: VerseDisplayProps) {
  const verses = getVersesForMood(moodId);
  const mood = moods.find(m => m.id === moodId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % verses.length);
  };

  if (verses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No verses found for this mood.</p>
        <button
          onClick={onBack}
          className="mt-4 text-primary underline hover:no-underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const currentVerse = verses[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground font-body text-sm uppercase tracking-widest mb-2">
          Scripture for when you feel
        </p>
        <h2 className="text-3xl md:text-4xl font-display text-glow">
          {mood?.label}
        </h2>
      </div>

      {/* Verse Card */}
      <div className={`bg-card border border-border p-8 md:p-12 border-glow ${isAnimating ? 'animate-fade-in-up' : ''}`}>
        <div className="flex justify-center mb-6">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <blockquote className="text-xl md:text-2xl font-display text-center leading-relaxed mb-6">
          "{currentVerse.text}"
        </blockquote>
        
        <p className="text-center text-muted-foreground font-body tracking-wide">
          — {currentVerse.reference}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        {verses.length > 1 && (
          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest transition-all hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4" />
            Another Verse ({currentIndex + 1}/{verses.length})
          </button>
        )}
        
        <button
          onClick={onBack}
          className="px-6 py-3 border border-border text-foreground font-body text-sm uppercase tracking-widest transition-all hover:border-primary hover:border-glow"
        >
          Choose Different Feeling
        </button>
      </div>
    </div>
  );
}
