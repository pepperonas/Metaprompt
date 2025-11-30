import React from 'react';

type Page = 'dashboard' | 'metaprompts' | 'settings' | 'history';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onAboutClick: () => void;
  onGuideClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, onAboutClick, onGuideClick }) => {
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
    <header className="bg-bg-secondary border-b border-bg-primary" style={{ 
      paddingLeft: '24px', 
      paddingRight: '24px',
      paddingTop: '20px',
      paddingBottom: '20px'
    } as React.CSSProperties}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Metaprompt</h1>
          <span className="text-xs text-text-secondary font-medium px-2 py-1 bg-bg-primary rounded-md">
            Prompt-Optimierer
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
          
          {/* Utility Buttons - Icons only */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onGuideClick}
              className="p-2.5 rounded-lg transition-all duration-200 text-text-secondary hover:text-text-primary hover:bg-bg-primary active:scale-95"
              title="Anleitung anzeigen"
              aria-label="Anleitung"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </button>
            
            <button
              onClick={onAboutClick}
              className="p-2.5 rounded-lg transition-all duration-200 text-text-secondary hover:text-text-primary hover:bg-bg-primary active:scale-95"
              title="Über Metaprompt"
              aria-label="Über Metaprompt"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

