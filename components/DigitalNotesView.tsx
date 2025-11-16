
import React, { useRef } from 'react';
import type { DigitalNotesData, ChartAndGraph } from '../types';
import { usePdfDownloader } from '../hooks/usePdfDownloader';
import { PdfDownloadButton } from './PdfDownloadButton';

// --- Reusable Visual Components ---

const GeneratedImage: React.FC<{ src: string, alt: string }> = ({ src, alt }) => (
    <div className="my-6 p-3 bg-white dark:bg-neutral-800 shadow-md rounded-sm transform -rotate-2 transition-transform hover:rotate-0 hover:scale-105">
      <figure className="bg-neutral-100 dark:bg-neutral-900 p-2">
        <img src={src} alt={alt} className="w-full h-auto object-cover" />
        <figcaption className="text-xs text-center italic text-neutral-500 dark:text-neutral-400 mt-2">{alt}</figcaption>
      </figure>
    </div>
);

const ImagePlaceholder: React.FC<{ description: string }> = ({ description }) => (
  <div className="my-6 p-3 bg-white dark:bg-neutral-800 shadow-md rounded-sm transform -rotate-2 transition-transform hover:rotate-0 hover:scale-105">
    <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-sm flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-neutral-800/50">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-neutral-400 mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
      <p className="font-semibold text-sm text-neutral-600 dark:text-neutral-300">Image Idea</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 italic max-w-xs">{description}</p>
    </div>
  </div>
);


const Flowchart: React.FC<{ data: string[] }> = ({ data }) => (
    <div className="flex flex-col items-center space-y-2">
        {data.map((step, index) => (
            <React.Fragment key={index}>
                <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2 text-center shadow-sm text-sm">
                    {step}
                </div>
                {index < data.length - 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 dark:text-neutral-500"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                )}
            </React.Fragment>
        ))}
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.value), 0);
    return (
        <div className="flex justify-around items-end h-48 w-full p-4 border-b-2 border-l-2 border-neutral-300 dark:border-neutral-700 space-x-2">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center h-full justify-end w-1/4">
                    <div
                        className="w-3/5 bg-neutral-800 dark:bg-neutral-200 rounded-t-sm"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                        title={`${item.label}: ${item.value}`}
                    ></div>
                    <p className="text-xs mt-2 text-center text-neutral-600 dark:text-neutral-400">{item.label}</p>
                </div>
            ))}
        </div>
    );
};

const ChartRenderer: React.FC<{ chart: ChartAndGraph }> = ({ chart }) => {
    return (
        <div className="p-4 my-4 bg-white/50 dark:bg-black/20 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm flex flex-col items-center">
            <h4 className="font-semibold text-md mb-2 text-black dark:text-white">{chart.title}</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center">{chart.description}</p>
            <div className="w-full max-w-md mx-auto">
                 {chart.type === 'flowchart' && Array.isArray(chart.data) && <Flowchart data={chart.data} />}
                 {chart.type === 'bar_chart' && Array.isArray(chart.data) && <BarChart data={chart.data} />}
            </div>
        </div>
    );
};

const StickyNote: React.FC<{ question: string; index: number }> = ({ question, index }) => {
    const colors = [
        'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800/60',
        'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800/60',
        'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/60',
        'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-800/60',
    ];
    const rotations = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1'];
    return (
        <div className={`p-4 shadow-lg rounded-md border font-handwriting text-lg ${colors[index % colors.length]} ${rotations[index % rotations.length]}`}>
            {question}
        </div>
    )
}

// --- Main View Component ---

export const DigitalNotesView: React.FC<{ data: DigitalNotesData }> = ({ data }) => {
  const notesRef = useRef<HTMLDivElement>(null);
  const { downloadPdf } = usePdfDownloader(notesRef, data.title);
  
  return (
    <>
      <div 
        className="bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white"
      >
        <div ref={notesRef} className="p-4 sm:p-8 md:p-12">
            <div className="max-w-4xl mx-auto animate-fade-in bg-stone-50 dark:bg-neutral-800 p-6 sm:p-10 rounded-lg shadow-xl">
            
            <header className="mb-10 text-left border-b-2 border-neutral-200 dark:border-neutral-700 pb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2 font-pt-serif-italic">{data.title}</h1>
                <p className="text-md text-neutral-600 dark:text-neutral-400 leading-relaxed">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>
            
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-12 italic">{data.summary}</p>

            <main className="space-y-12">
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Key Topics</h2>
                    <div className="space-y-8">
                    {data.keyTopics.map((topic, index) => (
                        <div key={index} className="p-6 bg-white/50 dark:bg-black/20 rounded-lg border border-neutral-200 dark:border-neutral-700/50">
                        <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">{topic.topicTitle}</h3>
                        <div className="space-y-4">
                            {topic.content.map((item, itemIndex) => {
                            if (item.type === 'bullet') {
                                return <p key={itemIndex} className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-neutral-400 dark:before:text-neutral-500">{item.point}</p>;
                            }
                            if (item.type === 'paragraph') {
                                return <p key={itemIndex} className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{item.text}</p>;
                            }
                             if (item.type === 'generated_image' && item.imageUrl && item.description) {
                                return <GeneratedImage key={itemIndex} src={item.imageUrl} alt={item.description} />;
                            }
                            if (item.type === 'image_idea' && item.description) {
                                return <ImagePlaceholder key={itemIndex} description={item.description} />;
                            }
                            return null;
                            })}
                        </div>
                        </div>
                    ))}
                    </div>
                </section>
                
                {data.chartsAndGraphs && data.chartsAndGraphs.length > 0 && (
                     <section>
                        <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Visuals & Charts</h2>
                        {data.chartsAndGraphs.map((chart, index) => (
                            <ChartRenderer key={index} chart={chart} />
                        ))}
                    </section>
                )}
                
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Practice Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.practiceQuestions.map((q, index) => (
                       <StickyNote key={index} question={q.question} index={index} />
                    ))}
                    </div>
                </section>
            </main>
            </div>
        </div>
      </div>
      <PdfDownloadButton onDownload={downloadPdf} disabled={!data} />
    </>
  );
};