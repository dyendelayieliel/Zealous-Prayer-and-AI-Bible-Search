import { useState } from 'react';
import { moods, getMoodsByCategory, MoodCategory } from '@/data/bibleVerses';
import { cn } from '@/lib/utils';

interface IOSMoodSelectorProps {
  onMoodSelect: (moodId: string) => void;
  selectedMood: string | null;
}

const categories: { id: MoodCategory; label: string }[] = [
  { id: 'emotional', label: 'Emotional' },
  { id: 'physical', label: 'Physical' },
  { id: 'mental', label: 'Mental' },
];

export function IOSMoodSelector({ onMoodSelect, selectedMood }: IOSMoodSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<MoodCategory>('emotional');
  
  const categoryMoods = getMoodsByCategory(activeCategory);

  return (
    <div className="w-full animate-fade-in">
      {/* iOS Segmented Control */}
      <div className="ios-segment mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              'ios-segment-button',
              activeCategory === category.id
                ? 'ios-segment-button-active'
                : 'ios-segment-button-inactive'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Mood List - iOS grouped style */}
      <div className="ios-card-grouped">
        {categoryMoods.map((mood, index) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={cn(
              'ios-list-item w-full text-left active:bg-accent transition-colors',
              selectedMood === mood.id && 'bg-accent'
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <span className="font-medium">{mood.label}</span>
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
