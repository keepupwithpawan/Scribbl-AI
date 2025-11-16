
import React from 'react';
import type { Theme } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { GitHubIcon } from './icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  isScrolled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, isScrolled }) => {
  return (
    <header className={`sticky top-0 z-50 p-4 transition-all duration-300 ${isScrolled ? 'bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl text-black dark:text-white font-handwriting lowercase">
            Scribbl AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <a
                href="https://github.com/keepupwithpawan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="text-black dark:text-white hover:opacity-75 transition-opacity"
            >
                <GitHubIcon className="w-6 h-6" />
            </a>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
};
