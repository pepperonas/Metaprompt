import React from 'react';
import { Card } from './Card';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  version: string;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose, version }) => {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 relative">
        {/* Close Button oben rechts */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-primary z-10"
          aria-label="Schließen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="space-y-6">
          {/* App Icon */}
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center shadow-lg shadow-brand/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* App Name & Tagline */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-text-primary">Metaprompt</h2>
            <p className="text-text-secondary">KI-gestützte Prompt-Optimierung</p>
          </div>

          {/* Version */}
          <div className="text-center">
            <p className="text-sm text-text-secondary">Version {version}</p>
          </div>

          {/* Separator */}
          <div className="border-t border-bg-primary"></div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              © {currentYear} Martin Pfeffer
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center space-x-6">
            <a
              href="https://www.linkedin.com/in/martin-pfeffer-020831134/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-brand hover:bg-bg-primary transition-all duration-200 group"
              title="LinkedIn"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            <a
              href="https://github.com/pepperonas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-brand hover:bg-bg-primary transition-all duration-200 group"
              title="GitHub"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>

          {/* celox.io - Prominent */}
          <div className="text-center pt-2">
            <a
              href="https://celox.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-brand hover:text-brand/80 transition-colors font-semibold text-base group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>celox.io</span>
            </a>
          </div>

        </div>
      </Card>
    </div>
  );
};
