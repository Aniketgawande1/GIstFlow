# GistFlow - Study Notes Summarizer

GistFlow is a web application that helps users summarize their study notes into concise, detailed, or exam-focused formats using AI-powered language models. It supports text input, file uploads, and multiple summarization styles to suit different learning needs.

## Features

- **AI-Powered Summarization**: Generate summaries using OpenRouter's AI models.
- **Multiple Summarization Styles**:
  - **Quick Review**: Concise summaries for quick revision.
  - **Comprehensive Study**: Detailed summaries for in-depth understanding.
  - **Key Concepts Only**: Focus on the most important terms and concepts.
  - **Exam-Focused**: Tailored summaries for exam preparation.
- **File Upload Support**: Upload `.txt` files for summarization.
- **Dark Mode**: Fully responsive design with a sleek zero-black theme for OLED screens.
- **Real-Time Feedback**: Toast notifications for user actions and errors.

## Technologies Used

- **Frontend**: React, TailwindCSS, Framer Motion
- **Backend API**: OpenRouter API for AI summarization
- **Styling**: TailwindCSS with a custom zero-black theme
- **Notifications**: React Hot Toast

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

3. Create a `.env` file in the root directory and add your OpenRouter API key:
   ```env
   VITE_OPENROUTER_API_KEY=your-openrouter-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:5173
   ```

## Usage

1. Paste your study notes into the text area or upload a `.txt` file.
2. Select a summarization style:
   - Quick Review
   - Comprehensive Study
   - Key Concepts Only
   - Exam-Focused
3. Click the **Generate Study Summary** button.
4. View the generated summary, key terms, and exam tips.

## Project Structure

```
gistflow/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── InputSection.jsx
│   │   ├── SummaryDisplay.jsx
│   ├── utils/              # Utility functions
│   │   ├── openai.js       # API integration with OpenRouter
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles
├── .env                    # Environment variables
├── package.json            # Project dependencies
├── tailwind.config.js      # TailwindCSS configuration
├── vite.config.js          # Vite configuration
```

## Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400?text=Home+Page)

### Summarization Output
![Summarization Output](https://via.placeholder.com/800x400?text=Summarization+Output)

## API Integration

This project uses the **OpenRouter API** for AI-powered summarization. Ensure you have a valid API key from OpenRouter.

### API Configuration

- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Headers**:
  - `Authorization: Bearer <API_KEY>`
  - `HTTP-Referer: <your-site-url>`
  - `X-Title: GistFlow`

## Customization

### Change Theme
To modify the theme, update the TailwindCSS configuration in `tailwind.config.js` or override styles in `index.css`.

### Add New Summarization Styles
To add new summarization styles, update the `styleConfigs` object in `src/utils/openai.js`.

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

- [OpenRouter](https://openrouter.ai) for providing the AI API.
- [TailwindCSS](https://tailwindcss.com) for styling.
- [Framer Motion](https://www.framer.com/motion/) for animations.
- [React Hot Toast](https://react-hot-toast.com) for notifications.

---

**GistFlow** - Simplify your study sessions with AI-powered summaries!