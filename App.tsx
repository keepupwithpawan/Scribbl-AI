import React, { useState, useEffect, useCallback } from 'react';
import type { Theme, NoteType, DigitalNotesData, PhysicalNotesData, DigitalNoteContent } from './types';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { NoteTypeSelector } from './components/NoteTypeSelector';
import { DigitalNotesView } from './components/DigitalNotesView';
import { PhysicalNotesView } from './components/PhysicalNotesView';
import { Loader } from './components/Loader';
import {
  getYoutubeTranscriptMock,
  generateDigitalNotes,
  generatePhysicalNotesLayout,
  generateImageFromPrompt,
} from './services/geminiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [url, setUrl] = useState<string>('https://www.youtube.com/watch?v=mock_dbms_lecture');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'select' | 'view'>('input');
  
  const [digitalNotes, setDigitalNotes] = useState<DigitalNotesData | null>(null);
  const [physicalNotes, setPhysicalNotes] = useState<PhysicalNotesData | null>(null);
  const [activeNoteType, setActiveNoteType] = useState<NoteType>(null);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleInitialGenerate = () => {
    // Basic URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(url) && !url.includes('mock_dbms_lecture')) { // Allow mock URL
        setError('Please enter a valid YouTube URL.');
        return;
    }
    setError(null);
    setStep('select');
  };

  const enrichNotesWithImages = async (notes: DigitalNotesData): Promise<DigitalNotesData> => {
      const enrichedTopics = await Promise.all(
          notes.keyTopics.map(async (topic) => {
              const enrichedContent = await Promise.all(
                  topic.content.map(async (item) => {
                      if (item.type === 'image_idea' && item.description) {
                          try {
                              console.log(`Generating image for: ${item.description}`);
                              const imageUrl = await generateImageFromPrompt(item.description);
                              // FIX: Explicitly cast the returned object to DigitalNoteContent to fix type inference issue.
                              return { ...item, type: 'generated_image', imageUrl } as DigitalNoteContent;
                          } catch (e) {
                              console.error("Image generation failed for:", item.description, e);
                              // Fallback to placeholder if generation fails
                              return item; 
                          }
                      }
                      return item;
                  })
              );
              return { ...topic, content: enrichedContent };
          })
      );
      return { ...notes, keyTopics: enrichedTopics };
  };

  const handleNoteTypeSelect = useCallback(async (type: NoteType) => {
    if (!type) return;

    setIsLoading(true);
    setError(null);
    setActiveNoteType(type);

    try {
        const transcript = await getYoutubeTranscriptMock(url);

        if (type === 'digital') {
            const initialNotes = await generateDigitalNotes(transcript);
            // Now, generate images for the image_idea placeholders
            const finalNotes = await enrichNotesWithImages(initialNotes);
            setDigitalNotes(finalNotes);
        } else if (type === 'physical') {
            const notes = await generatePhysicalNotesLayout(transcript);
            setPhysicalNotes(notes);
        }
        setStep('view');

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setStep('input'); // Reset to input on error
    } finally {
        setIsLoading(false);
    }
  }, [url]);
  
  const resetApp = () => {
      setUrl('https://www.youtube.com/watch?v=mock_dbms_lecture');
      setDigitalNotes(null);
      setPhysicalNotes(null);
      setActiveNoteType(null);
      setError(null);
      setStep('input');
  };

  const renderContent = () => {
      if(step === 'view') {
          return (
            <div className="animate-fade-in">
              <button onClick={resetApp} className="mb-6 text-sm text-neutral-600 dark:text-neutral-400 hover:underline px-4 sm:px-0">
                &larr; Generate new notes
              </button>
              {activeNoteType === 'digital' && digitalNotes && <DigitalNotesView data={digitalNotes} />}
              {activeNoteType === 'physical' && physicalNotes && <PhysicalNotesView data={physicalNotes} />}
            </div>
          );
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
            <h2 className="text-4xl md:text-6xl text-black dark:text-white mb-4 animate-fade-in font-pt-serif-italic">Generate Notes from any Lecture</h2>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '100ms', opacity: 0 }}>
                Paste a YouTube video link to instantly create comprehensive digital notes or a handy physical note-taking layout.
                <br />
                <small>(Note: This demo uses a mock transcript for a DBMS lecture to showcase functionality.)</small>
            </p>
            <UrlInputForm url={url} setUrl={setUrl} handleGenerate={handleInitialGenerate} isLoading={false} />
            {error && <p className="mt-4 text-red-500 dark:text-red-400 animate-fade-in">{error}</p>}
            {step === 'select' && <NoteTypeSelector onSelect={handleNoteTypeSelect} isLoading={isLoading} />}
        </div>
      );
  };


  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>

      {isLoading && <Loader />}
      
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;