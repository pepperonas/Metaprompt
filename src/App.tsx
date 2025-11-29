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
import type { Provider } from './types';

type Page = 'dashboard' | 'metaprompts' | 'settings' | 'history';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showAbout, setShowAbout] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
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

    // Listen for provider changes from tray
    const unsubscribeProvider = window.mrp.onProviderChange((provider: Provider) => {
      useSettingsStore.getState().updateSettings({ activeProvider: provider });
    });

    const unsubscribeMetaprompt = window.mrp.onMetapromptChange((id: string) => {
      useSettingsStore.getState().updateSettings({ activeMetapromptId: id });
    });

    return () => {
      unsubscribeProvider();
      unsubscribeMetaprompt();
    };
  }, []);

  // Zeige Onboarding-Dialog beim ersten Start
  useEffect(() => {
    if (settings) {
      // Zeige Onboarding wenn explizit true
      if (settings.showOnboarding === true) {
        // Kleine Verzögerung, damit die App vollständig geladen ist
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [settings]);

  const handleOnboardingClose = async (dontShowAgain: boolean) => {
    setShowOnboarding(false);
    if (dontShowAgain) {
      await updateSettings({ showOnboarding: false });
    }
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
      <Header currentPage={currentPage} onPageChange={setCurrentPage} onAboutClick={() => setShowAbout(true)} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
      <StatusBar />
      <AboutDialog isOpen={showAbout} onClose={() => setShowAbout(false)} version={version} />
      <OnboardingDialog isOpen={showOnboarding} onClose={handleOnboardingClose} />
    </div>
  );
}

export default App;

