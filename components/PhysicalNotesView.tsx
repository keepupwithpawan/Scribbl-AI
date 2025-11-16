
import React, { useRef } from 'react';
import type { PhysicalNotesData } from '../types';
import { usePdfDownloader } from '../hooks/usePdfDownloader';
import { PdfDownloadButton } from './PdfDownloadButton';

interface PhysicalNotesViewProps {
  data: PhysicalNotesData;
}

export const PhysicalNotesView: React.FC<PhysicalNotesViewProps> = ({ data }) => {
    const notesRef = useRef<HTMLDivElement>(null);
    const { downloadPdf } = usePdfDownloader(notesRef, data.title);

  return (
    <>
      <div ref={notesRef} className="bg-white dark:bg-black p-4 sm:p-8 md:p-12 font-handwriting text-black dark:text-white">
        <div className="max-w-2xl mx-auto animate-fade-in border-2 border-dashed border-neutral-400 dark:border-neutral-600 p-8 rounded-lg">
            <header className="mb-8 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white underline decoration-wavy decoration-black dark:decoration-white">{data.title}</h1>
                <p className="text-xl mt-4 text-neutral-600 dark:text-neutral-400">{data.mainSummary}</p>
            </header>

            <main className="space-y-10">
                {data.sections.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-4xl font-bold text-black dark:text-white mb-4">{section.heading}</h2>
                        <ul className="space-y-3 pl-6">
                            {section.points.map((point, pIndex) => (
                                <li key={pIndex} className="text-2xl relative before:content-['→'] before:absolute before:left-[-1.5rem] before:text-black dark:before:text-white">
                                    {point}
                                </li>
                            ))}
                        </ul>
                        {section.diagramIdea && (
                            <div className="mt-6 ml-4 p-4 border-2 border-black dark:border-white rounded-lg rotate-[-2deg] bg-white dark:bg-black">
                                <h3 className="text-2xl font-bold text-black dark:text-white">{section.diagramIdea.title} (Drawing Idea)</h3>
                                <p className="text-xl text-neutral-700 dark:text-neutral-300 mt-2">{section.diagramIdea.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
      </div>
      <PdfDownloadButton onDownload={downloadPdf} disabled={!data} />
    </>
  );
};
