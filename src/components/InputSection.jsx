import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookOpenIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { summarizeText } from '../utils/openai';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

const InputSection = ({ 
  studyNotes, 
  setStudyNotes, 
  summaryStyle, 
  setSummaryStyle, 
  setSummary, 
  setIsLoading 
}) => {
  const [fileUploading, setFileUploading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size should be less than 1MB');
      return;
    }

    if (file.type !== 'text/plain') {
      toast.error('Please upload a text file (.txt)');
      return;
    }

    setFileUploading(true);
    try {
      const text = await file.text();
      setStudyNotes(text);
      setCharCount(text.length);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Error reading file');
    } finally {
      setFileUploading(false);
    }
  };

  const handleSummarize = async () => {
    if (!studyNotes.trim()) {
      toast.error('Please enter or upload your study notes');
      return;
    }

    setIsProcessing(true);
    setIsLoading(true);
    const toastId = toast.loading('Analyzing your notes...');

    try {
      const result = await summarizeText(studyNotes, summaryStyle);
      setSummary(result);
      toast.success('Summary generated successfully', { id: toastId });
    } catch (error) {
      console.error('Summary generation failed:', error);
      toast.error(error.message || 'Failed to generate summary', { id: toastId });
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <BookOpenIcon className="h-6 w-6 text-indigo-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Study Notes
          </h2>
        </div>

        <div className="relative">
          <textarea
            value={studyNotes}
            onChange={(e) => {
              setStudyNotes(e.target.value);
              setCharCount(e.target.value.length);
            }}
            placeholder="Paste your study notes here or upload a text file..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 resize-none"
            disabled={isProcessing}
          />
          <div className="absolute bottom-4 left-4 text-sm text-gray-500 dark:text-gray-400">
            {charCount} characters
          </div>

          <div className="absolute bottom-4 right-4">
            <label className="flex items-center justify-center bg-gray-100 dark:bg-gray-600 
                           hover:bg-gray-200 dark:hover:bg-gray-500 p-2 rounded-full cursor-pointer
                           transition-colors duration-200">
              <ArrowUpTrayIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isProcessing || fileUploading}
              />
            </label>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            Summary Style
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'concise', label: 'Quick Review' },
              { id: 'detailed', label: 'Comprehensive' },
              { id: 'key-concepts', label: 'Key Concepts' },
              { id: 'exam-focus', label: 'Exam-Focused' }
            ].map((style) => (
              <motion.button
                key={style.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200
                          ${summaryStyle === style.id 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                onClick={() => setSummaryStyle(style.id)}
                disabled={isProcessing}
              >
                {style.label}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: isProcessing ? 1 : 1.03 }}
          whileTap={{ scale: isProcessing ? 1 : 0.97 }}
          disabled={isProcessing || !studyNotes.trim()}
          className={`mt-6 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 
            ${isProcessing || !studyNotes.trim() ? 'opacity-75 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'}
            text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
            flex items-center justify-center`}
          onClick={handleSummarize}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                   fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            'Generate Study Summary'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InputSection;