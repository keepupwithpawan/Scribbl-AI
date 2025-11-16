
import React from 'react';

const messages = [
  "Analyzing lecture content...",
  "Summarizing key topics...",
  "Crafting insightful questions...",
  "Designing beautiful layouts...",
  "Just a moment more...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                return messages[(currentIndex + 1) % messages.length];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
        <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute w-full h-full border-4 border-neutral-300 dark:border-neutral-700 rounded-full animate-ping opacity-60"></div>
            <div className="bg-black dark:bg-white w-8 h-8 rounded-full"></div>
        </div>
        <p className="mt-6 text-lg font-semibold text-black dark:text-white transition-opacity duration-500">{message}</p>
    </div>
  );
};
