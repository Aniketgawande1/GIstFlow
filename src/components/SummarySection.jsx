import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { DocumentDuplicateIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const SummarySection = ({ summary, isLoading, activeTab, setActiveTab }) => {
  // Function to extract sections from the summary
  const getSections = () => {
    if (!summary) return { summary: '', keyTerms: '', examTips: '' };
    
    // Simple parsing logic - in a real app you would have more structured data from the API
    let mainSummary = summary.summary || '';
    let keyTerms = summary.keyTerms || '';
    let examTips = summary.examTips || '';
    
    return { summary: mainSummary, keyTerms, examTips };
  };
  
  const sections = getSections();
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy'));
  };
  
  const downloadSummary = () => {
    // Create a text blob with all sections
    const fullText = `
STUDY SUMMARY
--------------
${sections.summary}

KEY TERMS & CONCEPTS
-----------
${sections.keyTerms}

EXAM TIPS & FOCUS AREAS
-----------
${sections.examTips}
    `.trim();
    
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-study-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Study summary downloaded!');
  };
  
  return (
    <motion.div
      className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {['summary', 'keyTerms', 'examTips'].map((tab) => (
          <button
            key={tab}
            className={`py-4 px-6 font-medium text-sm focus:outline-none relative
                     ${activeTab === tab 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'summary' && 'Summary'}
            {tab === 'keyTerms' && 'Key Terms & Concepts'}
            {tab === 'examTips' && 'Exam Tips'}
            
            {/* Active tab indicator */}
            {activeTab === tab && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                layoutId="activeTab"
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[200px]"
            >
              {activeTab === 'summary' && (
                <div className="prose dark:prose-invert max-w-none">
                  {sections.summary}
                </div>
              )}
              
              {activeTab === 'keyTerms' && (
                <div className="prose dark:prose-invert max-w-none">
                  {sections.keyTerms}
                </div>
              )}
              
              {activeTab === 'examTips' && (
                <div className="prose dark:prose-invert max-w-none">
                  {sections.examTips}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* Action buttons */}
        {!isLoading && summary && (
          <div className="mt-6 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              onClick={() => copyToClipboard(sections[activeTab])}
            >
              <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
              Copy
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
              onClick={downloadSummary}
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Download
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SummarySection;