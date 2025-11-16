import React from 'react';
import { ArrowRightIcon } from './icons';

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
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Demo: Generates notes for a DBMS lecture..."
          className="w-full pl-6 pr-40 py-4 text-md text-black dark:text-white bg-white dark:bg-black border-2 border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white focus:ring-0 rounded-full shadow-sm transition-all duration-300 outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white dark:text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>Generate Notes</span>
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};