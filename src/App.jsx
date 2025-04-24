import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import InputSection from './components/InputSection';
import SummarySection from './components/SummarySection';
import Footer from './components/Footer';

function App() {
  const [studyNotes, setStudyNotes] = useState('');
  const [summaryStyle, setSummaryStyle] = useState('concise');
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          
          <main className="mt-8">
            <InputSection 
              studyNotes={studyNotes}
              setStudyNotes={setStudyNotes}
              summaryStyle={summaryStyle}
              setSummaryStyle={setSummaryStyle}
              setSummary={setSummary}
              setIsLoading={setIsLoading}
            />
            
            {(isLoading || summary) && (
              <SummarySection 
                summary={summary}
                isLoading={isLoading}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </main>
          
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}

export default App;