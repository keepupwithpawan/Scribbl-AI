
import React from 'react';
import { ArrowUpRightIcon } from './icons';

interface UrlInputFormProps {
  url: string;
  setUrl: (url: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ url, setUrl, handleGenerate, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 md:gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube video link here..."
          className="flex-grow pl-6 pr-6 py-4 text-md text-black dark:text-white bg-white dark:bg-black border-2 border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white focus:ring-0 rounded-full shadow-sm transition-all duration-300 outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          aria-label="Generate notes"
          className="flex-shrink-0 flex items-center justify-center bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white dark:text-black font-semibold w-14 h-14 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ArrowUpRightIcon className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};
