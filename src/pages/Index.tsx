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
import { User, LogOut, Youtube, Instagram } from 'lucide-react';
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
            <h1 className="ios-large-title">Connect With Us</h1>
            <p className="text-muted-foreground mt-1">
              Follow Zealous on social media
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-card p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-transform"
            >
              <Youtube className="w-12 h-12" />
              <span className="font-medium">YouTube</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-card p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-transform"
            >
              <Instagram className="w-12 h-12" />
              <span className="font-medium">Instagram</span>
            </a>

            {/* Snapchat */}
            <a
              href="https://snapchat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-card p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-transform"
            >
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.166 1c.702 0 3.411.014 4.553 2.705.39.918.358 2.135.327 3.324v.06c-.003.12-.007.24-.01.359.312-.043.628-.016.934.08.293.092.53.23.702.412.183.196.276.428.276.689 0 .082-.01.165-.03.248-.088.348-.33.615-.72.795-.19.087-.397.148-.618.182-.11.017-.223.029-.34.036l-.09.006c-.317.028-.613.127-.859.275-.052.032-.102.068-.148.106-.096.08-.178.173-.246.28-.067.106-.114.225-.138.357-.025.13-.025.275 0 .43.046.287.166.586.347.885.182.3.414.58.684.829l.19.171c.31.268.665.53 1.054.777.388.246.78.456 1.163.626.384.17.751.3 1.087.391.337.091.636.139.889.143.252.003.457-.037.612-.12.156-.084.25-.2.278-.353.025-.138-.008-.312-.098-.516-.09-.205-.227-.38-.41-.523-.12-.094-.265-.156-.43-.185-.084-.015-.172-.018-.263-.01-.17.015-.344.07-.518.165l-.15.09c-.08-.246-.14-.502-.177-.766-.037-.263-.052-.532-.043-.803.009-.272.04-.544.095-.816.054-.27.131-.535.23-.792.099-.257.218-.502.358-.736.14-.233.298-.45.476-.651.177-.2.372-.378.582-.535.21-.156.437-.289.676-.396.24-.108.493-.19.76-.244.266-.055.544-.08.833-.076.29.003.578.04.867.11.288.07.57.173.844.31.274.136.533.303.78.5.246.198.472.426.678.686.206.26.385.55.537.87.152.32.27.668.355 1.043.085.375.131.774.14 1.196l.002.156c0 .363-.027.719-.08 1.066-.054.347-.134.682-.24 1.004-.106.322-.237.626-.393.914-.155.288-.336.554-.54.799-.204.244-.432.462-.683.654-.25.192-.523.354-.818.487-.295.133-.61.233-.944.3-.335.068-.689.1-1.062.097-.373-.004-.754-.054-1.143-.15-.39-.096-.778-.236-1.166-.42-.388-.184-.768-.41-1.14-.678-.372-.268-.729-.576-1.07-.924l-.166-.177c-.302-.327-.574-.679-.815-1.054-.24-.375-.443-.77-.607-1.182-.164-.412-.286-.839-.365-1.277-.08-.438-.113-.887-.1-1.344.003-.114.008-.228.016-.34l.006-.085c.019-.25.044-.498.077-.742.018-.137.039-.273.062-.406l-.147.012c-.185.011-.376.01-.571-.003-.195-.013-.392-.04-.59-.082-.198-.04-.394-.097-.587-.168-.193-.07-.381-.158-.562-.261-.18-.103-.35-.221-.507-.354-.158-.133-.3-.28-.426-.44-.127-.16-.232-.334-.316-.518-.084-.184-.141-.38-.17-.585-.03-.206-.027-.42.007-.641.034-.221.102-.447.203-.676.102-.228.239-.457.412-.685.173-.227.381-.449.624-.665-.013-.138-.024-.275-.035-.412l-.018-.23c-.036-.45-.073-.91-.04-1.361.034-.451.106-.893.22-1.324.114-.432.271-.849.474-1.251.203-.401.452-.78.747-1.135.296-.356.636-.683 1.022-.98.386-.297.816-.557 1.29-.778.473-.221.988-.395 1.543-.524.556-.128 1.152-.198 1.79-.208h.178z"/>
              </svg>
              <span className="font-medium">Snapchat</span>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-card p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-transform"
            >
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              <span className="font-medium">TikTok</span>
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
