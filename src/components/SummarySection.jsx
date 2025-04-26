import React from 'react';
import { motion } from 'framer-motion';

const SummaryDisplay = ({ summary }) => {
  if (!summary) return null;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Study Summary</h2>
      
      {summary.summary && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Summary</h3>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {summary.summary}
          </div>
        </div>
      )}
      
      {summary.keyTerms && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Key Terms & Concepts</h3>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {summary.keyTerms}
          </div>
        </div>
      )}
      
      {summary.examTips && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Exam Tips</h3>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {summary.examTips}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SummaryDisplay;