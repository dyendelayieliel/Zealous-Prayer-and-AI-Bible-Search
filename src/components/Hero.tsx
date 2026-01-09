import zealousLogo from '@/assets/zealous-logo.png';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      {/* Logo */}
      <div className="mb-8 animate-pulse-subtle">
        <img 
          src={zealousLogo} 
          alt="Zealous" 
          className="h-40 w-40 md:h-52 md:w-52 object-contain mx-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-display text-glow mb-4 tracking-wider">
        ZEALOUS
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl text-muted-foreground font-body max-w-xl mb-12">
        Find Scripture that speaks to your soul. Wherever you are in life, God's Word has something for you.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest transition-all hover:opacity-90 box-glow"
        >
          Find Verses For Me
        </button>
      </div>

      {/* Verse Teaser */}
      <div className="mt-20 max-w-2xl">
        <p className="text-muted-foreground font-body text-sm uppercase tracking-widest mb-4">
          Today's Encouragement
        </p>
        <blockquote className="text-xl md:text-2xl font-display italic leading-relaxed">
          "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
        </blockquote>
        <p className="text-muted-foreground font-body mt-4">— Jeremiah 29:11</p>
      </div>
    </div>
  );
}
