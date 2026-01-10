import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { verses, Verse } from '@/data/bibleVerses';

interface FreeTextInputProps {
  onVersesFound: (verses: Verse[], userInput: string) => void;
}

// Keyword mappings to moods - including life stages and problems
const keywordMappings: Record<string, string[]> = {
  anxious: ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'stress', 'stressed', 'panic', 'uneasy', 'interview', 'exam', 'test', 'deadline'],
  sad: ['sad', 'depressed', 'down', 'unhappy', 'crying', 'tears', 'grief', 'mourning', 'heartbroken', 'sorrow', 'breakup', 'divorce', 'loss', 'death', 'passed away', 'funeral'],
  angry: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'rage', 'upset', 'betrayed', 'cheated', 'lied to', 'unfair'],
  lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'forgotten', 'no one', 'nobody', 'single', 'moved away', 'new city', 'new job', 'no friends', 'left out'],
  fearful: ['afraid', 'fear', 'scared', 'terrified', 'frightened', 'dread', 'terror', 'surgery', 'diagnosis', 'results', 'unknown future'],
  grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude', 'promotion', 'got the job', 'engaged', 'married', 'baby', 'pregnant', 'recovered'],
  hopeful: ['hopeful', 'hope', 'optimistic', 'looking forward', 'excited', 'new chapter', 'fresh start', 'new beginning', 'opportunity'],
  tired: ['tired', 'exhausted', 'weary', 'drained', 'burnt out', 'burnout', 'fatigued', 'sleepy', 'overworked', 'too busy', 'no rest', 'parenting', 'newborn', 'caregiver'],
  sick: ['sick', 'ill', 'unwell', 'disease', 'health', 'healing', 'cancer', 'chronic', 'hospital', 'treatment', 'recovery'],
  restless: ['restless', 'cant sleep', "can't sleep", 'insomnia', 'agitated', 'racing thoughts', 'overthinking'],
  weak: ['weak', 'powerless', 'helpless', 'feeble', 'frail', 'addiction', 'temptation', 'struggling', 'relapse'],
  'in-pain': ['pain', 'hurting', 'suffering', 'ache', 'hurt', 'trauma', 'abuse', 'wounded'],
  confused: ['confused', 'lost', 'uncertain', 'unsure', "don't know", 'dont know', 'direction', 'career', 'calling', 'purpose', 'quarter-life', 'midlife', 'transition', 'crossroads', 'which path', 'what to do'],
  overwhelmed: ['overwhelmed', 'too much', 'cant handle', "can't handle", 'drowning', 'swamped', 'college', 'university', 'finals', 'bills', 'debt', 'financial', 'money problems'],
  doubtful: ['doubt', 'doubtful', 'questioning', 'unsure', 'faith', 'believe', 'crisis', 'losing faith', 'why god'],
  unfocused: ['unfocused', 'distracted', 'cant focus', "can't focus", 'scattered', 'mind wandering', 'procrastinating', 'unmotivated'],
  discouraged: ['discouraged', 'giving up', 'hopeless', 'defeated', 'failed', 'failure', 'rejected', 'fired', 'laid off', 'unemployed', 'job loss', 'denied', 'didn\'t get', 'not good enough'],
  'seeking-wisdom': ['wisdom', 'guidance', 'direction', 'decision', 'advice', 'what should i do', 'marriage', 'relationship', 'job offer', 'moving', 'college choice', 'big decision', 'retire', 'retirement', 'starting family', 'having kids'],
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

// Default encouraging verses when no keywords match (NLT)
const defaultVerses: Verse[] = [
  {
    reference: 'Romans 8:28 (NLT)',
    text: 'And we know that God causes everything to work together for the good of those who love God and are called according to his purpose for them.',
    moodIds: [],
  },
  {
    reference: 'Psalm 46:1 (NLT)',
    text: 'God is our refuge and strength, always ready to help in times of trouble.',
    moodIds: [],
  },
  {
    reference: 'Isaiah 40:31 (NLT)',
    text: 'But those who trust in the Lord will find new strength. They will soar high on wings like eagles. They will run and not grow weary. They will walk and not faint.',
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
    "I'm a college student feeling overwhelmed with finals...",
    "I just got married and I'm anxious about the future...",
    "I lost my job and don't know what to do next...",
    "I'm a new parent and feeling exhausted...",
    "I'm going through a divorce and feel lost...",
    "I'm retiring soon and seeking direction...",
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
            Share what you're going through—your feelings, life stage, or challenges—and we'll find Scripture that speaks to your situation.
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
