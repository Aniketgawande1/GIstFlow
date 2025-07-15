// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize the AI client
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// // Helper function to create cleaner diagram templates
// const createBlockDiagram = (topic, nodeColor = '#f96', subColor = '#69f', detailColor = '#ccf') => {
//   return `\`\`\`mermaid
// graph LR
//   A[${topic}] --> B[Key Aspect 1]
//   A --> C[Key Aspect 2]
//   B --> D[Detail 1]
//   C --> E[Detail 2]
  
//   style A fill:${nodeColor},stroke:#333,stroke-width:2px
//   style B fill:${subColor},stroke:#333,stroke-width:2px
//   style C fill:${subColor},stroke:#333,stroke-width:2px
//   style D fill:${detailColor},stroke:#333,stroke-width:2px
//   style E fill:${detailColor},stroke:#333,stroke-width:2px
// \`\`\``
// };

// // Enhanced style configurations with structured formats and clear diagrams
// const styleConfigs = {
//   concise: {
//     systemMessage: "Create a well-structured, concise study summary with key points and clear diagrams.",
//     prompt: `Summarize these study notes in clean markdown format with this structure:

// # {Topic Name}

// ## Summary
// - List 3-5 key takeaways as clear, concise bullet points
// - Make each point complete but brief
// - Focus on core concepts only

// ## Key Terms
// - **Term 1:** Clear, concise definition
// - **Term 2:** Clear, concise definition

// ## Visual Overview
// ${createBlockDiagram('{Topic Name}')}

// ## Quick Reference
// - **Formula/Principle 1:** Explanation with proper notation
// - **Formula/Principle 2:** Explanation with proper notation

// Study notes to summarize:
// {studyNotes}`
//   },
//   detailed: {
//     systemMessage: "Create a comprehensive study guide with clear explanations, examples, and visual diagrams.",
//     prompt: `Create a detailed study guide with this structure:

// # {Topic Name} - Comprehensive Guide

// ## Core Concepts
// 1. **First concept**
//    - Clear explanation with proper terminology
//    - Why it matters in this field

// 2. **Second concept**
//    - Clear explanation with proper terminology
//    - Why it matters in this field

// ## Conceptual Diagram
// \`\`\`mermaid
// flowchart LR
//   A[Concept 1] --> B[Concept 2]
//   B --> C[Concept 3]
//   A --> D[Related idea]
//   style A fill:#f9f,stroke:#333,stroke-width:2px
//   style B fill:#9cf,stroke:#333,stroke-width:2px
// \`\`\`

// ## Examples & Applications
// ### Example 1: {Specific Example}
// - How this works in practice
// - What principles are being applied

// ### Example 2: {Specific Example}
// - How this works in practice
// - What principles are being applied

// ## Common Mistakes & Misconceptions
// - **Misconception 1:** Explanation and correction
// - **Misconception 2:** Explanation and correction

// ## Study Questions
// 1. Question that tests understanding of concept 1
// 2. Question that tests understanding of concept 2

// Study material:
// {studyNotes}`
//   },
//   'key-concepts': {
//     systemMessage: "Extract and explain main concepts with clear visual hierarchy and relationships.",
//     prompt: `Extract and organize key concepts with this structure:

// # {Topic} - Key Concepts Map

// ## Primary Concepts
// 1. **{Main Concept 1}**
//    - Clear definition with proper terminology
//    - Importance in this field
//    - Related subconcepts
   
// 2. **{Main Concept 2}**
//    - Clear definition with proper terminology
//    - Importance in this field
//    - Related subconcepts

// ## Concept Hierarchy
// \`\`\`mermaid
// mindmap
//   root((Central Topic))
//     {Concept 1}
//       Sub-concept A
//       Sub-concept B
//     {Concept 2}
//       Sub-concept C
//       Sub-concept D
// \`\`\`

// ## Concept Relationships
// {Clear explanation of how these concepts interconnect and build upon each other}

// Source material:
// {studyNotes}`
//   },
//   'exam-focus': {
//     systemMessage: "Create an exam-focused study guide with high-priority topics, diagrams, and practice questions.",
//     prompt: `Create an exam preparation guide with this structure:

// # {Topic} - Exam Preparation Guide

// ## High-Priority Topics
// 1. **{Topic 1}**
//    - Key points essential for the exam
//    - How this may be tested
// 2. **{Topic 2}**
//    - Key points essential for the exam
//    - How this may be tested

// ## Concept Map
// \`\`\`mermaid
// graph TD
//   A[Main Topic] --> B[Key Subtopic]
//   A --> C[Key Subtopic]
//   B --> D[Important Detail]
//   C --> E[Important Detail]
//   style A fill:#f96,stroke:#333,stroke-width:2px
//   style B fill:#69f,stroke:#333,stroke-width:2px
// \`\`\`

// ## Formula Sheet
// | Formula | When to Use | Example |
// |---------|-------------|---------|
// | {Formula 1} | {Context for usage} | {Simple example} |
// | {Formula 2} | {Context for usage} | {Simple example} |

// ## Practice Questions
// 1. {Specific exam-style question}
// 2. {Specific exam-style question}
// 3. {Specific exam-style question}

// ## Quick Tips
// - {Strategy for answering questions on this topic}
// - {Common pitfalls to avoid}
// - {Memory aid or trick}

// Source material:
// {studyNotes}`
//   }
// };

// // Main function to summarize text
// export const summarizeText = async (studyNotes, style = 'concise') => {
//   try {
//     if (!studyNotes?.trim()) {
//       throw new Error('Study notes cannot be empty');
//     }

//     // Initialize the model
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-2.5-flash-preview-04-17" 
//     });

//     // Extract a potential topic name from the first few lines
//     const topicRegex = /^#*\s*([A-Za-z\s]+?)(?:\n|$|\.|:)/;
//     const topicMatch = studyNotes.match(topicRegex);
//     const topicName = topicMatch ? topicMatch[1].trim() : "Study Topic";

//     // Prepare the prompt with topic name inserted
//     const configStyle = styleConfigs[style] || styleConfigs['concise'];
//     let prompt = configStyle.prompt.replace('{studyNotes}', studyNotes);
//     prompt = prompt.replace('{Topic Name}', topicName)
//                   .replace('{Topic}', topicName);

//     // Generate content with optimized parameters
//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: `${configStyle.systemMessage}\n\n${prompt}` }]
//         }
//       ],
//       generationConfig: {
//         temperature: 0.7,
//         maxOutputTokens: 2048,
//         topP: 0.95,
//         topK: 40,
//       }
//     });

//     const candidate = result.response?.candidates?.[0];
//     const text = candidate?.content?.parts?.[0]?.text;

//     if (!text) {
//       throw new Error('Failed to generate summary');
//     }

//     return parseEnhancedResponse(text, style);

//   } catch (error) {
//     console.error('Summarization error:', error);
//     throw new Error(error.message || 'Failed to generate summary');
//   }
// };

// // Enhanced parser that handles structured markdown and diagrams
// const parseEnhancedResponse = (content, style) => {
//   // Default response structure with all possible sections
//   const sections = {
//     summary: '',
//     keyTerms: '',
//     diagrams: [],
//     examples: '',
//     practiceQuestions: [],
//     quickReference: '',
//     conceptHierarchy: '',
//     commonMistakes: [],
//     formulaSheet: ''
//   };

//   try {
//     // Extract the main summary section (everything up to the first ##)
//     const summaryMatch = content.match(/^(.*?)(?=##|$)/s);
//     if (summaryMatch && summaryMatch[1]) {
//       sections.summary = summaryMatch[1].trim();
//     } else {
//       sections.summary = content; // Fallback if no sections found
//     }

//     // Extract key terms
//     const keyTermsMatch = content.match(/## Key Terms(.*?)(?=##|$)/s);
//     if (keyTermsMatch && keyTermsMatch[1]) {
//       sections.keyTerms = keyTermsMatch[1].trim();
//     }

//     // Extract diagrams (supports mermaid and ASCII)
//     const extractDiagrams = (content) => {
//       const diagrams = [];
      
//       // Extract mermaid diagrams from code blocks
//       const mermaidRegex = /```(?:mermaid)?\s*(graph[\s\S]*?|flowchart[\s\S]*?)```/gs;
//       let mermaidMatch;
      
//       while ((mermaidMatch = mermaidRegex.exec(content)) !== null) {
//         if (mermaidMatch[1] && mermaidMatch[1].trim()) {
//           diagrams.push(`${mermaidMatch[1].trim()}`);
//         }
//       }
      
//       // If no diagrams found but "Visual Overview" or "Conceptual Diagram" section exists
//       if (diagrams.length === 0) {
//         const visualSectionRegex = /## (?:Visual Overview|Conceptual Diagram|Concept Map)([\s\S]*?)(?=##|$)/gs;
//         let visualMatch;
        
//         while ((visualMatch = visualSectionRegex.exec(content)) !== null) {
//           if (visualMatch[1] && visualMatch[1].trim()) {
//             // Look for diagram code without markdown code blocks
//             const diagramCode = visualMatch[1].trim();
            
//             // If it looks like a diagram syntax (contains graph or node definitions)
//             if (diagramCode.includes('-->') || diagramCode.includes('graph ')) {
//               diagrams.push(diagramCode);
//             }
//           }
//         }
//       }
      
//       return diagrams;
//     };

//     sections.diagrams = extractDiagrams(content);

//     // Extract concept hierarchy
//     const hierarchyMatch = content.match(/## Concept (Hierarchy|Map)(.*?)(?=##|$)/s);
//     if (hierarchyMatch && hierarchyMatch[2]) {
//       sections.conceptHierarchy = hierarchyMatch[2].trim();
//     }

//     // Extract practice questions
//     const questionsMatch = content.match(/## (Study Questions|Practice Questions)(.*?)(?=##|$)/s);
//     if (questionsMatch && questionsMatch[2]) {
//       sections.practiceQuestions = questionsMatch[2].trim()
//         .split('\n')
//         .filter(line => /^\d+\./.test(line))
//         .map(line => line.replace(/^\d+\.\s*/, '').trim());
//     }

//     // Extract examples
//     const examplesMatch = content.match(/## Examples(.*?)(?=##|$)/s);
//     if (examplesMatch && examplesMatch[1]) {
//       sections.examples = examplesMatch[1].trim();
//     }

//     // Extract quick reference
//     const quickRefMatch = content.match(/## Quick Reference(.*?)(?=##|$)/s);
//     if (quickRefMatch && quickRefMatch[1]) {
//       sections.quickReference = quickRefMatch[1].trim();
//     }

//     // Add formula sheet for exam-focus
//     const formulaMatch = content.match(/## Formula Sheet(.*?)(?=##|$)/s);
//     if (formulaMatch && formulaMatch[1]) {
//       sections.formulaSheet = formulaMatch[1].trim();
//     }

//     // Add common mistakes
//     const mistakesMatch = content.match(/## Common Mistakes(.*?)(?=##|$)/s);
//     if (mistakesMatch && mistakesMatch[1]) {
//       sections.commonMistakes = mistakesMatch[1].trim()
//         .split('\n')
//         .filter(line => line.trim().length > 0 && line.startsWith('-'))
//         .map(line => line.replace(/^-\s*/, '').trim());
//     }

//     // Safety checks - ensure proper types for all values
//     // Handle string fields
//     const stringFields = ['summary', 'keyTerms', 'examples', 'conceptHierarchy', 'quickReference', 'formulaSheet'];
//     stringFields.forEach(field => {
//       if (sections[field] === null || sections[field] === undefined) {
//         sections[field] = '';
//       } else if (typeof sections[field] !== 'string') {
//         sections[field] = String(sections[field]);
//       }
//     });

//     // Handle array fields
//     const arrayFields = ['diagrams', 'practiceQuestions', 'commonMistakes'];
//     arrayFields.forEach(field => {
//       if (!Array.isArray(sections[field])) {
//         sections[field] = [];
//       }
//     });

//     // As a final check, ensure full content is available somewhere
//     if (!sections.summary && !sections.keyTerms) {
//       sections.summary = content;
//     }

//   } catch (error) {
//     console.error('Error parsing enhanced response:', error);
//     // In case of parsing error, return a safe fallback
//     return { summary: content || '', keyTerms: '', diagrams: [] };
//   }

//   return sections;
// };
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the AI client with error handling
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Enhanced system prompts that work better with Gemini's capabilities
const SYSTEM_PROMPTS = {
  concise: `You are an expert study assistant. Create concise, well-organized study summaries that help students quickly grasp key concepts. Focus on clarity, structure, and visual learning aids.`,
  
  detailed: `You are a comprehensive educational content creator. Develop thorough study guides that explain concepts deeply, provide examples, and help students understand both the "what" and "why" of topics.`,
  
  'key-concepts': `You are a knowledge mapping specialist. Extract and organize the most important concepts, showing clear relationships and hierarchies that help students understand how ideas connect.`,
  
  'exam-focus': `You are an exam preparation expert. Create focused study materials that emphasize testable content, common question types, and strategic study approaches for optimal exam performance.`
};

// Improved diagram templates with better Mermaid syntax
const createDiagramTemplate = (type, topic, colors = {}) => {
  const defaultColors = {
    primary: '#e1f5fe',
    secondary: '#f3e5f5', 
    accent: '#e8f5e8',
    border: '#1976d2'
  };
  
  const c = { ...defaultColors, ...colors };
  
  const templates = {
    concept: `graph TD
    A["${topic}"] --> B[Core Concept 1]
    A --> C[Core Concept 2] 
    A --> D[Core Concept 3]
    B --> E[Detail/Example]
    C --> F[Detail/Example]
    D --> G[Detail/Example]
    
    classDef primaryNode fill:${c.primary},stroke:${c.border},stroke-width:3px
    classDef secondaryNode fill:${c.secondary},stroke:${c.border},stroke-width:2px
    classDef detailNode fill:${c.accent},stroke:${c.border},stroke-width:1px
    
    class A primaryNode
    class B,C,D secondaryNode
    class E,F,G detailNode`,
    
    process: `flowchart LR
    Start([Start: ${topic}]) --> Step1[Step 1]
    Step1 --> Step2[Step 2]
    Step2 --> Step3[Step 3]
    Step3 --> End([Result/Outcome])
    
    classDef startEnd fill:${c.primary},stroke:${c.border},stroke-width:2px
    classDef process fill:${c.secondary},stroke:${c.border},stroke-width:2px
    
    class Start,End startEnd
    class Step1,Step2,Step3 process`,
    
    hierarchy: `graph TB
    Main["${topic}"]
    Main --> Branch1[Major Category 1]
    Main --> Branch2[Major Category 2]
    Branch1 --> Sub1[Subcategory A]
    Branch1 --> Sub2[Subcategory B]
    Branch2 --> Sub3[Subcategory C]
    Branch2 --> Sub4[Subcategory D]
    
    classDef level1 fill:${c.primary},stroke:${c.border},stroke-width:3px
    classDef level2 fill:${c.secondary},stroke:${c.border},stroke-width:2px
    classDef level3 fill:${c.accent},stroke:${c.border},stroke-width:1px
    
    class Main level1
    class Branch1,Branch2 level2
    class Sub1,Sub2,Sub3,Sub4 level3`
  };
  
  return templates[type] || templates.concept;
};

// Enhanced style configurations with better prompts
const styleConfigs = {
  concise: {
    systemPrompt: SYSTEM_PROMPTS.concise,
    userPrompt: `Please create a concise study summary with the following structure:

# TOPIC TITLE

## 📝 Key Takeaways
• 3-5 most important points
• Each point should be clear and actionable
• Focus on what students need to remember

## 📚 Essential Terms
**Term 1:** Brief, clear definition
**Term 2:** Brief, clear definition
(Include 3-5 most important terms)

## 🎯 Quick Facts
• Important formulas, dates, or principles
• Memory aids or mnemonics
• Key relationships between concepts

## 📊 Visual Overview
\`\`\`mermaid
${createDiagramTemplate('concept', 'TOPIC')}
\`\`\`

Please analyze these study notes and create the summary:

---
{studyNotes}
---

Remember to:
- Replace "TOPIC" with the actual subject
- Customize the diagram to match the content
- Keep explanations concise but complete
- Use clear, student-friendly language`
  },

  detailed: {
    systemPrompt: SYSTEM_PROMPTS.detailed,
    userPrompt: `Create a comprehensive study guide with this structure:

# TOPIC - Complete Study Guide

## 🎯 Learning Objectives
By the end of this guide, you should be able to:
1. [Specific objective 1]
2. [Specific objective 2]
3. [Specific objective 3]

## 📖 Core Concepts

### Concept 1: [Name]
**Definition:** Clear explanation of what this is
**Why it matters:** Practical importance and applications
**Key characteristics:** 
- Important feature 1
- Important feature 2

### Concept 2: [Name]
**Definition:** Clear explanation of what this is
**Why it matters:** Practical importance and applications
**Key characteristics:**
- Important feature 1  
- Important feature 2

## 🔗 Concept Relationships
\`\`\`mermaid
${createDiagramTemplate('hierarchy', 'MAIN TOPIC')}
\`\`\`

## 💡 Real-World Examples

### Example 1: [Scenario Name]
**Situation:** Brief description
**Application:** How the concept applies
**Outcome:** What this demonstrates

### Example 2: [Scenario Name]
**Situation:** Brief description
**Application:** How the concept applies
**Outcome:** What this demonstrates

## ⚠️ Common Pitfalls
1. **Misconception:** [Common mistake]
   **Reality:** [Correct understanding]
   
2. **Misconception:** [Common mistake]
   **Reality:** [Correct understanding]

## 🧠 Study Strategies
- [Specific study tip for this topic]
- [Memory technique or approach]
- [Practice recommendation]

Study material to analyze:

---
{studyNotes}
---

Please customize all bracketed placeholders with actual content from the study notes.`
  },

  'key-concepts': {
    systemPrompt: SYSTEM_PROMPTS['key-concepts'],
    userPrompt: `Extract and organize the key concepts using this format:

# TOPIC - Concept Map

## 🏗️ Foundational Concepts
These are the building blocks you need to understand first:

1. **[Primary Concept 1]**
   - **Definition:** [Clear explanation]
   - **Foundation for:** [What builds on this]
   - **Prerequisites:** [What you need to know first]

2. **[Primary Concept 2]**
   - **Definition:** [Clear explanation]  
   - **Foundation for:** [What builds on this]
   - **Prerequisites:** [What you need to know first]

## 🌐 Concept Network
\`\`\`mermaid
mindmap
  root((CENTRAL TOPIC))
    (Major Theme 1)
      Sub-concept A
      Sub-concept B
      Sub-concept C
    (Major Theme 2)
      Sub-concept D
      Sub-concept E
      Sub-concept F
    (Major Theme 3)
      Sub-concept G
      Sub-concept H
\`\`\`

## 🔗 How Concepts Connect
[Explain the relationships between major concepts - which ones depend on others, which ones work together, etc.]

## 📈 Learning Sequence
Recommended order for mastering these concepts:
1. Start with: [Foundational concept]
2. Then learn: [Next concept]
3. Build up to: [Advanced concept]
4. Finally: [Complex applications]

Source material:

---
{studyNotes}
---

Focus on extracting the most important 4-6 concepts and their relationships.`
  },

  'exam-focus': {
    systemPrompt: SYSTEM_PROMPTS['exam-focus'],
    userPrompt: `Create an exam-focused study guide:

# TOPIC - Exam Preparation Guide

## 🎯 High-Priority Topics
Based on typical exam patterns, focus on these areas:

### Priority 1: [Critical Topic]
- **What to know:** [Key facts/concepts]
- **How it's tested:** [Common question types]
- **Study tip:** [Specific advice]

### Priority 2: [Important Topic]  
- **What to know:** [Key facts/concepts]
- **How it's tested:** [Common question types]
- **Study tip:** [Specific advice]

## 📊 Topic Overview
\`\`\`mermaid
${createDiagramTemplate('process', 'EXAM TOPICS')}
\`\`\`

## 📋 Formula/Fact Sheet
| What | When to Use | Example/Notes |
|------|-------------|---------------|
| [Formula 1] | [Context] | [Quick example] |
| [Formula 2] | [Context] | [Quick example] |
| [Key Fact 1] | [Context] | [Memory aid] |

## 🤔 Practice Questions

### Question Type 1: [Type Name]
**Sample Question:** [Realistic exam question]
**Approach:** [How to solve]
**Common mistakes:** [What to avoid]

### Question Type 2: [Type Name]
**Sample Question:** [Realistic exam question]  
**Approach:** [How to solve]
**Common mistakes:** [What to avoid]

## ⚡ Last-Minute Review
**Key formulas to memorize:**
- [Formula 1]
- [Formula 2]

**Critical facts:**
- [Fact 1]
- [Fact 2]

**Red flags to watch for:**
- [Common trap 1]
- [Common trap 2]

## 📅 Study Timeline
- **1 week before:** [Study plan]
- **3 days before:** [Focus areas]
- **Day before:** [Final review strategy]

Study material:

---
{studyNotes}
---

Tailor this to the specific subject and typical exam format.`
  }
};

// Enhanced topic extraction with better regex patterns
const extractTopicName = (studyNotes) => {
  // Try multiple patterns to find the topic
  const patterns = [
    /^#\s+([^\n]+)/,           // Markdown header
    /^\*\*([^\*]+)\*\*/,       // Bold text at start
    /^([A-Z][A-Za-z\s]+?)(?:\n|:|\.)/,  // Capitalized phrase
    /Topic:\s*([^\n]+)/i,      // "Topic: ..." format
    /Subject:\s*([^\n]+)/i,    // "Subject: ..." format
    /Chapter\s+\d+[:\-\s]*([^\n]+)/i    // "Chapter X: ..." format
  ];
  
  for (const pattern of patterns) {
    const match = studyNotes.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Fallback: use first meaningful line
  const lines = studyNotes.split('\n').filter(line => line.trim().length > 5);
  if (lines.length > 0) {
    return lines[0].trim().substring(0, 50);
  }
  
  return "Study Topic";
};

// Main summarization function with improved error handling
export const summarizeText = async (studyNotes, style = 'concise') => {
  try {
    // Validate inputs
    if (!studyNotes?.trim()) {
      throw new Error('Study notes cannot be empty. Please provide some content to summarize.');
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.');
    }

    // Initialize the model with optimal settings
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",  // Using the latest available model
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,    // Increased for more detailed responses
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    });

    // Extract topic name
    const topicName = extractTopicName(studyNotes);
    
    // Get the appropriate style configuration
    const config = styleConfigs[style] || styleConfigs.concise;
    
    // Prepare the prompt
    let prompt = config.userPrompt.replace('{studyNotes}', studyNotes);
    prompt = prompt.replaceAll('TOPIC', topicName);
    prompt = prompt.replaceAll('[TOPIC]', topicName);

    // Create the chat session for better context handling
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: config.systemPrompt }],
        },
        {
          role: "model", 
          parts: [{ text: "I understand. I'll help you create high-quality study materials. Please provide the study notes you'd like me to summarize." }],
        },
      ],
    });

    // Send the main request
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    
    // Handle potential safety blocks
    if (response.promptFeedback?.blockReason) {
      throw new Error(`Content was blocked: ${response.promptFeedback.blockReason}`);
    }

    // Get the text response
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Received empty response from Gemini. Please try again.');
    }

    // Parse and return the structured response
    return parseEnhancedResponse(text, style);

  } catch (error) {
    console.error('Summarization error:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid API key. Please check your Gemini API key configuration.');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw new Error(error.message || 'Failed to generate summary. Please try again.');
  }
};

// Enhanced response parser with better section detection
const parseEnhancedResponse = (content, style) => {
  const sections = {
    summary: '',
    keyTerms: '',
    diagrams: [],
    examples: '',
    practiceQuestions: [],
    quickReference: '',
    conceptHierarchy: '',
    commonMistakes: [],
    formulaSheet: '',
    learningObjectives: '',
    studyStrategies: ''
  };

  try {
    // Clean up the content
    content = content.trim();
    
    // Extract title and main summary
    const titleMatch = content.match(/^#\s+(.+?)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Split content into sections
    const sectionRegex = /^##\s+(.+?)$([\s\S]*?)(?=^##|\Z)/gm;
    const sectionMatches = [...content.matchAll(sectionRegex)];
    
    sectionMatches.forEach(match => {
      const sectionTitle = match[1].toLowerCase().replace(/[^\w\s]/g, '');
      const sectionContent = match[2].trim();
      
      // Map section titles to our structure
      if (sectionTitle.includes('takeaway') || sectionTitle.includes('summary')) {
        sections.summary = sectionContent;
      } else if (sectionTitle.includes('term') || sectionTitle.includes('definition')) {
        sections.keyTerms = sectionContent;
      } else if (sectionTitle.includes('example') || sectionTitle.includes('application')) {
        sections.examples = sectionContent;
      } else if (sectionTitle.includes('question') || sectionTitle.includes('practice')) {
        sections.practiceQuestions = extractListItems(sectionContent);
      } else if (sectionTitle.includes('reference') || sectionTitle.includes('fact')) {
        sections.quickReference = sectionContent;
      } else if (sectionTitle.includes('mistake') || sectionTitle.includes('pitfall')) {
        sections.commonMistakes = extractListItems(sectionContent);
      } else if (sectionTitle.includes('formula') || sectionTitle.includes('sheet')) {
        sections.formulaSheet = sectionContent;
      } else if (sectionTitle.includes('objective') || sectionTitle.includes('goal')) {
        sections.learningObjectives = sectionContent;
      } else if (sectionTitle.includes('strategy') || sectionTitle.includes('tip')) {
        sections.studyStrategies = sectionContent;
      } else if (sectionTitle.includes('concept') && sectionTitle.includes('relationship')) {
        sections.conceptHierarchy = sectionContent;
      }
    });

    // Extract diagrams from anywhere in the content
    sections.diagrams = extractDiagrams(content);
    
    // If no main summary found, use the content before first ##
    if (!sections.summary) {
      const beforeFirstSection = content.split(/^##/m)[0];
      sections.summary = beforeFirstSection.replace(/^#.+$/m, '').trim();
    }
    
    // Ensure all fields have correct types
    Object.keys(sections).forEach(key => {
      if (typeof sections[key] === 'undefined' || sections[key] === null) {
        sections[key] = Array.isArray(sections[key]) ? [] : '';
      }
    });

    return sections;

  } catch (error) {
    console.error('Error parsing response:', error);
    return {
      summary: content,
      keyTerms: '',
      diagrams: [],
      examples: '',
      practiceQuestions: [],
      quickReference: '',
      conceptHierarchy: '',
      commonMistakes: [],
      formulaSheet: '',
      learningObjectives: '',
      studyStrategies: ''
    };
  }
};

// Helper function to extract list items
const extractListItems = (content) => {
  const items = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Match various list formats
    if (trimmed.match(/^[\d]+\./)) {
      items.push(trimmed.replace(/^[\d]+\.\s*/, ''));
    } else if (trimmed.match(/^[•\-\*]/)) {
      items.push(trimmed.replace(/^[•\-\*]\s*/, ''));
    } else if (trimmed.match(/^\*\*/)) {
      // Bold items
      const match = trimmed.match(/^\*\*([^*]+)\*\*/);
      if (match) items.push(match[1]);
    }
  }
  
  return items.filter(item => item.length > 0);
};

// Enhanced diagram extraction
const extractDiagrams = (content) => {
  const diagrams = [];
  
  // Extract mermaid code blocks
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/g;
  let match;
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    const diagramCode = match[1].trim();
    if (diagramCode.length > 0) {
      diagrams.push(diagramCode);
    }
  }
  
  return diagrams;
};

// Export additional utility functions
export const getAvailableStyles = () => Object.keys(styleConfigs);

export const validateApiKey = () => {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
};

export const getSupportedModels = () => [
  'gemini-1.5-flash',
  'gemini-1.5-pro', 
  'gemini-1.0-pro'
];