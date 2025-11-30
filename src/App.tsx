import { useEffect, useState } from 'react';
import { useSettingsStore } from './stores/useSettingsStore';
import { useApiKeysStore } from './stores/useApiKeysStore';
import { useMetapromptsStore } from './stores/useMetapromptsStore';
import Dashboard from './pages/Dashboard';
import Metaprompts from './pages/Metaprompts';
import Settings from './pages/Settings';
import History from './pages/History';
import Header from './components/layout/Header';
import StatusBar from './components/layout/StatusBar';
import { AboutDialog } from './components/ui/AboutDialog';
import { OnboardingDialog } from './components/ui/OnboardingDialog';
import { GuideDialog } from './components/ui/GuideDialog';
import type { Provider } from './types';

type Page = 'dashboard' | 'metaprompts' | 'settings' | 'history';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showAbout, setShowAbout] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [version, setVersion] = useState('1.0.0');
  const { loadSettings, settings, updateSettings } = useSettingsStore();
  const { loadApiKey } = useApiKeysStore();
  const { loadMetaprompts } = useMetapromptsStore();
  
  useEffect(() => {
    // Lade Versionsnummer
    window.mrp.app.getVersion().then(setVersion);
  }, []);

  useEffect(() => {
    // Initial load
    loadSettings();
    loadMetaprompts();
    
    // Load all API keys
    (['openai', 'anthropic', 'grok', 'gemini'] as Provider[]).forEach(provider => {
      loadApiKey(provider);
    });

    // Listen for provider changes from tray/menu
    const unsubscribeProvider = window.mrp.onProviderChange((provider: Provider) => {
      useSettingsStore.getState().updateSettings({ activeProvider: provider });
      // Menüleiste wird automatisch aktualisiert, da sie die Settings liest
    });

    const unsubscribeMetaprompt = window.mrp.onMetapromptChange((id: string) => {
      useSettingsStore.getState().updateSettings({ activeMetapromptId: id });
      // Menüleiste wird automatisch aktualisiert, da sie die Settings liest
    });

    const unsubscribeNavigate = window.mrp.onNavigate((page: string) => {
      if (['dashboard', 'metaprompts', 'settings', 'history'].includes(page)) {
        setCurrentPage(page as Page);
      }
    });

    const unsubscribeShowGuide = window.mrp.onShowGuide(() => {
      setShowGuide(true);
    });

    const unsubscribeShowOnboarding = window.mrp.onShowOnboarding(() => {
      setShowOnboarding(true);
    });

    const unsubscribeShowAbout = window.mrp.onShowAbout(() => {
      setShowAbout(true);
    });

    return () => {
      unsubscribeProvider();
      unsubscribeMetaprompt();
      unsubscribeNavigate();
      unsubscribeShowGuide();
      unsubscribeShowOnboarding();
      unsubscribeShowAbout();
    };
  }, []);

  // Zeige Onboarding-Dialog beim App-Start, außer es wurde deaktiviert
  useEffect(() => {
    if (!onboardingChecked && settings !== null) {
      setOnboardingChecked(true);
      
      // Zeige Onboarding wenn es nicht explizit auf false gesetzt wurde
      // Standardmäßig wird es angezeigt (true oder undefined)
      const shouldShow = settings.showOnboarding !== false;
      
      if (shouldShow) {
        // Verzögerung, damit die App vollständig geladen ist
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [settings, onboardingChecked]);

  const handleOnboardingClose = async (dontShowAgain: boolean) => {
    setShowOnboarding(false);
    // Wenn Checkbox angekreuzt: Onboarding deaktivieren (false)
    // Wenn Checkbox nicht angekreuzt: Onboarding aktivieren (true), damit es weiterhin angezeigt wird
    await updateSettings({ showOnboarding: !dontShowAgain });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'metaprompts':
        return <Metaprompts />;
      case 'settings':
        return <Settings />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary">
      <Header 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        onAboutClick={() => setShowAbout(true)}
        onGuideClick={() => setShowGuide(true)}
      />
      <main className="flex-1 overflow-auto bg-bg-primary">
        {renderPage()}
      </main>
      <StatusBar />
      <AboutDialog isOpen={showAbout} onClose={() => setShowAbout(false)} version={version} />
      <OnboardingDialog isOpen={showOnboarding} onClose={handleOnboardingClose} />
      <GuideDialog isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}

export default App;

