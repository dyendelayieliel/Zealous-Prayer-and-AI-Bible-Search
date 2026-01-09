import zealousLogo from '@/assets/zealous-logo.png';

interface HeaderProps {
  onNavigate: (section: 'home' | 'verses' | 'prayer') => void;
  currentSection: 'home' | 'verses' | 'prayer';
}

export function Header({ onNavigate, currentSection }: HeaderProps) {
  return (
    <header className="w-full py-6 px-4 border-b border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img 
            src={zealousLogo} 
            alt="Zealous" 
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-display tracking-wider">ZEALOUS</span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('verses')}
            className={`font-body text-sm uppercase tracking-widest transition-all ${
              currentSection === 'verses' 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Find Verses
          </button>
          <button
            onClick={() => onNavigate('prayer')}
            className={`font-body text-sm uppercase tracking-widest transition-all ${
              currentSection === 'prayer' 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Prayer Request
          </button>
        </nav>
      </div>
    </header>
  );
}
