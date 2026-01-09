import { useState } from 'react';
import { moods, getMoodsByCategory, MoodCategory } from '@/data/bibleVerses';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  onMoodSelect: (moodId: string) => void;
  selectedMood: string | null;
}

const categories: { id: MoodCategory; label: string; description: string }[] = [
  { id: 'emotional', label: 'Emotional', description: 'How your heart feels' },
  { id: 'physical', label: 'Physical', description: 'How your body feels' },
  { id: 'mental', label: 'Mental', description: 'How your mind feels' },
];

export function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<MoodCategory>('emotional');
  
  const categoryMoods = getMoodsByCategory(activeCategory);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Category Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-6 py-3 font-body text-sm uppercase tracking-widest transition-all duration-300 border",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Category Description */}
      <p className="text-center text-muted-foreground mb-6 font-body">
        {categories.find(c => c.id === activeCategory)?.description}
      </p>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-in">
        {categoryMoods.map((mood, index) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={cn(
              "py-4 px-4 border transition-all duration-300 font-body animate-fade-in-up",
              selectedMood === mood.id
                ? "bg-primary text-primary-foreground border-primary box-glow"
                : "bg-card text-card-foreground border-border hover:border-primary hover:border-glow"
            )}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}
