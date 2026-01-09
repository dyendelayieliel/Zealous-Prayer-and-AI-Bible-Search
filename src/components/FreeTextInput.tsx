import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { verses, Verse } from '@/data/bibleVerses';

interface FreeTextInputProps {
  onVersesFound: (verses: Verse[], userInput: string) => void;
}

// Keyword mappings to moods
const keywordMappings: Record<string, string[]> = {
  anxious: ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'stress', 'stressed', 'panic', 'uneasy'],
  sad: ['sad', 'depressed', 'down', 'unhappy', 'crying', 'tears', 'grief', 'mourning', 'heartbroken', 'sorrow'],
  angry: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'rage', 'upset'],
  lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'forgotten', 'no one', 'nobody'],
  fearful: ['afraid', 'fear', 'scared', 'terrified', 'frightened', 'dread', 'terror'],
  grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude'],
  hopeful: ['hopeful', 'hope', 'optimistic', 'looking forward', 'excited'],
  tired: ['tired', 'exhausted', 'weary', 'drained', 'burnt out', 'burnout', 'fatigued', 'sleepy'],
  sick: ['sick', 'ill', 'unwell', 'disease', 'health', 'healing'],
  restless: ['restless', 'cant sleep', "can't sleep", 'insomnia', 'agitated'],
  weak: ['weak', 'powerless', 'helpless', 'feeble', 'frail'],
  'in-pain': ['pain', 'hurting', 'suffering', 'ache', 'hurt'],
  confused: ['confused', 'lost', 'uncertain', 'unsure', "don't know", 'dont know', 'direction'],
  overwhelmed: ['overwhelmed', 'too much', 'cant handle', "can't handle", 'drowning', 'swamped'],
  doubtful: ['doubt', 'doubtful', 'questioning', 'unsure', 'faith', 'believe'],
  unfocused: ['unfocused', 'distracted', 'cant focus', "can't focus", 'scattered', 'mind wandering'],
  discouraged: ['discouraged', 'giving up', 'hopeless', 'defeated', 'failed', 'failure'],
  'seeking-wisdom': ['wisdom', 'guidance', 'direction', 'decision', 'advice', 'what should i do'],
};

function findRelevantMoods(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundMoods = new Set<string>();

  Object.entries(keywordMappings).forEach(([mood, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        foundMoods.add(mood);
      }
    });
  });

  return Array.from(foundMoods);
}

function getVersesForMoods(moodIds: string[]): Verse[] {
  const matchedVerses = verses.filter(verse => 
    verse.moodIds.some(moodId => moodIds.includes(moodId))
  );
  
  // Shuffle and return up to 3 verses
  return matchedVerses
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

// Default encouraging verses when no keywords match
const defaultVerses: Verse[] = [
  {
    reference: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    moodIds: [],
  },
  {
    reference: 'Psalm 46:1',
    text: 'God is our refuge and strength, an ever-present help in trouble.',
    moodIds: [],
  },
  {
    reference: 'Isaiah 40:31',
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    moodIds: [],
  },
];

export function FreeTextInput({ onVersesFound }: FreeTextInputProps) {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;

    setIsProcessing(true);

    // Simulate brief processing
    setTimeout(() => {
      const moods = findRelevantMoods(text);
      let matchedVerses: Verse[];

      if (moods.length > 0) {
        matchedVerses = getVersesForMoods(moods);
      } else {
        matchedVerses = defaultVerses.sort(() => Math.random() - 0.5).slice(0, 2);
      }

      onVersesFound(matchedVerses, text);
      setIsProcessing(false);
    }, 500);
  };

  const placeholders = [
    "I'm feeling anxious about tomorrow...",
    "I feel lost and don't know what to do...",
    "I'm grateful for everything today...",
    "I'm tired and need strength...",
  ];

  const [placeholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length)]
  );

  return (
    <div className="w-full animate-fade-in">
      <div className="ios-card p-4">
        <div className="flex items-start gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Tell us how you're feeling in your own words, and we'll find Scripture that speaks to your heart.
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="ios-textarea mb-3"
          maxLength={500}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length}/500
          </span>
          
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isProcessing}
            className="ios-button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Finding...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Find Verses
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
