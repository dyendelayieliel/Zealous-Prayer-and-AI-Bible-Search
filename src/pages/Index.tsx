import { useState } from 'react';
import { IOSTabBar } from '@/components/IOSTabBar';
import { IOSMoodSelector } from '@/components/IOSMoodSelector';
import { IOSVerseDisplay } from '@/components/IOSVerseDisplay';
import { IOSPrayerForm } from '@/components/IOSPrayerForm';
import { FreeTextInput } from '@/components/FreeTextInput';
import { FreeTextResults } from '@/components/FreeTextResults';
import { Verse } from '@/data/bibleVerses';
import zealousLogo from '@/assets/zealous-logo.png';

type Tab = 'home' | 'verses' | 'prayer';
type VersesMode = 'choose' | 'freetext' | 'freetext-results' | 'category' | 'display';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [versesMode, setVersesMode] = useState<VersesMode>('choose');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [freeTextVerses, setFreeTextVerses] = useState<Verse[]>([]);
  const [userInput, setUserInput] = useState('');

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'verses') {
      setVersesMode('choose');
      setSelectedMood(null);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setVersesMode('display');
  };

  const handleFreeTextResults = (verses: Verse[], input: string) => {
    setFreeTextVerses(verses);
    setUserInput(input);
    setVersesMode('freetext-results');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Home Tab */}
      {activeTab === 'home' && (
        <div className="px-5 pt-16 animate-fade-in">
          {/* Hero */}
          <div className="text-center mb-6">
            <img 
              src={zealousLogo} 
              alt="Zealous" 
              className="h-28 w-28 mx-auto mb-6"
            />
            <h1 className="ios-large-title mb-2">Zealous</h1>
            <p className="text-muted-foreground">
              Scripture for your soul
            </p>
          </div>

          {/* Daily Verse */}
          <div className="ios-card p-5 mb-8">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Today's Encouragement
            </p>
            <blockquote className="text-lg leading-relaxed mb-3 italic">
              "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
            </blockquote>
            <p className="text-sm text-muted-foreground">— Jeremiah 29:11</p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setActiveTab('verses');
                setVersesMode('freetext');
              }}
              className="ios-card w-full p-5 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">How are you feeling?</h3>
                  <p className="text-sm text-muted-foreground">
                    Share in your own words
                  </p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('verses');
                setVersesMode('category');
              }}
              className="ios-card w-full p-5 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Browse by feeling</h3>
                  <p className="text-sm text-muted-foreground">
                    Emotional, physical, or mental
                  </p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('prayer')}
              className="ios-card w-full p-5 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Submit a prayer request</h3>
                  <p className="text-sm text-muted-foreground">
                    Let us pray for you
                  </p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

        </div>
      )}

      {/* Verses Tab */}
      {activeTab === 'verses' && (
        <div className="px-5 pt-12">
          {/* Header */}
          <div className="mb-6">
            <h1 className="ios-large-title">
              {versesMode === 'freetext' || versesMode === 'freetext-results' 
                ? 'Share Your Heart' 
                : versesMode === 'display' 
                  ? 'Scripture'
                  : 'Find Scripture'}
            </h1>
            {versesMode === 'choose' && (
              <p className="text-muted-foreground mt-1">
                Choose how you'd like to find verses
              </p>
            )}
          </div>

          {/* Mode Selection */}
          {versesMode === 'choose' && (
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => setVersesMode('freetext')}
                className="ios-card w-full p-5 text-left active:scale-[0.98] transition-transform"
              >
                <h3 className="font-semibold mb-1">Express Yourself</h3>
                <p className="text-sm text-muted-foreground">
                  Type how you're feeling in your own words
                </p>
              </button>

              <button
                onClick={() => setVersesMode('category')}
                className="ios-card w-full p-5 text-left active:scale-[0.98] transition-transform"
              >
                <h3 className="font-semibold mb-1">Browse Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Select from emotional, physical, or mental states
                </p>
              </button>
            </div>
          )}

          {/* Free Text Mode */}
          {versesMode === 'freetext' && (
            <FreeTextInput onVersesFound={handleFreeTextResults} />
          )}

          {/* Free Text Results */}
          {versesMode === 'freetext-results' && (
            <FreeTextResults
              verses={freeTextVerses}
              userInput={userInput}
              onBack={() => setVersesMode('choose')}
              onTryAgain={() => setVersesMode('freetext')}
            />
          )}

          {/* Category Mode */}
          {versesMode === 'category' && (
            <IOSMoodSelector
              onMoodSelect={handleMoodSelect}
              selectedMood={selectedMood}
            />
          )}

          {/* Verse Display */}
          {versesMode === 'display' && selectedMood && (
            <IOSVerseDisplay
              moodId={selectedMood}
              onBack={() => {
                setSelectedMood(null);
                setVersesMode('category');
              }}
            />
          )}
        </div>
      )}

      {/* Prayer Tab */}
      {activeTab === 'prayer' && (
        <div className="px-5 pt-12">
          <div className="mb-6">
            <h1 className="ios-large-title">Prayer Request</h1>
            <p className="text-muted-foreground mt-1">
              Share your burdens with us
            </p>
          </div>

          <IOSPrayerForm />
        </div>
      )}

      {/* Tab Bar */}
      <IOSTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
