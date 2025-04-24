import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookOpenIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { summarizeText } from '../utils/openai';

const InputSection = ({ 
  studyNotes, 
  setStudyNotes, 
  summaryStyle, 
  setSummaryStyle, 
  setSummary, 
  setIsLoading 
}) => {
  const [fileUploading, setFileUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'text/plain') {
      toast.error('Please upload a text file (.txt)');
      return;
    }
    
    setFileUploading(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      setStudyNotes(event.target.result);
      setFileUploading(false);
      toast.success('Study notes uploaded successfully!');
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setFileUploading(false);
    };
    
    reader.readAsText(file);
  };

  const handleSummarize = async () => {
    if (!studyNotes.trim()) {
      toast.error('Please enter or upload your study notes first');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await summarizeText(studyNotes, summaryStyle);
      setSummary(result);
      toast.success('Summary generated!');
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <BookOpenIcon className="h-6 w-6 text-indigo-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Study Notes</h2>
        </div>
        
        <div className="relative">
          <textarea
            value={studyNotes}
            onChange={(e) => setStudyNotes(e.target.value)}
            placeholder="Paste your study notes here or upload a text file..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 resize-none"
          />
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <label className="flex items-center justify-center bg-gray-100 dark:bg-gray-600 
                             hover:bg-gray-200 dark:hover:bg-gray-500 p-2 rounded-full cursor-pointer
                             transition-colors duration-200">
              <ArrowUpTrayIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
                disabled={fileUploading}
              />
            </label>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Summary Style</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'concise', label: 'Quick Review' },
              { id: 'detailed', label: 'Comprehensive Study' },
              { id: 'key-concepts', label: 'Key Concepts Only' },
              { id: 'exam-focus', label: 'Exam-Focused' }
            ].map((style) => (
              <motion.button
                key={style.id}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                          ${summaryStyle === style.id 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                onClick={() => setSummaryStyle(style.id)}
              >
                {style.label}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                     text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          onClick={handleSummarize}
        >
          Generate Study Summary
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InputSection;