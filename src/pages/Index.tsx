import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IOSTabBar } from '@/components/IOSTabBar';
import { IOSMoodSelector } from '@/components/IOSMoodSelector';
import { IOSVerseDisplay } from '@/components/IOSVerseDisplay';
import { IOSPrayerForm } from '@/components/IOSPrayerForm';
import { FreeTextInput } from '@/components/FreeTextInput';
import { FreeTextResults } from '@/components/FreeTextResults';
import { Verse } from '@/data/bibleVerses';
import { useDailyVerse } from '@/hooks/useDailyVerse';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut } from 'lucide-react';
import zealousLogo from '@/assets/zealous-logo.png';

type Tab = 'home' | 'verses' | 'prayer' | 'social';
type VersesMode = 'choose' | 'freetext' | 'freetext-results' | 'category' | 'display';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [versesMode, setVersesMode] = useState<VersesMode>('choose');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [freeTextVerses, setFreeTextVerses] = useState<Verse[]>([]);
  const [userInput, setUserInput] = useState('');
  
  const { verse: dailyVerse, isLoading: isVerseLoading, addFeeling } = useDailyVerse();
  const { user, signOut, isLoading: isAuthLoading } = useAuth();

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
    
    // Store the feeling for personalization
    if (input.trim()) {
      addFeeling(input.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Home Tab */}
      {activeTab === 'home' && (
        <div className="px-5 pt-12 animate-fade-in">
          {/* User header */}
          <div className="flex justify-end mb-4">
            {!isAuthLoading && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/my-prayers"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    My Prayers
                  </Link>
                  <span className="text-muted-foreground">·</span>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Hero */}
          <div className="text-center mb-6">
            <img 
              src={zealousLogo} 
              alt="Zealous" 
              className="h-96 w-96 mx-auto mb-6"
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
            {isVerseLoading ? (
              <div className="space-y-3">
                <div className="h-5 bg-muted rounded animate-pulse"></div>
                <div className="h-5 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-4"></div>
              </div>
            ) : dailyVerse ? (
              <>
                <blockquote className="text-lg leading-relaxed mb-3 italic">
                  "{dailyVerse.verse}"
                </blockquote>
                <p className="text-sm text-muted-foreground mb-3">— {dailyVerse.reference}</p>
                {dailyVerse.reflection && (
                  <p className="text-sm text-muted-foreground/80 border-t border-border pt-3">
                    {dailyVerse.reflection}
                  </p>
                )}
              </>
            ) : (
              <>
                <blockquote className="text-lg leading-relaxed mb-3 italic">
                  "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters."
                </blockquote>
                <p className="text-sm text-muted-foreground">— Psalm 23:1-2</p>
              </>
            )}
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

      {/* Social Tab */}
      {activeTab === 'social' && (
        <div className="px-5 pt-12 animate-fade-in">
          <div className="mb-6">
            <h1 className="ios-large-title">Follow for Daily Christian Content</h1>
            <p className="text-muted-foreground mt-1">
              Follow Scriptural Zealous on social media ✝️
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* YouTube */}
            <a
              href="https://youtube.com/@scripturalzeaolous?si=D9KJy_wJAOtk41v5"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-card p-5 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-semibold text-lg">YouTube</span>
              <svg className="w-5 h-5 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/scripturalzealous/"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-card p-5 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span className="font-semibold text-lg">Instagram</span>
              <svg className="w-5 h-5 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@scripturalzealous?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-card p-5 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              <span className="font-semibold text-lg">TikTok</span>
              <svg className="w-5 h-5 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <IOSTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
