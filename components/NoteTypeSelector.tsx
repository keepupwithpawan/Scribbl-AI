
import React from 'react';
import type { NoteType } from '../types';
import { BookOpenIcon, EditIcon } from './icons';

interface NoteTypeSelectorProps {
  onSelect: (type: NoteType) => void;
  isLoading: boolean;
}

const SelectorButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ icon, title, description, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full text-left p-6 bg-white dark:bg-black rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white hover:rounded-3xl transition-all duration-300 disabled:opacity-50 disabled:transform-none"
    >
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-neutral-100 dark:bg-neutral-900 p-3 rounded-xl">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
        </div>
    </button>
);


export const NoteTypeSelector: React.FC<NoteTypeSelectorProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in-up" style={{ animationDelay: '400ms', opacity: 0 }}>
        <p className="text-center text-lg text-neutral-700 dark:text-neutral-300 mb-6">Choose your desired note format:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectorButton
                icon={<BookOpenIcon className="w-6 h-6 text-black dark:text-white" />}
                title="Get Digital Notes"
                description="Generate a PDF of beautifully curated notes with summaries, charts, and practice questions."
                onClick={() => onSelect('digital')}
                disabled={isLoading}
            />
            <SelectorButton
                icon={<EditIcon className="w-6 h-6 text-black dark:text-white" />}
                title="Get Physical Notes Layout"
                description="View and download a handwritten-style layout with simple diagrams to write yourself."
                onClick={() => onSelect('physical')}
                disabled={isLoading}
            />
        </div>
    </div>
  );
};
