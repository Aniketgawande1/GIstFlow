import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// System prompt (optional)
const SYSTEM_PROMPT = `You are an expert study assistant. Create clear, concise study summaries with key points, important terms, and useful facts. Keep explanations brief and student-friendly.`;

// Different prompt templates for each style
const promptTemplates = {
  concise: (studyNotes, topicName) => `
Summarize the following notes in a quick review format for students:

# ${topicName} - Quick Review

## ✅ Key Takeaways
- 3–5 most critical points
- What students must remember

## 📘 Essential Terms
- **Term 1:** Brief definition
- **Term 2:** Brief definition

## 🧠 Quick Facts
- Important formulas, dates, or principles
- Memory aids or mnemonics

---
Study Material:
${studyNotes}
---

Keep it concise and focused on the essentials.`,

  detailed: (studyNotes, topicName) => `
Create a comprehensive study guide for the following notes:

# ${topicName} - Comprehensive Study Guide

## 🎯 Learning Objectives
What students should be able to do after studying this:
1. [Objective 1]
2. [Objective 2]
3. [Objective 3]

## 📖 Core Concepts
### Concept 1: [Name]
**Definition:** Clear explanation
**Why it matters:** Practical importance
**Key characteristics:**
- Feature 1
- Feature 2

### Concept 2: [Name]
**Definition:** Clear explanation
**Why it matters:** Practical importance

## 💡 Real-World Examples
- **Example 1:** [Situation and application]
- **Example 2:** [Situation and application]

## 🧠 Study Strategies
- [Specific study tip]
- [Memory technique]
- [Practice recommendation]

---
Study Material:
${studyNotes}
---

Provide thorough explanations with examples and connections.`,

  'key-concepts': (studyNotes, topicName) => `
Extract and organize the key concepts from these notes:

# ${topicName} - Key Concepts

## 🏗️ Foundational Concepts
The building blocks you need to understand first:

1. **[Primary Concept 1]**
   - **Definition:** Clear explanation
   - **Foundation for:** What builds on this
   - **Prerequisites:** What you need to know first

2. **[Primary Concept 2]**
   - **Definition:** Clear explanation
   - **Foundation for:** What builds on this

## 🔗 How Concepts Connect
[Explain relationships between major concepts - dependencies, interactions, etc.]

## 📈 Learning Sequence
Recommended order for mastering these concepts:
1. Start with: [Foundational concept]
2. Then learn: [Next concept]
3. Build up to: [Advanced concept]

---
Study Material:
${studyNotes}
---

Focus on the most important 4-6 concepts and their relationships.`,

  'exam-focus': (studyNotes, topicName) => `
Create an exam-focused study guide from these notes:

# ${topicName} - Exam Preparation

## 🎯 High-Priority Topics
Based on typical exam patterns:

### Priority 1: [Critical Topic]
- **What to know:** Key facts/concepts
- **How it's tested:** Common question types
- **Study tip:** Specific advice

### Priority 2: [Important Topic]
- **What to know:** Key facts/concepts
- **How it's tested:** Common question types

## 📋 Formula/Fact Sheet
| What | When to Use | Example |
|------|-------------|---------|
| [Formula 1] | [Context] | [Quick example] |
| [Key Fact] | [Context] | [Memory aid] |

## 🤔 Practice Questions
1. [Sample exam question based on the content]
2. [Another sample question]
3. [Third sample question]

## ⚡ Last-Minute Review
**Must memorize:**
- [Critical formula/fact 1]
- [Critical formula/fact 2]

**Common traps:**
- [What to watch out for]

---
Study Material:
${studyNotes}
---

Focus on testable content and exam strategies.`
};

// Utility: Extract topic name
const extractTopicName = (studyNotes) => {
  const patterns = [
    /^#\s+([^\n]+)/,
    /Topic:\s*([^\n]+)/i,
    /Chapter\s+\d+[:\-\s]*([^\n]+)/i,
    /^([A-Z][A-Za-z\s]+?)(?:\n|:|\.)/
  ];
  for (const pattern of patterns) {
    const match = studyNotes.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  const firstLine = studyNotes.split('\n').find(line => line.trim().length > 5);
  return firstLine?.trim().slice(0, 50) || "Study Topic";
};

// Main summarization function
export const summarizeText = async (studyNotes, style = 'concise') => {
  if (!studyNotes?.trim()) {
    throw new Error('Study notes cannot be empty.');
  }

  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Set VITE_GEMINI_API_KEY in your environment.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096, // Increased for detailed responses
        topK: 40,
        topP: 0.95
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    });

    const topicName = extractTopicName(studyNotes);
    
    // Get the appropriate template based on style
    const promptTemplate = promptTemplates[style] || promptTemplates.concise;
    const prompt = promptTemplate(studyNotes, topicName);

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (response.promptFeedback?.blockReason) {
      throw new Error(`Content blocked by safety filter: ${response.promptFeedback.blockReason}`);
    }

    const text = response.text();
    if (!text?.trim()) throw new Error('Empty response from Gemini.');

    // Parse the response into the expected object structure
    return parseResponse(text.trim(), style);

  } catch (error) {
    console.error('Gemini summarization error:', error);
    throw new Error(error.message || 'Failed to generate summary.');
  }
};

// Parse the response text into the expected object structure
const parseResponse = (text, style) => {
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
    // Split content into sections
    const sectionRegex = /^##\s+(.+?)$([\s\S]*?)(?=^##|\Z)/gm;
    const sectionMatches = [...text.matchAll(sectionRegex)];
    
    if (sectionMatches.length > 0) {
      sectionMatches.forEach(match => {
        const sectionTitle = match[1].toLowerCase().replace(/[^\w\s]/g, '');
        const sectionContent = match[2].trim();
        
        // Map section titles to our structure based on content
        if (sectionTitle.includes('takeaway') || sectionTitle.includes('key')) {
          sections.summary = sectionContent;
        } else if (sectionTitle.includes('term') || sectionTitle.includes('definition') || sectionTitle.includes('essential')) {
          sections.keyTerms = sectionContent;
        } else if (sectionTitle.includes('fact') || sectionTitle.includes('quick') || sectionTitle.includes('formula') || sectionTitle.includes('sheet')) {
          sections.quickReference = sectionContent;
        } else if (sectionTitle.includes('example') || sectionTitle.includes('real world')) {
          sections.examples = sectionContent;
        } else if (sectionTitle.includes('question') || sectionTitle.includes('practice')) {
          // Extract questions as an array
          const questions = extractQuestions(sectionContent);
          sections.practiceQuestions = questions;
        } else if (sectionTitle.includes('objective') || sectionTitle.includes('learning')) {
          sections.learningObjectives = sectionContent;
        } else if (sectionTitle.includes('strategy') || sectionTitle.includes('study')) {
          sections.studyStrategies = sectionContent;
        } else if (sectionTitle.includes('concept') && (sectionTitle.includes('connect') || sectionTitle.includes('relationship') || sectionTitle.includes('foundational'))) {
          sections.conceptHierarchy = sectionContent;
        } else if (sectionTitle.includes('sequence') || sectionTitle.includes('learning')) {
          sections.conceptHierarchy += '\n\n' + sectionContent;
        }
      });
    } else {
      // If no sections found, use the entire text as summary
      sections.summary = text;
    }

    // If no main summary found, use the content before first ##
    if (!sections.summary) {
      const beforeFirstSection = text.split(/^##/m)[0];
      sections.summary = beforeFirstSection.replace(/^#.+$/m, '').trim();
    }

    // Clean up empty sections
    Object.keys(sections).forEach(key => {
      if (typeof sections[key] === 'string') {
        sections[key] = sections[key].trim();
      }
    });

    return sections;

  } catch (error) {
    console.error('Error parsing response:', error);
    return {
      summary: text,
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

// Helper function to extract questions from text
const extractQuestions = (content) => {
  const questions = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Match numbered questions or bullet points
    if (trimmed.match(/^[\d]+\./)) {
      questions.push(trimmed.replace(/^[\d]+\.\s*/, ''));
    } else if (trimmed.match(/^[•\-\*]/)) {
      questions.push(trimmed.replace(/^[•\-\*]\s*/, ''));
    } else if (trimmed.length > 10 && (trimmed.includes('?') || trimmed.includes('What') || trimmed.includes('How') || trimmed.includes('Why'))) {
      questions.push(trimmed);
    }
  }
  
  return questions.filter(q => q.length > 5);
};

// Export utility functions
export const getAvailableStyles = () => Object.keys(promptTemplates);

export const getStyleDisplayNames = () => ({
  'concise': 'Quick Review',
  'detailed': 'Comprehensive', 
  'key-concepts': 'Key Concepts',
  'exam-focus': 'Exam-Focused'
});
