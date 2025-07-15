import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';

const SummarySection = React.memo(({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div
        className="animate-pulse text-white flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <span>Loading summary...</span>
      </div>
    );
  }

  if (!summary?.summary) {
    return null;
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
      h1: (props) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white" {...props} />,
      h2: (props) => <h2 className="text-xl font-bold mb-3 mt-5 text-indigo-300" {...props} />,
      h3: (props) => <h3 className="text-lg font-bold mb-2 mt-4 text-gray-200" {...props} />,
      ul: (props) => <ul className="list-disc pl-6 mb-4 text-gray-200" {...props} />,
      ol: (props) => <ol className="list-decimal pl-6 mb-4 text-gray-200" {...props} />,
      li: (props) => <li className="mb-1 text-gray-200" {...props} />,
      p: (props) => <p className="mb-4 text-gray-200" {...props} />,
      strong: (props) => <strong className="font-bold text-white" {...props} />,
      code: (props) => (
        <code className="bg-gray-800 rounded px-1 py-0.5 font-mono text-sm text-gray-200" {...props} />
      ),
      pre: (props) => (
        <pre className="bg-gray-800 rounded p-4 overflow-x-auto mb-4 font-mono text-sm text-gray-200" {...props} />
      ),
      blockquote: (props) => (
        <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300" {...props} />
      ),
      em: (props) => <em className="italic text-gray-200" {...props} />,
      a: (props) => <a className="text-blue-400 underline hover:text-blue-300" {...props} />,
      img: (props) => <img className="max-w-full h-auto my-4" {...props} />,
      table: (props) => <table className="min-w-full border border-gray-600 my-4 text-gray-200" {...props} />,
      th: (props) => <th className="border border-gray-600 px-4 py-2 bg-gray-800 text-gray-200" {...props} />,
      td: (props) => <td className="border border-gray-600 px-4 py-2 text-gray-200" {...props} />,
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
      className="bg-gray-800 rounded-lg shadow-md p-6 my-6 text-gray-200"
      role="region"
      aria-labelledby="summary-section-title"
    >
      <div className="prose prose-lg prose-invert max-w-none">
        {/* Main summary */}
        <h1 id="summary-section-title" className="sr-only">
          Summary Section
        </h1>
        {renderMarkdown(summary.summary)}

        {/* Key terms */}
        {summary.keyTerms && (
          <>
            <h2 className="text-xl font-bold mb-3 mt-6 text-indigo-300">Key Terms</h2>
            {renderMarkdown(summary.keyTerms)}
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
            {renderMarkdown(summary.quickReference)}
          </div>
        )}
      </div>
    </motion.div>
  );
});

// // export default SummarySection;
// import React, { useMemo } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CheckCircle, BookOpen, Target, AlertTriangle, Lightbulb, Clock } from 'lucide-react';

// const SummarySection = React.memo(({ summary, isLoading }) => {
//   // Enhanced loading state with skeleton
//   if (isLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl p-8 my-6"
//         role="status"
//         aria-live="polite"
//       >
//         <div className="animate-pulse space-y-6">
//           <div className="h-8 bg-gray-700 rounded-lg w-3/4"></div>
//           <div className="space-y-3">
//             <div className="h-4 bg-gray-700 rounded w-full"></div>
//             <div className="h-4 bg-gray-700 rounded w-5/6"></div>
//             <div className="h-4 bg-gray-700 rounded w-4/5"></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="h-32 bg-gray-700 rounded-lg"></div>
//             <div className="h-32 bg-gray-700 rounded-lg"></div>
//           </div>
//         </div>
//         <div className="flex items-center justify-center mt-6 text-blue-400">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-3"></div>
//           <span className="text-lg">Generating your study summary...</span>
//         </div>
//       </motion.div>
//     );
//   }

//   if (!summary?.summary) {
//     return null;
//   }

//   // Enhanced markdown components with better styling
//   const MarkdownComponents = useMemo(
//     () => ({
//       h1: (props) => (
//         <h1 className="text-3xl font-bold mb-6 mt-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" {...props} />
//       ),
//       h2: (props) => (
//         <h2 className="text-2xl font-semibold mb-4 mt-7 text-blue-300 flex items-center gap-2" {...props} />
//       ),
//       h3: (props) => (
//         <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-200 border-l-4 border-blue-500 pl-4" {...props} />
//       ),
//       ul: (props) => <ul className="list-none space-y-2 mb-6 text-gray-200" {...props} />,
//       ol: (props) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-200" {...props} />,
//       li: (props) => (
//         <li className="flex items-start gap-3 text-gray-200 leading-relaxed" {...props}>
//           <span className="text-blue-400 mt-1.5 text-sm">•</span>
//           <span>{props.children}</span>
//         </li>
//       ),
//       p: (props) => <p className="mb-5 text-gray-200 leading-relaxed text-lg" {...props} />,
//       strong: (props) => <strong className="font-bold text-white bg-blue-500/20 px-2 py-1 rounded" {...props} />,
//       code: (props) => (
//         <code className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 font-mono text-sm text-blue-300" {...props} />
//       ),
//       pre: (props) => (
//         <pre className="bg-gray-900 border border-gray-600 rounded-lg p-6 overflow-x-auto mb-6 font-mono text-sm text-gray-200 shadow-inner" {...props} />
//       ),
//       blockquote: (props) => (
//         <blockquote className="border-l-4 border-blue-500 bg-blue-500/10 pl-6 py-4 my-6 italic text-gray-300 rounded-r-lg" {...props} />
//       ),
//       em: (props) => <em className="italic text-blue-300" {...props} />,
//       a: (props) => <a className="text-blue-400 underline hover:text-blue-300 transition-colors" {...props} />,
//       table: (props) => (
//         <div className="overflow-x-auto mb-6">
//           <table className="w-full border-collapse border border-gray-600 rounded-lg overflow-hidden shadow-lg" {...props} />
//         </div>
//       ),
//       th: (props) => (
//         <th className="border border-gray-600 px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold text-left" {...props} />
//       ),
//       td: (props) => <td className="border border-gray-600 px-6 py-4 text-gray-200 bg-gray-800/50" {...props} />,
//     }),
//     []
//   );

//   const renderMarkdown = (content) => (
//     <ReactMarkdown
//       remarkPlugins={[remarkGfm]}
//       rehypePlugins={[rehypeRaw]}
//       components={MarkdownComponents}
//     >
//       {content}
//     </ReactMarkdown>
//   );

//   // Section component for consistent styling
//   const Section = ({ title, children, icon: Icon, delay = 0, className = "" }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay }}
//       className={`mb-8 ${className}`}
//     >
//       <div className="flex items-center gap-3 mb-4">
//         {Icon && <Icon className="text-blue-400 w-6 h-6" />}
//         <h2 className="text-2xl font-semibold text-blue-300">{title}</h2>
//       </div>
//       <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 backdrop-blur-sm">
//         {children}
//       </div>
//     </motion.div>
//   );

//   // Card component for grid layouts
//   const Card = ({ children, className = "" }) => (
//     <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
//       {children}
//     </div>
//   );

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 my-8 text-gray-200 border border-gray-700/50"
//         role="region"
//         aria-labelledby="summary-section-title"
//       >
//         <div className="max-w-none">
//           {/* Main Summary */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="mb-10"
//           >
//             <h1 id="summary-section-title" className="sr-only">
//               Study Summary
//             </h1>
//             <div className="prose prose-lg prose-invert max-w-none">
//               {renderMarkdown(summary.summary)}
//             </div>
//           </motion.div>

//           {/* Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Key Terms */}
//             {summary.keyTerms && (
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <Section title="Key Terms" icon={BookOpen}>
//                   {renderMarkdown(summary.keyTerms)}
//                 </Section>
//               </motion.div>
//             )}

//             {/* Learning Objectives */}
//             {summary.learningObjectives && (
//               <motion.div
//                 initial={{ opacity: 0, x: 30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//               >
//                 <Section title="Learning Objectives" icon={Target}>
//                   {renderMarkdown(summary.learningObjectives)}
//                 </Section>
//               </motion.div>
//             )}
//           </div>

//           {/* Full Width Sections */}
//           {summary.conceptHierarchy && (
//             <Section title="Concept Relationships" icon={Lightbulb} delay={0.4}>
//               {renderMarkdown(summary.conceptHierarchy)}
//             </Section>
//           )}

//           {summary.examples && (
//             <Section title="Examples & Applications" icon={CheckCircle} delay={0.5}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   {renderMarkdown(summary.examples)}
//                 </Card>
//               </div>
//             </Section>
//           )}

//           {/* Practice Questions */}
//           {summary.practiceQuestions && summary.practiceQuestions.length > 0 && (
//             <Section title="Practice Questions" icon={Target} delay={0.6}>
//               <div className="space-y-4">
//                 {summary.practiceQuestions.map((question, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
//                     className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4"
//                   >
//                     <div className="flex items-start gap-3">
//                       <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
//                         {index + 1}
//                       </span>
//                       <p className="text-gray-200 leading-relaxed">{question}</p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {/* Common Mistakes */}
//           {summary.commonMistakes && summary.commonMistakes.length > 0 && (
//             <Section title="Common Pitfalls" icon={AlertTriangle} delay={0.8}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {summary.commonMistakes.map((mistake, index) => (
//                   <Card key={index} className="border-l-4 border-red-500">
//                     <div className="flex items-start gap-3">
//                       <AlertTriangle className="text-red-400 w-5 h-5 mt-1 flex-shrink-0" />
//                       <p className="text-gray-200">{mistake}</p>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {/* Study Strategies */}
//           {summary.studyStrategies && (
//             <Section title="Study Strategies" icon={Lightbulb} delay={0.9}>
//               <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
//                 {renderMarkdown(summary.studyStrategies)}
//               </Card>
//             </Section>
//           )}

//           {/* Formula Sheet */}
//           {summary.formulaSheet && (
//             <Section title="Formula Sheet" icon={BookOpen} delay={1.0}>
//               <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
//                 {renderMarkdown(summary.formulaSheet)}
//               </div>
//             </Section>
//           )}

//           {/* Quick Reference - Highlighted Footer */}
//           {summary.quickReference && (
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 1.1 }}
//               className="mt-10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-xl p-8 border border-blue-500/30 shadow-2xl"
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <Clock className="text-blue-400 w-7 h-7" />
//                 <h2 className="text-2xl font-bold text-blue-300">Quick Reference</h2>
//               </div>
//               <div className="prose prose-lg prose-invert max-w-none">
//                 {renderMarkdown(summary.quickReference)}
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Footer */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 1.2 }}
//           className="mt-8 pt-6 border-t border-gray-700/50 text-center"
//         >
//           <p className="text-gray-400 text-sm">
//             💡 Generated with AI • Review and verify all content before use
//           </p>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// });

// SummarySection.displayName = 'SummarySection';

// export default SummarySection;