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
                <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.494.313-.043.63-.024.94.053.375.103.651.286.81.507.166.233.22.506.16.79-.07.338-.298.616-.72.779a2.28 2.28 0 01-.534.136c-.09.014-.183.025-.283.033-.022.002-.044.004-.066.007-.418.04-.754.184-.917.298-.061.042-.117.09-.167.144l-.02.024c-.088.1-.141.213-.18.347a.93.93 0 00-.025.238c.013.208.085.406.19.594.12.211.269.413.428.603.077.09.156.177.237.263.286.299.617.588.965.847.314.235.666.462 1.04.666.377.206.733.376 1.06.504.35.137.67.233.942.283.283.053.533.065.72.03.09-.017.168-.04.237-.072.118-.055.208-.136.272-.242a.604.604 0 00.085-.274c.006-.127-.025-.26-.085-.392a.91.91 0 00-.28-.361.793.793 0 00-.428-.158c-.082-.007-.167-.002-.252.014-.122.024-.24.067-.354.126a2.16 2.16 0 00-.324.2c.008-.042.016-.085.022-.13l.01-.069c.053-.381.068-.762.033-1.14a4.946 4.946 0 00-.264-1.124 4.23 4.23 0 00-.54-.983 3.63 3.63 0 00-.777-.79 3.212 3.212 0 00-.96-.51c-.377-.125-.775-.188-1.182-.188h-.088c-.4.007-.78.08-1.14.217-.344.132-.661.32-.943.558a3.54 3.54 0 00-.72.798 4.138 4.138 0 00-.5.99 4.946 4.946 0 00-.244 1.136 5.572 5.572 0 00.05 1.181l.007.05c-.1-.05-.206-.093-.316-.126a1.587 1.587 0 00-.29-.058.778.778 0 00-.393.104.69.69 0 00-.27.283.625.625 0 00-.072.32c.007.13.05.26.13.382.082.125.198.227.343.303.068.036.142.066.22.09.263.078.562.108.879.082.047-.004.094-.008.14-.014.318-.041.62-.13.896-.262a2.8 2.8 0 00.757-.494c.093-.084.18-.17.262-.26a6.58 6.58 0 00.43-.531c.115-.16.215-.33.298-.505a2.1 2.1 0 00.165-.523c.015-.084.025-.169.03-.252.013-.233-.03-.462-.125-.673a1.42 1.42 0 00-.39-.505 1.502 1.502 0 00-.579-.288c-.224-.066-.46-.09-.697-.069a2.3 2.3 0 00-.316.043c.008-.149.019-.315.03-.496l.003-.06c.104-1.628.23-3.654-.299-4.848C7.77 1.07 4.474.793 3.485.793H3.41c-1.05 0-4.55.314-6.127 3.858-.53 1.194-.404 3.22-.3 4.848l.003.06c.012.18.022.346.03.496a2.3 2.3 0 00-.316-.043 2.077 2.077 0 00-.697.069 1.502 1.502 0 00-.58.288 1.42 1.42 0 00-.388.505c-.096.211-.138.44-.126.673.005.083.015.168.03.252a2.1 2.1 0 00.166.523c.082.175.183.345.297.505.127.177.27.354.43.531.083.09.17.176.263.26.213.193.467.359.756.494.277.133.579.221.897.262.046.006.093.01.14.014.317.026.616-.004.878-.082a1.36 1.36 0 00.221-.09.829.829 0 00.343-.303.665.665 0 00.13-.382.625.625 0 00-.073-.32.69.69 0 00-.27-.283.778.778 0 00-.392-.104c-.1.004-.196.024-.29.058a1.52 1.52 0 00-.317.126l.007-.05a5.57 5.57 0 00.05-1.181 4.946 4.946 0 00-.244-1.136 4.138 4.138 0 00-.5-.99 3.54 3.54 0 00-.72-.798 3.308 3.308 0 00-.943-.558 3.098 3.098 0 00-1.14-.217h-.088c-.407 0-.805.063-1.182.188-.35.116-.67.287-.96.51a3.63 3.63 0 00-.777.79c-.22.302-.4.63-.54.983a4.946 4.946 0 00-.264 1.124 5.394 5.394 0 00.033 1.14l.01.07.022.129a2.16 2.16 0 00-.324-.2 1.502 1.502 0 00-.354-.126.84.84 0 00-.252-.014.793.793 0 00-.428.158.91.91 0 00-.28.361.817.817 0 00-.085.392c.01.1.037.19.085.274.064.106.154.187.272.242.069.032.147.055.236.072.188.035.438.023.721-.03.272-.05.593-.146.942-.283.327-.128.683-.298 1.06-.504.374-.204.726-.431 1.04-.666.348-.259.679-.548.965-.847.08-.086.16-.173.237-.263.16-.19.308-.392.428-.603a1.68 1.68 0 00.19-.594.93.93 0 00-.026-.238 1.05 1.05 0 00-.18-.347l-.019-.024a1.03 1.03 0 00-.167-.144c-.163-.114-.5-.258-.917-.298-.022-.003-.044-.005-.066-.007a2.64 2.64 0 01-.283-.033 2.28 2.28 0 01-.535-.136c-.42-.163-.65-.44-.72-.78a.78.78 0 01.161-.788c.16-.221.434-.404.81-.507.31-.077.627-.096.94-.053-.008-.149-.018-.315-.03-.494l-.003-.06c-.104-1.628-.23-3.654.3-4.847C7.633 1.07 11.012.793 12.06.793h.146z" transform="translate(0 3)"/>
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
