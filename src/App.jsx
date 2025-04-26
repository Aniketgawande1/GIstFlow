import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import InputSection from "./components/InputSection";
import SummarySection from "./components/SummarySection";

function App() {
  const [studyNotes, setStudyNotes] = useState('');
  const [summaryStyle, setSummaryStyle] = useState('concise');
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto"> {/* Increased max width */}
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          GistFlow Study Notes Summarizer
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          Transform your lengthy study materials into concise, organized summaries. Upload your notes or paste them below to get started.
        </p>
        
        <InputSection
          studyNotes={studyNotes}
          setStudyNotes={setStudyNotes}
          summaryStyle={summaryStyle}
          setSummaryStyle={setSummaryStyle}
          setSummary={setSummary}
          setIsLoading={setIsLoading}
        />
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 text-lg">Generating your summary...</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              This may take a few seconds depending on the length of your notes
            </p>
          </div>
        )}
        
        {!isLoading && summary && <SummarySection summary={summary} />}
        
        {/* Add a footer */}
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by Google's Gemini API</p>
          <p className="mt-2">© 2025 GistFlow - All rights reserved</p>
        </footer>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;