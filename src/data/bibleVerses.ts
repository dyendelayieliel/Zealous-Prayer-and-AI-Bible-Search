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
    reference: 'Philippians 4:6-7',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    moodIds: ['anxious', 'overwhelmed'],
  },
  {
    reference: '1 Peter 5:7',
    text: 'Cast all your anxiety on him because he cares for you.',
    moodIds: ['anxious', 'fearful'],
  },
  {
    reference: 'Matthew 6:34',
    text: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.',
    moodIds: ['anxious', 'overwhelmed'],
  },
  
  // Sad
  {
    reference: 'Psalm 34:18',
    text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
    moodIds: ['sad', 'lonely'],
  },
  {
    reference: 'Revelation 21:4',
    text: 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.',
    moodIds: ['sad', 'in-pain'],
  },
  {
    reference: 'Psalm 30:5',
    text: 'Weeping may stay for the night, but rejoicing comes in the morning.',
    moodIds: ['sad', 'hopeful'],
  },
  
  // Angry
  {
    reference: 'James 1:19-20',
    text: 'My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires.',
    moodIds: ['angry'],
  },
  {
    reference: 'Ephesians 4:26-27',
    text: 'In your anger do not sin: Do not let the sun go down while you are still angry, and do not give the devil a foothold.',
    moodIds: ['angry'],
  },
  
  // Lonely
  {
    reference: 'Deuteronomy 31:6',
    text: 'Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.',
    moodIds: ['lonely', 'fearful'],
  },
  {
    reference: 'Psalm 23:4',
    text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
    moodIds: ['lonely', 'fearful'],
  },
  
  // Fearful
  {
    reference: 'Isaiah 41:10',
    text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    moodIds: ['fearful', 'weak'],
  },
  {
    reference: '2 Timothy 1:7',
    text: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
    moodIds: ['fearful', 'weak'],
  },
  
  // Grateful
  {
    reference: '1 Thessalonians 5:18',
    text: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    moodIds: ['grateful', 'hopeful'],
  },
  {
    reference: 'Psalm 107:1',
    text: 'Give thanks to the Lord, for he is good; his love endures forever.',
    moodIds: ['grateful'],
  },
  
  // Hopeful
  {
    reference: 'Jeremiah 29:11',
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    moodIds: ['hopeful', 'discouraged'],
  },
  {
    reference: 'Romans 15:13',
    text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    moodIds: ['hopeful'],
  },
  
  // Tired
  {
    reference: 'Matthew 11:28-30',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.',
    moodIds: ['tired', 'overwhelmed'],
  },
  {
    reference: 'Isaiah 40:31',
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    moodIds: ['tired', 'weak'],
  },
  
  // Sick
  {
    reference: 'James 5:15',
    text: 'And the prayer offered in faith will make the sick person well; the Lord will raise them up.',
    moodIds: ['sick', 'in-pain'],
  },
  {
    reference: 'Psalm 103:2-3',
    text: 'Praise the Lord, my soul, and forget not all his benefits—who forgives all your sins and heals all your diseases.',
    moodIds: ['sick'],
  },
  
  // Restless
  {
    reference: 'Psalm 46:10',
    text: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.',
    moodIds: ['restless', 'anxious'],
  },
  
  // Weak
  {
    reference: '2 Corinthians 12:9',
    text: "But he said to me, \"My grace is sufficient for you, for my power is made perfect in weakness.\" Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me.",
    moodIds: ['weak', 'discouraged'],
  },
  
  // In Pain
  {
    reference: 'Psalm 147:3',
    text: 'He heals the brokenhearted and binds up their wounds.',
    moodIds: ['in-pain', 'sad'],
  },
  
  // Confused
  {
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    moodIds: ['confused', 'doubtful'],
  },
  {
    reference: 'James 1:5',
    text: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',
    moodIds: ['confused', 'seeking-wisdom'],
  },
  
  // Overwhelmed
  {
    reference: 'Psalm 61:2',
    text: 'From the ends of the earth I call to you, I call as my heart grows faint; lead me to the rock that is higher than I.',
    moodIds: ['overwhelmed'],
  },
  
  // Doubtful
  {
    reference: 'Mark 9:24',
    text: "Immediately the boy's father exclaimed, \"I do believe; help me overcome my unbelief!\"",
    moodIds: ['doubtful'],
  },
  {
    reference: 'Hebrews 11:1',
    text: 'Now faith is confidence in what we hope for and assurance about what we not see.',
    moodIds: ['doubtful', 'hopeful'],
  },
  
  // Unfocused
  {
    reference: 'Colossians 3:2',
    text: 'Set your minds on things above, not on earthly things.',
    moodIds: ['unfocused'],
  },
  {
    reference: 'Philippians 4:8',
    text: 'Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.',
    moodIds: ['unfocused', 'anxious'],
  },
  
  // Discouraged
  {
    reference: 'Joshua 1:9',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    moodIds: ['discouraged', 'fearful'],
  },
  {
    reference: 'Galatians 6:9',
    text: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
    moodIds: ['discouraged', 'tired'],
  },
  
  // Seeking Wisdom
  {
    reference: 'Proverbs 2:6',
    text: 'For the Lord gives wisdom; from his mouth come knowledge and understanding.',
    moodIds: ['seeking-wisdom'],
  },
  {
    reference: 'Psalm 119:105',
    text: 'Your word is a lamp for my feet, a light on my path.',
    moodIds: ['seeking-wisdom', 'confused'],
  },
];

export function getVersesForMood(moodId: string): Verse[] {
  return verses.filter(verse => verse.moodIds.includes(moodId));
}

export function getMoodsByCategory(category: MoodCategory): Mood[] {
  return moods.filter(mood => mood.category === category);
}
