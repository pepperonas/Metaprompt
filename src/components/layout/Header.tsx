import React from 'react';

type Page = 'dashboard' | 'metaprompts' | 'settings' | 'history';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange, onAboutClick }) => {
  const pages: { id: Page; label: string; icon?: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'metaprompts', label: 'Metaprompts' },
    { id: 'settings', label: 'Einstellungen' },
    { id: 'history', label: 'Verlauf' },
  ];

  return (
    <header className="bg-bg-secondary border-b border-bg-primary py-4" style={{ 
      paddingLeft: '20px', 
      paddingRight: '80px',
      paddingTop: '20px'
    } as React.CSSProperties}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary flex-shrink-0">MRP</h1>
        <nav className="flex items-center space-x-4 flex-shrink-0">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                currentPage === page.id
                  ? 'bg-brand text-white shadow-lg glow-brand'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
              }`}
            >
              {page.label}
            </button>
          ))}
          <button
            onClick={onAboutClick}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-text-secondary hover:text-text-primary hover:bg-bg-primary"
            title="Über MRP"
          >
            Über
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

