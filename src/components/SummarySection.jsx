import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';

const SummarySection = React.memo(({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div
        className="bg-gray-800 rounded-lg shadow-md p-6 my-6"
        role="status"
        aria-live="polite"
      >
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!summary?.summary) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-6 my-6 text-gray-400 text-center">
        Enter your study notes above to generate a summary.
      </div>
    );
  }

  const processedDiagrams = useMemo(() => {
    if (!summary.diagrams) return [];
    return summary.diagrams.map((diagram) => {
      if (diagram.includes('```mermaid')) {
        const mermaidContent = diagram.replace(/```mermaid|```/g, '').trim();
        return { type: 'mermaid', content: mermaidContent };
      } else {
        return { type: 'code', content: diagram };
      }
    });
  }, [summary.diagrams]);

  const MarkdownComponents = useMemo(
    () => ({
      h1: (props) => <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-800" {...props} />,
      h2: (props) => <h2 className="text-xl font-bold mb-3 mt-5 text-indigo-600" {...props} />,
      h3: (props) => <h3 className="text-lg font-bold mb-2 mt-4 text-gray-700" {...props} />,
      ul: (props) => <ul className="list-disc pl-6 mb-4 text-gray-700" {...props} />,
      ol: (props) => <ol className="list-decimal pl-6 mb-4 text-gray-700" {...props} />,
      li: (props) => <li className="mb-1 text-gray-700" {...props} />,
      p: (props) => <p className="mb-4 text-gray-700" {...props} />,
      strong: (props) => <strong className="font-bold text-gray-900" {...props} />,
      code: (props) => (
        <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm text-gray-800" {...props} />
      ),
      pre: (props) => (
        <pre className="bg-gray-100 rounded p-4 overflow-x-auto mb-4 font-mono text-sm text-gray-800" {...props} />
      ),
      blockquote: (props) => (
        <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600" {...props} />
      ),
      em: (props) => <em className="italic text-gray-700" {...props} />,
      a: (props) => <a className="text-blue-600 underline hover:text-blue-700" {...props} />,
      table: (props) => <table className="min-w-full border border-gray-200 my-6 text-gray-700 rounded-lg overflow-hidden" {...props} />,
      th: (props) => <th className="border border-gray-200 px-4 py-3 bg-gray-50 text-gray-800 font-semibold" {...props} />,
      td: (props) => <td className="border border-gray-200 px-4 py-3 text-gray-700" {...props} />,
      img: (props) => (
        <div className="my-6">
          <img 
            className="rounded-lg shadow-md max-w-full h-auto hover:shadow-lg transition-shadow duration-300" 
            {...props} 
          />
        </div>
      ),
    }),
    []
  );

  const renderMarkdown = (content) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={MarkdownComponents}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8 my-8 text-gray-800 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      role="region"
      aria-labelledby="summary-section-title"
    >
      <div className="prose prose-lg max-w-none">
        {/* Main summary */}
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 id="summary-section-title" className="sr-only">
            Summary Section
          </h1>
          {renderMarkdown(summary.summary)}
        </div>

        {/* Key terms */}
        {summary.keyTerms && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-lg mb-6"
          >
            <h2 className="text-xl font-bold mb-4 text-indigo-600 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-indigo-600 rounded"></span>
              Key Terms
            </h2>
            {renderMarkdown(summary.keyTerms)}
          </motion.div>
        )}

        {/* Diagrams */}
        {processedDiagrams.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Diagrams</h2>
            {processedDiagrams.map((diagram, index) => (
              <div key={index} className="mb-6 text-gray-200">
                {diagram.type === 'mermaid' ? (
                  <div className="p-4 bg-gray-800 rounded">
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{diagram.content}</code>
                    </pre>
                  </div>
                ) : (
                  renderMarkdown(diagram.content)
                )}
              </div>
            ))}
          </>
        )}

        {/* Other sections */}
        {summary.conceptHierarchy && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Concept Hierarchy</h2>
            {renderMarkdown(summary.conceptHierarchy)}
          </>
        )}

        {/* Examples section */}
        {summary.examples && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Examples</h2>
            {renderMarkdown(summary.examples)}
          </>
        )}

        {/* Practice questions */}
        {summary.practiceQuestions && summary.practiceQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-lg mb-6 border border-purple-100"
          >
            <h2 className="text-xl font-bold mb-4 text-purple-600 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-purple-600 rounded"></span>
              Practice Questions
            </h2>
            <ol className="list-decimal pl-6 mb-4 space-y-4">
              {summary.practiceQuestions.map((question, index) => (
                <li key={index} className="mb-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                  {question}
                </li>
              ))}
            </ol>
          </motion.div>
        )}

        {/* Quick Reference */}
        {summary.quickReference && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-blue-600 rounded"></span>
              Quick Reference
            </h2>
            {renderMarkdown(summary.quickReference)}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default SummarySection;