# GistFlow - Study Notes Summarizer

GistFlow is a modern web application that transforms your lengthy study materials into organized, AI-powered summaries. Built with React and powered by Google's Gemini AI, it helps students and learners efficiently process and understand complex study notes through intelligent summarization.

## Features

- **AI-Powered Summarization**: Generate intelligent summaries using Google's Gemini 1.5 Flash model
- **Four Distinct Summary Styles**:
  - **Quick Review**: Concise summaries with key takeaways and essential terms
  - **Comprehensive**: Detailed study guides with learning objectives and real-world examples  
  - **Key Concepts**: Focus on foundational concepts and their relationships
  - **Exam-Focused**: Prioritized topics, practice questions, and exam strategies
- **Smart File Upload**: Upload `.txt` files up to 1MB for instant processing
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Real-Time Feedback**: Instant toast notifications and loading states
- **Markdown Support**: Rich text rendering with proper formatting

## Technologies Used

- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion
- **AI Integration**: Google Gemini 1.5 Flash API
- **UI Components**: React Markdown, Heroicons, Lucide React
- **Styling**: TailwindCSS with modern gradient themes
- **Notifications**: React Hot Toast
- **Build Tool**: Vite for fast development and optimized builds

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gistflow.git
   cd gistflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```
   
   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:5173
   ```

## Usage

1. **Input your study material**: Paste text directly into the text area or upload a `.txt` file
2. **Choose your summary style**:
   - **Quick Review**: For rapid revision and key points
   - **Comprehensive**: For thorough understanding with examples
   - **Key Concepts**: For concept mapping and relationships  
   - **Exam-Focused**: For test preparation with practice questions
3. **Generate**: Click "Generate Study Summary" and wait for AI processing
4. **Study**: Review your organized summary with formatted sections, key terms, and actionable insights

## Example Output

Each summary style provides different structured sections:
- **Key Takeaways**: Most important points to remember
- **Essential Terms**: Definitions and explanations
- **Quick Facts**: Formulas, dates, and memory aids
- **Practice Questions**: Self-assessment opportunities (Exam-Focused)
- **Learning Objectives**: Clear goals (Comprehensive)
- **Concept Relationships**: How ideas connect (Key Concepts)

## Project Structure

```
gistflow/
├── .env                     # Environment variables (Gemini API key)
├── .git/                    # Git repository data
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── eslint.config.js         # ESLint configuration
├── index.html               # Main HTML template
├── package.json             # Dependencies and scripts
├── package-lock.json        # Dependency lock file
├── vite.config.js           # Vite build configuration
├── node_modules/            # Installed dependencies
├── public/                  # Static assets
│   └── vite.svg            # Vite logo
└── src/                     # Source code
    ├── App.css              # Main app styles
    ├── App.jsx              # Main application component
    ├── index.css            # Global styles and Tailwind imports
    ├── main.jsx             # React entry point
    ├── assets/              # Static images and icons
    │   └── react.svg        # React logo
    ├── components/          # React components
    │   ├── Footer.jsx       # Page footer component
    │   ├── Header.jsx       # Navigation header component
    │   ├── InputSection.jsx # File upload and text input
    │   ├── LoadingSpinner.jsx # Loading animations
    │   └── SummarySection.jsx # Summary display and formatting
    └── utils/               # Utility functions
        └── gemini.js        # Google Gemini API integration
```

## Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400?text=Home+Page)

### Summarization Output
![Summarization Output](https://via.placeholder.com/800x400?text=Summarization+Output)

## API Integration

This project integrates with **Google's Gemini 1.5 Flash API** for intelligent text summarization. The AI model provides contextual understanding and generates structured summaries tailored to different learning styles.

### API Configuration

- **Model**: `gemini-1.5-flash` (Google's latest fast model)
- **Provider**: Google AI Studio
- **Features**: 
  - Advanced text analysis and summarization
  - Context-aware content generation
  - Multiple output formats and styles
  - Safety filtering and content moderation

### Environment Setup

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Customization

### Modify Summary Styles
To add or customize summarization styles, update the `promptTemplates` object in `src/utils/gemini.js`:

```javascript
const promptTemplates = {
  'your-style': (studyNotes, topicName) => `
    Your custom prompt template here...
  `
};
```

### Theme Customization
GistFlow uses TailwindCSS with a modern gradient theme. Customize colors and styling in:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Global styles
- Component files - Individual component styling

### Add New Features
The modular architecture makes it easy to extend:
- Add new components in `src/components/`
- Extend AI functionality in `src/utils/gemini.js`
- Modify the main layout in `src/App.jsx`

## Contributing

Contributions are welcome! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your fork and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google AI](https://ai.google.dev/) for providing the Gemini API
- [TailwindCSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Hot Toast](https://react-hot-toast.com) for elegant notifications
- [Heroicons](https://heroicons.com) and [Lucide](https://lucide.dev) for beautiful icons
- [Vite](https://vitejs.dev) for lightning-fast development experience

---

**GistFlow** - Transform your study experience with AI-powered insights! 🚀📚