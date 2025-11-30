import React, { useState, useRef, useEffect } from 'react';

type Page = 'dashboard' | 'metaprompts' | 'settings' | 'history';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onAboutClick: () => void;
  onGuideClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, onAboutClick, onGuideClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Schließe Dropdown beim Klicken außerhalb
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMenu]);
  const pages: { id: Page; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'metaprompts', 
      label: 'Metaprompts',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      label: 'Einstellungen',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'history', 
      label: 'Verlauf',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <header 
      className="bg-bg-secondary border-b border-bg-primary" 
      style={{ 
        paddingLeft: '24px', 
        paddingRight: '24px',
        paddingTop: '20px',
        paddingBottom: '20px',
        WebkitAppRegion: 'drag' as any
      } as React.CSSProperties}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Metaprompt</h1>
          <span className="text-xs text-text-secondary font-medium px-2 py-1 bg-bg-primary rounded-md">
            KI-gestützte Prompt-Optimierung
          </span>
        </div>
        <nav className="flex items-center space-x-1 flex-shrink-0">
          {/* Hauptnavigation - Icons mit Labels */}
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                currentPage === page.id
                  ? 'bg-brand text-white shadow-lg shadow-brand/30 glow-brand'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary active:scale-95'
              }`}
              style={{ WebkitAppRegion: 'no-drag' as any }}
              title={page.label}
              aria-current={currentPage === page.id ? 'page' : undefined}
            >
              <span className={currentPage === page.id ? 'text-white' : 'text-current'}>
                {page.icon}
              </span>
              <span className="hidden sm:inline">{page.label}</span>
            </button>
          ))}
          
          {/* Separator */}
          <div className="w-px h-7 bg-bg-primary mx-2" />
          
          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-lg transition-all duration-200 text-text-secondary hover:text-text-primary hover:bg-bg-primary active:scale-95"
              style={{ WebkitAppRegion: 'no-drag' as any }}
              title="Mehr Optionen"
              aria-label="Mehr Optionen"
              aria-expanded={showMenu}
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
                />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-bg-primary rounded-lg shadow-lg z-50 py-1"
                role="menu"
                aria-orientation="vertical"
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onGuideClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-primary transition-colors duration-150 text-left"
                  style={{ WebkitAppRegion: 'no-drag' as any }}
                  role="menuitem"
                >
                  <svg 
                    className="h-5 w-5 text-text-secondary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                  <span>Anleitung</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onAboutClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-primary transition-colors duration-150 text-left"
                  role="menuitem"
                >
                  <svg 
                    className="h-5 w-5 text-text-secondary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <span>Über die App</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

