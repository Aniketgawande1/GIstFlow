import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';
import MermaidDiagram from './MermaidDiagram';

const SummarySection = ({ summary, isLoading }) => {
  if (isLoading) {
    return <div className="animate-pulse text-white">Loading summary...</div>;
  }

  if (!summary?.summary) {
    return null;
  }

  // Process diagrams to separate mermaid from regular code blocks
  const processDiagrams = (diagrams) => {
    return diagrams.map(diagram => {
      if (diagram.includes('```mermaid')) {
        const mermaidContent = diagram.replace(/```mermaid|```/g, '').trim();
        return { type: 'mermaid', content: mermaidContent };
      } else {
        return { type: 'code', content: diagram };
      }
    });
  };

  const processedDiagrams = summary.diagrams ? processDiagrams(summary.diagrams) : [];

  // Custom components for markdown rendering with light text on dark background
  const MarkdownComponents = {
    h1: (props) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white" {...props} />,
    h2: (props) => <h2 className="text-xl font-bold mb-3 mt-5 text-indigo-300" {...props} />,
    h3: (props) => <h3 className="text-lg font-bold mb-2 mt-4 text-gray-200" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 mb-4 text-gray-200" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 mb-4 text-gray-200" {...props} />,
    li: (props) => <li className="mb-1 text-gray-200" {...props} />,
    p: (props) => <p className="mb-4 text-gray-200" {...props} />,
    strong: (props) => <strong className="font-bold text-white" {...props} />,
    code: (props) => <code className="bg-gray-800 rounded px-1 py-0.5 font-mono text-sm text-gray-200" {...props} />,
    pre: (props) => <pre className="bg-gray-800 rounded p-4 overflow-x-auto mb-4 font-mono text-sm text-gray-200" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300" {...props} />,
    em: (props) => <em className="italic text-gray-200" {...props} />,
    a: (props) => <a className="text-blue-400 underline hover:text-blue-300" {...props} />,
    img: (props) => <img className="max-w-full h-auto my-4" {...props} />,
    table: (props) => <table className="min-w-full border border-gray-600 my-4 text-gray-200" {...props} />,
    th: (props) => <th className="border border-gray-600 px-4 py-2 bg-gray-800 text-gray-200" {...props} />,
    td: (props) => <td className="border border-gray-600 px-4 py-2 text-gray-200" {...props} />
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg shadow-md p-6 my-6 text-gray-200"
    >
      <div className="prose prose-lg prose-invert max-w-none">
        {/* Main summary */}
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
          components={MarkdownComponents}
        >
          {summary.summary}
        </ReactMarkdown>
        
        {/* Key terms */}
        {summary.keyTerms && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Key Terms</h2>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={MarkdownComponents}
            >
              {summary.keyTerms}
            </ReactMarkdown>
          </>
        )}
        
        {/* Diagrams */}
        {processedDiagrams.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Diagrams</h2>
            {processedDiagrams.map((diagram, index) => (
              <div key={index} className="mb-6 text-gray-200">
                {diagram.type === 'mermaid' ? (
                  <div className="p-4 bg-gray-800 rounded">
                    <MermaidDiagram chart={diagram.content} />
                  </div>
                ) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                    components={MarkdownComponents}
                  >
                    {diagram.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </>
        )}
        
        {/* Other sections */}
        {summary.conceptHierarchy && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Concept Hierarchy</h2>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={MarkdownComponents}
            >
              {summary.conceptHierarchy}
            </ReactMarkdown>
          </>
        )}

        {/* Examples section */}
        {summary.examples && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Examples</h2>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={MarkdownComponents}
            >
              {summary.examples}
            </ReactMarkdown>
          </>
        )}

        {/* Practice questions */}
        {summary.practiceQuestions && summary.practiceQuestions.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Practice Questions</h2>
            <ol className="list-decimal pl-6 mb-4 text-gray-200">
              {summary.practiceQuestions.map((question, index) => (
                <li key={index} className="mb-2 text-gray-200">
                  {question}
                </li>
              ))}
            </ol>
          </>
        )}

        {/* Quick Reference */}
        {summary.quickReference && (
          <div className="mt-6 bg-gray-800/50 rounded-lg p-5 border border-gray-700">
            <h2 className="text-xl font-bold mb-3 text-indigo-300">Quick Reference</h2>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={MarkdownComponents}
            >
              {summary.quickReference}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SummarySection;