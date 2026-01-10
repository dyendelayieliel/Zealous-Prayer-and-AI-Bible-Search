export type MoodCategory = 'emotional' | 'physical' | 'mental';

export type Mood = {
  id: string;
  label: string;
  category: MoodCategory;
};

export type Verse = {
  reference: string;
  text: string;
  moodIds: string[];
};

export const moods: Mood[] = [
  // Emotional
  { id: 'anxious', label: 'Anxious', category: 'emotional' },
  { id: 'sad', label: 'Sad', category: 'emotional' },
  { id: 'angry', label: 'Angry', category: 'emotional' },
  { id: 'lonely', label: 'Lonely', category: 'emotional' },
  { id: 'fearful', label: 'Fearful', category: 'emotional' },
  { id: 'grateful', label: 'Grateful', category: 'emotional' },
  { id: 'hopeful', label: 'Hopeful', category: 'emotional' },
  
  // Physical
  { id: 'tired', label: 'Tired', category: 'physical' },
  { id: 'sick', label: 'Sick', category: 'physical' },
  { id: 'restless', label: 'Restless', category: 'physical' },
  { id: 'weak', label: 'Weak', category: 'physical' },
  { id: 'in-pain', label: 'In Pain', category: 'physical' },
  
  // Mental
  { id: 'confused', label: 'Confused', category: 'mental' },
  { id: 'overwhelmed', label: 'Overwhelmed', category: 'mental' },
  { id: 'doubtful', label: 'Doubtful', category: 'mental' },
  { id: 'unfocused', label: 'Unfocused', category: 'mental' },
  { id: 'discouraged', label: 'Discouraged', category: 'mental' },
  { id: 'seeking-wisdom', label: 'Seeking Wisdom', category: 'mental' },
];

export const verses: Verse[] = [
  // Anxious
  {
    reference: 'Philippians 4:6-7 (NLT)',
    text: "Don't worry about anything; instead, pray about everything. Tell God what you need, and thank him for all he has done. Then you will experience God's peace, which exceeds anything we can understand. His peace will guard your hearts and minds as you live in Christ Jesus.",
    moodIds: ['anxious', 'overwhelmed'],
  },
  {
    reference: '1 Peter 5:7 (NLT)',
    text: 'Give all your worries and cares to God, for he cares about you.',
    moodIds: ['anxious', 'fearful'],
  },
  {
    reference: 'Matthew 6:34 (NLT)',
    text: "So don't worry about tomorrow, for tomorrow will bring its own worries. Today's trouble is enough for today.",
    moodIds: ['anxious', 'overwhelmed'],
  },
  
  // Sad
  {
    reference: 'Psalm 34:18 (NLT)',
    text: 'The Lord is close to the brokenhearted; he rescues those whose spirits are crushed.',
    moodIds: ['sad', 'lonely'],
  },
  {
    reference: 'Revelation 21:4 (NLT)',
    text: 'He will wipe every tear from their eyes, and there will be no more death or sorrow or crying or pain. All these things are gone forever.',
    moodIds: ['sad', 'in-pain'],
  },
  {
    reference: 'Psalm 30:5 (NLT)',
    text: 'Weeping may last through the night, but joy comes with the morning.',
    moodIds: ['sad', 'hopeful'],
  },
  
  // Angry
  {
    reference: 'James 1:19-20 (NLT)',
    text: "Understand this, my dear brothers and sisters: You must all be quick to listen, slow to speak, and slow to get angry. Human anger does not produce the righteousness God desires.",
    moodIds: ['angry'],
  },
  {
    reference: 'Ephesians 4:26-27 (NLT)',
    text: "And don't sin by letting anger control you. Don't let the sun go down while you are still angry, for anger gives a foothold to the devil.",
    moodIds: ['angry'],
  },
  
  // Lonely
  {
    reference: 'Deuteronomy 31:6 (NLT)',
    text: 'So be strong and courageous! Do not be afraid and do not panic before them. For the Lord your God will personally go ahead of you. He will neither fail you nor abandon you.',
    moodIds: ['lonely', 'fearful'],
  },
  {
    reference: 'Psalm 23:4 (NLT)',
    text: 'Even when I walk through the darkest valley, I will not be afraid, for you are close beside me. Your rod and your staff protect and comfort me.',
    moodIds: ['lonely', 'fearful'],
  },
  
  // Fearful
  {
    reference: 'Isaiah 41:10 (NLT)',
    text: "Don't be afraid, for I am with you. Don't be discouraged, for I am your God. I will strengthen you and help you. I will hold you up with my victorious right hand.",
    moodIds: ['fearful', 'weak'],
  },
  {
    reference: '2 Timothy 1:7 (NLT)',
    text: 'For God has not given us a spirit of fear and timidity, but of power, love, and self-discipline.',
    moodIds: ['fearful', 'weak'],
  },
  
  // Grateful
  {
    reference: '1 Thessalonians 5:18 (NLT)',
    text: "Be thankful in all circumstances, for this is God's will for you who belong to Christ Jesus.",
    moodIds: ['grateful', 'hopeful'],
  },
  {
    reference: 'Psalm 107:1 (NLT)',
    text: 'Give thanks to the Lord, for he is good! His faithful love endures forever.',
    moodIds: ['grateful'],
  },
  
  // Hopeful
  {
    reference: 'Jeremiah 29:11 (NLT)',
    text: '"For I know the plans I have for you," says the Lord. "They are plans for good and not for disaster, to give you a future and a hope."',
    moodIds: ['hopeful', 'discouraged'],
  },
  {
    reference: 'Romans 15:13 (NLT)',
    text: 'I pray that God, the source of hope, will fill you completely with joy and peace because you trust in him. Then you will overflow with confident hope through the power of the Holy Spirit.',
    moodIds: ['hopeful'],
  },
  
  // Tired
  {
    reference: 'Matthew 11:28-30 (NLT)',
    text: 'Then Jesus said, "Come to me, all of you who are weary and carry heavy burdens, and I will give you rest. Take my yoke upon you. Let me teach you, because I am humble and gentle at heart, and you will find rest for your souls."',
    moodIds: ['tired', 'overwhelmed'],
  },
  {
    reference: 'Isaiah 40:31 (NLT)',
    text: 'But those who trust in the Lord will find new strength. They will soar high on wings like eagles. They will run and not grow weary. They will walk and not faint.',
    moodIds: ['tired', 'weak'],
  },
  
  // Sick
  {
    reference: 'James 5:15 (NLT)',
    text: 'Such a prayer offered in faith will heal the sick, and the Lord will make you well. And if you have committed any sins, you will be forgiven.',
    moodIds: ['sick', 'in-pain'],
  },
  {
    reference: 'Psalm 103:2-3 (NLT)',
    text: 'Let all that I am praise the Lord; may I never forget the good things he does for me. He forgives all my sins and heals all my diseases.',
    moodIds: ['sick'],
  },
  
  // Restless
  {
    reference: 'Psalm 46:10 (NLT)',
    text: '"Be still, and know that I am God! I will be honored by every nation. I will be honored throughout the world."',
    moodIds: ['restless', 'anxious'],
  },
  
  // Weak
  {
    reference: '2 Corinthians 12:9 (NLT)',
    text: 'Each time he said, "My grace is all you need. My power works best in weakness." So now I am glad to boast about my weaknesses, so that the power of Christ can work through me.',
    moodIds: ['weak', 'discouraged'],
  },
  
  // In Pain
  {
    reference: 'Psalm 147:3 (NLT)',
    text: 'He heals the brokenhearted and bandages their wounds.',
    moodIds: ['in-pain', 'sad'],
  },
  
  // Confused
  {
    reference: 'Proverbs 3:5-6 (NLT)',
    text: 'Trust in the Lord with all your heart; do not depend on your own understanding. Seek his will in all you do, and he will show you which path to take.',
    moodIds: ['confused', 'doubtful'],
  },
  {
    reference: 'James 1:5 (NLT)',
    text: 'If you need wisdom, ask our generous God, and he will give it to you. He will not rebuke you for asking.',
    moodIds: ['confused', 'seeking-wisdom'],
  },
  
  // Overwhelmed
  {
    reference: 'Psalm 61:2 (NLT)',
    text: 'From the ends of the earth, I cry to you for help when my heart is overwhelmed. Lead me to the towering rock of safety.',
    moodIds: ['overwhelmed'],
  },
  
  // Doubtful
  {
    reference: 'Mark 9:24 (NLT)',
    text: 'The father instantly cried out, "I do believe, but help me overcome my unbelief!"',
    moodIds: ['doubtful'],
  },
  {
    reference: 'Hebrews 11:1 (NLT)',
    text: 'Faith shows the reality of what we hope for; it is the evidence of things we cannot see.',
    moodIds: ['doubtful', 'hopeful'],
  },
  
  // Unfocused
  {
    reference: 'Colossians 3:2 (NLT)',
    text: 'Think about the things of heaven, not the things of earth.',
    moodIds: ['unfocused'],
  },
  {
    reference: 'Philippians 4:8 (NLT)',
    text: 'And now, dear brothers and sisters, one final thing. Fix your thoughts on what is true, and honorable, and right, and pure, and lovely, and admirable. Think about things that are excellent and worthy of praise.',
    moodIds: ['unfocused', 'anxious'],
  },
  
  // Discouraged
  {
    reference: 'Joshua 1:9 (NLT)',
    text: "This is my command—be strong and courageous! Do not be afraid or discouraged. For the Lord your God is with you wherever you go.",
    moodIds: ['discouraged', 'fearful'],
  },
  {
    reference: 'Galatians 6:9 (NLT)',
    text: "So let's not get tired of doing what is good. At just the right time we will reap a harvest of blessing if we don't give up.",
    moodIds: ['discouraged', 'tired'],
  },
  
  // Seeking Wisdom
  {
    reference: 'Proverbs 2:6 (NLT)',
    text: 'For the Lord grants wisdom! From his mouth come knowledge and understanding.',
    moodIds: ['seeking-wisdom'],
  },
  {
    reference: 'Psalm 119:105 (NLT)',
    text: 'Your word is a lamp to guide my feet and a light for my path.',
    moodIds: ['seeking-wisdom', 'confused'],
  },
];

export function getVersesForMood(moodId: string): Verse[] {
  return verses.filter(verse => verse.moodIds.includes(moodId));
}

export function getMoodsByCategory(category: MoodCategory): Mood[] {
  return moods.filter(mood => mood.category === category);
}
