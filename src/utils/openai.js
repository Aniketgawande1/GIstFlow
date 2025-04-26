import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Enhanced style configurations with structured formats and clear diagrams
const styleConfigs = {
  concise: {
    systemMessage: "Create a well-structured, concise study summary with key points and clear diagrams.",
    prompt: `Summarize these study notes in clean markdown format with this structure:

# {Topic Name}

## Summary
- List 3-5 key takeaways as clear, concise bullet points
- Make each point complete but brief
- Focus on core concepts only

## Key Terms
- **Term 1:** Clear, concise definition
- **Term 2:** Clear, concise definition

## Visual Overview
\`\`\`mermaid
graph LR
  A[Main Concept] --> B[Sub-concept 1]
  A --> C[Sub-concept 2]
  B --> D[Detail 1]
  C --> E[Detail 2]
  
  style A fill:#f96,stroke:#333,stroke-width:2px
  style B fill:#69f,stroke:#333,stroke-width:2px
\`\`\`

## Quick Reference
- **Formula/Principle 1:** Explanation with proper notation
- **Formula/Principle 2:** Explanation with proper notation

Study notes to summarize:
{studyNotes}`
  },
  detailed: {
    systemMessage: "Create a comprehensive study guide with clear explanations, examples, and visual diagrams.",
    prompt: `Create a detailed study guide with this structure:

# {Topic Name} - Comprehensive Guide

## Core Concepts
1. **First concept**
   - Clear explanation with proper terminology
   - Why it matters in this field

2. **Second concept**
   - Clear explanation with proper terminology
   - Why it matters in this field

## Conceptual Diagram
\`\`\`mermaid
flowchart LR
  A[Concept 1] --> B[Concept 2]
  B --> C[Concept 3]
  A --> D[Related idea]
  style A fill:#f9f,stroke:#333,stroke-width:2px
  style B fill:#9cf,stroke:#333,stroke-width:2px
\`\`\`

## Examples & Applications
### Example 1: {Specific Example}
- How this works in practice
- What principles are being applied

### Example 2: {Specific Example}
- How this works in practice
- What principles are being applied

## Common Mistakes & Misconceptions
- **Misconception 1:** Explanation and correction
- **Misconception 2:** Explanation and correction

## Study Questions
1. Question that tests understanding of concept 1
2. Question that tests understanding of concept 2

Study material:
{studyNotes}`
  },
  'key-concepts': {
    systemMessage: "Extract and explain main concepts with clear visual hierarchy and relationships.",
    prompt: `Extract and organize key concepts with this structure:

# {Topic} - Key Concepts Map

## Primary Concepts
1. **{Main Concept 1}**
   - Clear definition with proper terminology
   - Importance in this field
   - Related subconcepts
   
2. **{Main Concept 2}**
   - Clear definition with proper terminology
   - Importance in this field
   - Related subconcepts

## Concept Hierarchy
\`\`\`mermaid
mindmap
  root((Central Topic))
    {Concept 1}
      Sub-concept A
      Sub-concept B
    {Concept 2}
      Sub-concept C
      Sub-concept D
\`\`\`

## Concept Relationships
{Clear explanation of how these concepts interconnect and build upon each other}

Source material:
{studyNotes}`
  },
  'exam-focus': {
    systemMessage: "Create an exam-focused study guide with high-priority topics, diagrams, and practice questions.",
    prompt: `Create an exam preparation guide with this structure:

# {Topic} - Exam Preparation Guide

## High-Priority Topics
1. **{Topic 1}**
   - Key points essential for the exam
   - How this may be tested
2. **{Topic 2}**
   - Key points essential for the exam
   - How this may be tested

## Concept Map
\`\`\`mermaid
graph TD
  A[Main Topic] --> B[Key Subtopic]
  A --> C[Key Subtopic]
  B --> D[Important Detail]
  C --> E[Important Detail]
  style A fill:#f96,stroke:#333,stroke-width:2px
  style B fill:#69f,stroke:#333,stroke-width:2px
\`\`\`

## Formula Sheet
| Formula | When to Use | Example |
|---------|-------------|---------|
| {Formula 1} | {Context for usage} | {Simple example} |
| {Formula 2} | {Context for usage} | {Simple example} |

## Practice Questions
1. {Specific exam-style question}
2. {Specific exam-style question}
3. {Specific exam-style question}

## Quick Tips
- {Strategy for answering questions on this topic}
- {Common pitfalls to avoid}
- {Memory aid or trick}

Source material:
{studyNotes}`
  }
};

// Main function to summarize text
export const summarizeText = async (studyNotes, style = 'concise') => {
  try {
    if (!studyNotes?.trim()) {
      throw new Error('Study notes cannot be empty');
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-04-17" 
    });

    // Extract a potential topic name from the first few lines
    const topicRegex = /^#*\s*([A-Za-z\s]+?)(?:\n|$|\.|:)/;
    const topicMatch = studyNotes.match(topicRegex);
    const topicName = topicMatch ? topicMatch[1].trim() : "Study Topic";

    // Prepare the prompt with topic name inserted
    const configStyle = styleConfigs[style] || styleConfigs['concise'];
    let prompt = configStyle.prompt.replace('{studyNotes}', studyNotes);
    prompt = prompt.replace('{Topic Name}', topicName)
                  .replace('{Topic}', topicName);

    // Generate content with optimized parameters
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${configStyle.systemMessage}\n\n${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      }
    });

    const candidate = result.response?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Failed to generate summary');
    }

    return parseEnhancedResponse(text, style);

  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error(error.message || 'Failed to generate summary');
  }
};

// Enhanced parser that handles structured markdown and diagrams
const parseEnhancedResponse = (content, style) => {
  // Default response structure with all possible sections
  const sections = {
    summary: '',
    keyTerms: '',
    diagrams: [],
    examples: '',
    practiceQuestions: [],
    quickReference: '',
    conceptHierarchy: '',
    commonMistakes: [],
    formulaSheet: ''
  };

  try {
    // Extract the main summary section (everything up to the first ##)
    const summaryMatch = content.match(/^(.*?)(?=##|$)/s);
    if (summaryMatch && summaryMatch[1]) {
      sections.summary = summaryMatch[1].trim();
    } else {
      sections.summary = content; // Fallback if no sections found
    }

    // Extract key terms
    const keyTermsMatch = content.match(/## Key Terms(.*?)(?=##|$)/s);
    if (keyTermsMatch && keyTermsMatch[1]) {
      sections.keyTerms = keyTermsMatch[1].trim();
    }

    // Extract diagrams (supports mermaid and ASCII)
    const diagramRegex = /```(mermaid)?([\s\S]*?)```/gs;
    let diagramMatch;
    while ((diagramMatch = diagramRegex.exec(content)) !== null) {
      // Check if it's a mermaid diagram
      const isMermaid = diagramMatch[1] === 'mermaid';
      const diagramContent = diagramMatch[2].trim();
      
      if (diagramContent) {
        if (isMermaid) {
          // Add mermaid marker to the diagrams array
          sections.diagrams.push(`mermaid\n${diagramContent}`);
        } else {
          // Add regular code blocks
          sections.diagrams.push(diagramContent);
        }
      }
    }

    // Extract concept hierarchy
    const hierarchyMatch = content.match(/## Concept (Hierarchy|Map)(.*?)(?=##|$)/s);
    if (hierarchyMatch && hierarchyMatch[2]) {
      sections.conceptHierarchy = hierarchyMatch[2].trim();
    }

    // Extract practice questions
    const questionsMatch = content.match(/## (Study Questions|Practice Questions)(.*?)(?=##|$)/s);
    if (questionsMatch && questionsMatch[2]) {
      sections.practiceQuestions = questionsMatch[2].trim()
        .split('\n')
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
    }

    // Extract examples
    const examplesMatch = content.match(/## Examples(.*?)(?=##|$)/s);
    if (examplesMatch && examplesMatch[1]) {
      sections.examples = examplesMatch[1].trim();
    }

    // Extract quick reference
    const quickRefMatch = content.match(/## Quick Reference(.*?)(?=##|$)/s);
    if (quickRefMatch && quickRefMatch[1]) {
      sections.quickReference = quickRefMatch[1].trim();
    }

    // Add formula sheet for exam-focus
    const formulaMatch = content.match(/## Formula Sheet(.*?)(?=##|$)/s);
    if (formulaMatch && formulaMatch[1]) {
      sections.formulaSheet = formulaMatch[1].trim();
    }

    // Add common mistakes
    const mistakesMatch = content.match(/## Common Mistakes(.*?)(?=##|$)/s);
    if (mistakesMatch && mistakesMatch[1]) {
      sections.commonMistakes = mistakesMatch[1].trim()
        .split('\n')
        .filter(line => line.trim().length > 0 && line.startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
    }

    // Safety checks - ensure proper types for all values
    // Handle string fields
    const stringFields = ['summary', 'keyTerms', 'examples', 'conceptHierarchy', 'quickReference', 'formulaSheet'];
    stringFields.forEach(field => {
      if (sections[field] === null || sections[field] === undefined) {
        sections[field] = '';
      } else if (typeof sections[field] !== 'string') {
        sections[field] = String(sections[field]);
      }
    });

    // Handle array fields
    const arrayFields = ['diagrams', 'practiceQuestions', 'commonMistakes'];
    arrayFields.forEach(field => {
      if (!Array.isArray(sections[field])) {
        sections[field] = [];
      }
    });

    // As a final check, ensure full content is available somewhere
    if (!sections.summary && !sections.keyTerms) {
      sections.summary = content;
    }

  } catch (error) {
    console.error('Error parsing enhanced response:', error);
    // In case of parsing error, return a safe fallback
    return { summary: content || '', keyTerms: '', diagrams: [] };
  }

  return sections;
};
