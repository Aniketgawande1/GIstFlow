import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="py-6">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          AI Exam Notes Summarizer
        </span>
      </motion.h1>
      <motion.p 
        className="mt-2 text-center text-gray-900 dark:text-gray-300 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Transform your lengthy study materials into concise, exam-ready notes with AI
      </motion.p>
    </header>
  );
};

export default Header;