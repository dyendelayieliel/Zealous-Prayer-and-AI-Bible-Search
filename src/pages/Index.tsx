import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MoodSelector } from '@/components/MoodSelector';
import { VerseDisplay } from '@/components/VerseDisplay';
import { PrayerRequestForm } from '@/components/PrayerRequestForm';

type Section = 'home' | 'verses' | 'prayer';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleNavigate = (section: Section) => {
    setCurrentSection(section);
    setSelectedMood(null);
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleBackToMoods = () => {
    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNavigate={handleNavigate} currentSection={currentSection} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Home/Hero Section */}
        {currentSection === 'home' && (
          <Hero onGetStarted={() => handleNavigate('verses')} />
        )}

        {/* Verses Section */}
        {currentSection === 'verses' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display text-glow mb-4">
                How Are You Feeling?
              </h1>
              <p className="text-muted-foreground font-body max-w-xl mx-auto">
                Select what resonates with your current state, and we'll share Scripture that speaks to your heart.
              </p>
            </div>

            {selectedMood ? (
              <VerseDisplay moodId={selectedMood} onBack={handleBackToMoods} />
            ) : (
              <MoodSelector 
                onMoodSelect={handleMoodSelect} 
                selectedMood={selectedMood} 
              />
            )}
          </div>
        )}

        {/* Prayer Request Section */}
        {currentSection === 'prayer' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display text-glow mb-4">
                Prayer Request
              </h1>
              <p className="text-muted-foreground font-body max-w-xl mx-auto">
                Share your burdens with us. We believe in the power of prayer and would be honored to lift you up.
              </p>
            </div>

            <PrayerRequestForm />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-body text-sm">
            © {new Date().getFullYear()} Zealous. All Scripture quotations from the NIV.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
