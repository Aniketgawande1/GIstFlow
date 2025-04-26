import axios from "axios";

// Debug log to check environment variables
console.log('Environment variables available:', {
  VITE_OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY ? 'defined' : 'undefined',
  NODE_ENV: import.meta.env.MODE
});

// TEMPORARY: For testing OpenRouter integration
// Replace this with your actual OpenRouter API key for testing
// IMPORTANT: Remove this before committing your code
const TEMP_API_KEY = "sk-or-v1-your-actual-openrouter-key-here"; // Add your OpenRouter API key here

// Configuration for OpenRouter
const config = {
  // TEMPORARY: Use hardcoded key for testing
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || TEMP_API_KEY,
  apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
  defaultModel: 'openai/gpt-3.5-turbo',
  fallbackModel: 'anthropic/claude-instant-v1',
  maxRetries: 2,
  timeout: 30000,
  httpReferrer: window.location.origin,
  appName: 'GistFlow'
};

// Log the actual config for debugging
console.log('API Config (key masked):', {
  ...config,
  apiKey: config.apiKey ? `${config.apiKey.slice(0, 5)}...${config.apiKey.slice(-4)}` : 'not set'
});

// Disable mock data to test OpenRouter
const USE_MOCK_DATA = false;

// Style configurations - this was missing from your code
const styleConfigs = {
  concise: {
    systemMessage: 'You are a helpful assistant that creates concise, review-friendly study summaries.',
    prompt: `Summarize the following study notes in a concise format:
    
{studyNotes}

Provide the summary in this exact format:
1. Summary: [concise overview of key concepts]
2. Key Terms & Concepts:
- [term1]: [definition]
- [term2]: [definition]
3. Exam Tips:
- [tip1]
- [tip2]`
  },
  detailed: {
    systemMessage: 'You are a expert academic assistant that creates comprehensive study guides.',
    prompt: `Create a detailed study guide from these notes:
    
{studyNotes}

Include in your response (use exactly these headers):
1. Summary: [thorough overview]
2. Key Terms & Concepts:
- [term1]: [detailed definition]
- [term2]: [detailed definition]
3. Exam Tips:
- [substantive guidance]
- [practice questions if applicable]`
  },
  'key-concepts': {
    systemMessage: 'You are a helpful assistant that extracts and explains key concepts.',
    prompt: `Extract ONLY the key concepts from these notes:
    
{studyNotes}

Format your response exactly as:
1. Summary: [brief concept overview]
2. Key Terms & Concepts:
- [term1]: [precise definition]
- [term2]: [precise definition]
3. Exam Tips: [brief importance notes]`
  },
  'exam-focus': {
    systemMessage: 'You are an exam preparation specialist that creates targeted study guides.',
    prompt: `Create an exam-focused guide from these notes:
    
{studyNotes}

Provide in this exact format:
1. Summary: [exam-relevant highlights]
2. Key Terms & Concepts:
- [term1]: [exam-focused definition]
- [term2]: [exam-focused definition]
3. Exam Tips:
- [predicted question types]
- [answer strategies]
- [common mistakes]`
  }
};

// Mock data for development and testing
const MOCK_RESPONSES = {
  'concise': {
    summary: 'This is a mock summary for the concise style. It contains key points from the provided study notes in a compact format.',
    keyTerms: '- Mock Term 1: Definition for mock term 1\n- Mock Term 2: Definition for mock term 2\n- Mock Term 3: Definition for mock term 3',
    examTips: '- Focus on understanding the core concepts\n- Practice with example problems\n- Review key definitions before the exam'
  },
  'detailed': {
    summary: 'This is a comprehensive mock summary for the detailed style. It provides an in-depth overview of all important concepts mentioned in the study notes.',
    keyTerms: '- Mock Term 1: Detailed definition explaining the context and importance of mock term 1\n- Mock Term 2: Thorough explanation of mock term 2 with examples\n- Mock Term 3: Complete breakdown of mock term 3 and its applications',
    examTips: '- Create a structured study plan covering all topics\n- Work through practice problems from each section\n- Form study groups to discuss complex topics\n- Create flashcards for key terms'
  },
  'key-concepts': {
    summary: 'This mock summary focuses only on the essential concepts from the provided notes.',
    keyTerms: '- Key Mock Term 1: Precise definition\n- Key Mock Term 2: Precise definition\n- Key Mock Term 3: Precise definition',
    examTips: 'Focus exclusively on understanding the key terms and their relationships'
  },
  'exam-focus': {
    summary: 'This mock summary is optimized for exam preparation, highlighting testable concepts.',
    keyTerms: '- Mock Term 1: Definition as it might appear in an exam question\n- Mock Term 2: Explanation with common exam applications\n- Mock Term 3: Definition with emphasis on frequently tested aspects',
    examTips: '- Look for questions that ask to compare and contrast concepts\n- Prepare for multiple-choice and short answer formats\n- Common mistake: confusing Term 1 and Term 2\n- Practice time management with sample questions'
  }
};

/**
 * Validates the input parameters
 */
const validateInput = (studyNotes, style) => {
  if (!studyNotes || typeof studyNotes !== 'string' || studyNotes.trim() === '') {
    throw new Error('Study notes must be a non-empty string');
  }

  if (!style || !styleConfigs[style]) {
    throw new Error(`Invalid style. Choose from: ${Object.keys(styleConfigs).join(', ')}`);
  }

  if (!config.apiKey) {
    throw new Error('OpenRouter API key is not configured');
  }
};

/**
 * Generates a study summary from notes
 */
export const summarizeText = async (studyNotes, style = 'concise', retryCount = 0) => {
  try {
    validateInput(studyNotes, style);

    if (USE_MOCK_DATA) {
      console.log('Using mock data for development');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return MOCK_RESPONSES[style];
    }

    // Detailed console logs for debugging
    console.log('Preparing to call OpenRouter API...');
    console.log('Using model:', config.defaultModel);
    console.log('Endpoint:', config.apiEndpoint);
    
    const configStyle = styleConfigs[style];
    const prompt = configStyle.prompt.replace('{studyNotes}', studyNotes);

    console.log('Sending request to OpenRouter API...');
    const response = await axios.post(
      config.apiEndpoint,
      {
        model: config.defaultModel,
        messages: [
          { role: 'system', content: configStyle.systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more focused responses
        max_tokens: 1024, // Reduced from 2048 for faster response
        top_p: 0.8 // Add top_p parameter for more focused output
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': config.httpReferrer,
          'X-Title': config.appName
        },
        timeout: config.timeout
      }
    );

    // Log the response status for debugging
    console.log('OpenRouter API response status:', response.status);
    console.log('Response data structure:', Object.keys(response.data));

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      console.error('Empty content in response:', response.data);
      throw new Error('No content in API response');
    }

    console.log('Received valid response from OpenRouter API');
    return parseResponse(content);

  } catch (error) {
    // Detailed error logging
    console.error('Error in summarizeText:', error);
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      console.error('Error response data:', error.response.data);
      
      // Create user-friendly error messages
      switch (error.response.status) {
        case 401:
          throw new Error('Authentication failed - invalid API key');
        case 402:
          throw new Error('Payment required - check your OpenRouter account balance');
        case 403:
          throw new Error('Access forbidden - your account may have restrictions');
        case 404:
          throw new Error('API endpoint not found - check the URL');
        case 429:
          throw new Error('Rate limit exceeded - please try again later');
        case 500:
        case 502:
        case 503:
          throw new Error('OpenRouter server error - please try again later');
        default:
          throw new Error(`API request failed with status ${error.response.status}: ${error.response.data?.error?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error('No response received from OpenRouter - check your internet connection');
    } else {
      // This could be a validation error or other error
      throw error;
    }
  }
};

export const verifyApiKey = () => {
  return Boolean(config.apiKey);
};

export const getAvailableStyles = () => {
  return Object.keys(styleConfigs);
};

// Parse the API response into structured sections
const parseResponse = (content) => {
  const sections = {
    summary: '',
    keyTerms: '',
    examTips: ''
  };

  // Helper function to extract section
  const extractSection = (content, possibleHeaders) => {
    for (const header of possibleHeaders) {
      const startIdx = content.indexOf(header);
      if (startIdx !== -1) {
        const sectionStart = content.indexOf(':', startIdx) + 1;
        let sectionEnd = content.length;

        // Look for the next section header
        const nextHeaders = [
          '2. Key Terms', 'Key Terms & Concepts', 'KEY TERMS',
          '3. Exam Tips', 'Exam Tips', 'EXAM TIPS'
        ].filter(h => h !== header);

        for (const nextHeader of nextHeaders) {
          const idx = content.indexOf(nextHeader, sectionStart);
          if (idx !== -1 && idx < sectionEnd) {
            sectionEnd = idx;
          }
        }

        return content.substring(sectionStart, sectionEnd).trim();
      }
    }
    return '';
  };

  sections.summary = extractSection(content, [
    '1. Summary', 'Summary:', 'SUMMARY'
  ]);

  sections.keyTerms = extractSection(content, [
    '2. Key Terms', 'Key Terms & Concepts:', 'KEY TERMS'
  ]);

  sections.examTips = extractSection(content, [
    '3. Exam Tips', 'Exam Tips:', 'EXAM TIPS'
  ]);

  return sections;
};