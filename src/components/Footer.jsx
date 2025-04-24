import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>© {new Date().getFullYear()} AI Exam Notes Summarizer</p>
      <p className="mt-1">Built with React, TailwindCSS, Framer Motion, and OpenAI</p>
    </footer>
  );
};

export default Footer;