
import React from 'react';
import { DownloadIcon } from './icons';

interface PdfDownloadButtonProps {
    onDownload: () => void;
    disabled: boolean;
}

export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({ onDownload, disabled }) => {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button
                onClick={onDownload}
                disabled={disabled}
                className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                aria-label="Download as PDF"
            >
                <DownloadIcon className="w-5 h-5" />
                <span>Download PDF</span>
            </button>
        </div>
    );
};
