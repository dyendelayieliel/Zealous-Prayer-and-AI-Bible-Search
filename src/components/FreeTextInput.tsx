import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { verses, Verse } from '@/data/bibleVerses';

interface FreeTextInputProps {
  onVersesFound: (verses: Verse[], userInput: string) => void;
}

// Keyword mappings to moods - including life stages, problems, struggles, and sins
const keywordMappings: Record<string, string[]> = {
  anxious: ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'stress', 'stressed', 'panic', 'uneasy', 'interview', 'exam', 'test', 'deadline'],
  sad: ['sad', 'depressed', 'down', 'unhappy', 'crying', 'tears', 'grief', 'mourning', 'heartbroken', 'sorrow', 'breakup', 'divorce', 'loss', 'death', 'passed away', 'funeral'],
  angry: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'rage', 'upset', 'betrayed', 'cheated', 'lied to', 'unfair', 'bitterness', 'bitter', 'resentment', 'resentful', 'hatred', 'hate', 'unforgiving', 'grudge', 'revenge', 'vengeance'],
  lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'forgotten', 'no one', 'nobody', 'single', 'moved away', 'new city', 'new job', 'no friends', 'left out'],
  fearful: ['afraid', 'fear', 'scared', 'terrified', 'frightened', 'dread', 'terror', 'surgery', 'diagnosis', 'results', 'unknown future', 'cowardice', 'coward'],
  grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude', 'promotion', 'got the job', 'engaged', 'married', 'baby', 'pregnant', 'recovered'],
  hopeful: ['hopeful', 'hope', 'optimistic', 'looking forward', 'excited', 'new chapter', 'fresh start', 'new beginning', 'opportunity', 'repentance', 'repent', 'turning back', 'returning to god'],
  tired: ['tired', 'exhausted', 'weary', 'drained', 'burnt out', 'burnout', 'fatigued', 'sleepy', 'overworked', 'too busy', 'no rest', 'parenting', 'newborn', 'caregiver', 'sloth', 'lazy', 'laziness'],
  sick: ['sick', 'ill', 'unwell', 'disease', 'health', 'healing', 'cancer', 'chronic', 'hospital', 'treatment', 'recovery'],
  restless: ['restless', 'cant sleep', "can't sleep", 'insomnia', 'agitated', 'racing thoughts', 'overthinking', 'guilt', 'guilty', 'shame', 'ashamed', 'regret', 'conscience'],
  weak: ['weak', 'powerless', 'helpless', 'feeble', 'frail', 'addiction', 'temptation', 'struggling', 'relapse', 'lust', 'lustful', 'pornography', 'porn', 'sexual sin', 'sexual immorality', 'adultery', 'affair', 'unfaithful', 'drinking', 'alcohol', 'drugs', 'substance', 'gambling', 'smoking', 'self-control', 'no self control'],
  'in-pain': ['pain', 'hurting', 'suffering', 'ache', 'hurt', 'trauma', 'abuse', 'wounded', 'self-harm', 'cutting', 'suicidal', 'suicide'],
  confused: ['confused', 'lost', 'uncertain', 'unsure', "don't know", 'dont know', 'direction', 'career', 'calling', 'purpose', 'quarter-life', 'midlife', 'transition', 'crossroads', 'which path', 'what to do', 'deception', 'deceived', 'false teaching'],
  overwhelmed: ['overwhelmed', 'too much', 'cant handle', "can't handle", 'drowning', 'swamped', 'college', 'university', 'finals', 'bills', 'debt', 'financial', 'money problems', 'greed', 'greedy', 'materialism', 'love of money', 'covet', 'coveting', 'envy', 'envious', 'jealous', 'jealousy'],
  doubtful: ['doubt', 'doubtful', 'questioning', 'unsure', 'faith', 'believe', 'crisis', 'losing faith', 'why god', 'unbelief', 'lack of faith', 'skeptical'],
  unfocused: ['unfocused', 'distracted', 'cant focus', "can't focus", 'scattered', 'mind wandering', 'procrastinating', 'unmotivated', 'idolatry', 'idol', 'priorities', 'worldly', 'worldliness'],
  discouraged: ['discouraged', 'giving up', 'hopeless', 'defeated', 'failed', 'failure', 'rejected', 'fired', 'laid off', 'unemployed', 'job loss', 'denied', "didn't get", 'not good enough', 'pride', 'prideful', 'arrogant', 'arrogance', 'ego', 'selfish', 'selfishness', 'self-centered', 'vanity', 'vain'],
  'seeking-wisdom': ['wisdom', 'guidance', 'direction', 'decision', 'advice', 'what should i do', 'marriage', 'relationship', 'job offer', 'moving', 'college choice', 'big decision', 'retire', 'retirement', 'starting family', 'having kids', 'lying', 'liar', 'dishonest', 'dishonesty', 'gossip', 'gossiping', 'slander', 'cursing', 'swearing', 'bad language', 'words', 'tongue', 'speech'],
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
    "I'm struggling with anger and bitterness...",
    "I keep falling into the same temptation...",
    "I feel guilty about things I've done...",
    "I'm battling envy and jealousy...",
    "I'm struggling with lust and purity...",
    "I need help with forgiving someone...",
    "I'm dealing with pride and selfishness...",
    "I lost my job and don't know what to do next...",
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
            Share what you're going through—your feelings, struggles, sins, or life challenges—and we'll find Scripture that speaks to your situation.
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
