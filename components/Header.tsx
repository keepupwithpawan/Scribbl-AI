
import React from 'react';
import type { Theme } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { GitHubIcon } from './icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
            Scribbbl AI
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