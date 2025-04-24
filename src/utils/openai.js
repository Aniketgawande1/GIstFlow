import axios from 'axios';

// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
// WARNING: For production applications, NEVER hardcode your API key directly in your code
// Instead, use environment variables (process.env.OPENAI_API_KEY)
const API_KEY = 'YOUR_OPENAI_API_KEY';

export const summarizeText = async (studyNotes, style) => {
  // Validate input
  if (!studyNotes || studyNotes.trim() === '') {
    throw new Error('Study notes cannot be empty');
  }

  // Create appropriate prompt based on selected style
  let prompt;
  
  switch (style) {
    case 'concise':
      prompt = `Summarize the following study notes in a concise, review-friendly format:
      
${studyNotes}

Provide the summary in the following format:
1. Summary: A concise overview of the key concepts and information
2. Key Terms & Concepts: Bullet points of important definitions and concepts
3. Exam Tips: Bullet points highlighting possible exam questions or focus areas`;
      break;
    
    case 'detailed':
      prompt = `Create a comprehensive study guide from the following notes:
      
${studyNotes}

Include in your response:
1. Summary: A thorough overview of all important concepts and their relationships
2. Key Terms & Concepts: A detailed glossary of important terms with complete definitions
3. Exam Tips: Substantive guidance on how to approach potential exam questions on this material`;
      break;
    
    case 'key-concepts':
      prompt = `Extract ONLY the key concepts and definitions from the following study notes:
      
${studyNotes}

Format your response as:
1. Summary: A very brief overview that connects the key concepts
2. Key Terms & Concepts: A comprehensive list of all important terms, theories, formulas, and definitions
3. Exam Tips: Brief notes on which concepts are likely most important for exams`;
      break;
    
    case 'exam-focus':
      prompt = `Transform these study notes into an exam-focused review guide:
      
${studyNotes}

Create an exam preparation guide with:
1. Summary: Highlight only the most exam-relevant information
2. Key Terms & Concepts: Focus on definitions and concepts most likely to appear on exams
3. Exam Tips: Detailed strategies for answering potential questions, practice problems where possible, and focus areas`;
      break;
    
    default:
      prompt = `Summarize these study notes:
      
${studyNotes}

Provide:
1. Summary
2. Key Terms & Concepts
3. Exam Tips`;
  }

  try {
    // Make API request to OpenAI
    console.log('Sending request to OpenAI API...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // More affordable option than gpt-4
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes study notes and creates exam guides.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5, // More deterministic output
        max_tokens: 2048  // Ensure we get a substantial response
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    // Extract content from response
    const content = response.data.choices[0].message.content;
    console.log('Received response from OpenAI API');
    
    // Parse the response into sections
    const sections = {
      summary: '',
      keyTerms: '',
      examTips: ''
    };
    
    // Parse the content into sections
    // This handles variations in how OpenAI might format the response
    if (content.includes('Summary:') || content.includes('SUMMARY')) {
      // Find the summary section
      let summaryStart = content.indexOf('Summary:');
      if (summaryStart === -1) summaryStart = content.indexOf('SUMMARY');
      summaryStart = content.indexOf(':', summaryStart) + 1;
      
      // Find the end of the summary section
      let summaryEnd = content.length;
      if (content.includes('Key Terms')) {
        summaryEnd = content.indexOf('Key Terms');
      } else if (content.includes('KEY TERMS')) {
        summaryEnd = content.indexOf('KEY TERMS');
      } else if (content.includes('Key Concepts')) {
        summaryEnd = content.indexOf('Key Concepts');
      }
      
      sections.summary = content.substring(summaryStart, summaryEnd).trim();
    }
    
    // Find the key terms section
    if (content.includes('Key Terms') || content.includes('KEY TERMS') || content.includes('Key Concepts')) {
      let keyTermsStart = content.indexOf('Key Terms');
      if (keyTermsStart === -1) keyTermsStart = content.indexOf('KEY TERMS');
      if (keyTermsStart === -1) keyTermsStart = content.indexOf('Key Concepts');
      keyTermsStart = content.indexOf(':', keyTermsStart) + 1;
      
      // Find the end of the key terms section
      let keyTermsEnd = content.length;
      if (content.includes('Exam Tips')) {
        keyTermsEnd = content.indexOf('Exam Tips');
      } else if (content.includes('EXAM TIPS')) {
        keyTermsEnd = content.indexOf('EXAM TIPS');
      }
      
      sections.keyTerms = content.substring(keyTermsStart, keyTermsEnd).trim();
    }
    
    // Find the exam tips section
    if (content.includes('Exam Tips') || content.includes('EXAM TIPS')) {
      let examTipsStart = content.indexOf('Exam Tips');
      if (examTipsStart === -1) examTipsStart = content.indexOf('EXAM TIPS');
      examTipsStart = content.indexOf(':', examTipsStart) + 1;
      
      sections.examTips = content.substring(examTipsStart).trim();
    }
    
    return sections;
    
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    
    // Provide more helpful error messages based on common issues
    if (error.response?.status === 401) {
      throw new Error('Authentication error: Please check your OpenAI API key');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded: Too many requests or you have exceeded your OpenAI quota');
    } else if (error.response?.status === 500) {
      throw new Error('OpenAI server error: Please try again later');
    }
    
    throw new Error('Failed to generate study summary: ' + (error.message || 'Unknown error'));
  }
};

// Helper function to verify API key is set
export const verifyApiKey = () => {
  if (!API_KEY || API_KEY === 'YOUR_OPENAI_API_KEY') {
    return false;
  }
  return true;
};