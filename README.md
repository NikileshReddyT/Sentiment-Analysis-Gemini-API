# Sentiment Analysis Web Application

A modern web application that uses Google's Generative AI (Gemini) to analyze the sentiment of text comments. The application provides detailed sentiment analysis with confidence scores, term analysis, and intensity levels.

## Features

- 🔒 Secure API key management
- 🤖 Multiple Gemini AI model support
- 📊 Detailed sentiment analysis
- 🎨 Modern, responsive UI
- 🚦 Visual status indicators
- 📝 Term-level analysis

## Getting Started

### Prerequisites

1. Node.js (v14 or higher)
2. Google Gemini API Key ([Get one here](https://ai.google.dev/))
3. npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NikileshReddyT/Sentiment-Analysis-Gemini-API.git
cd sentiment-analyzer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

### 1. API Key Setup
- On first launch, you'll be prompted to enter your Google Gemini API key
- The key is stored securely in your browser's local storage
- You can log out at any time to clear the stored API key

### 2. Analyzing Text
1. Enter your text in the comment box
2. (Optional) Select a Gemini model:
   - Gemini 1.5 Flash (Recommended)
   - Gemini 1.0 Pro
   - Gemini 1.0 Pro Latest
3. Click "Analyze Sentiment"

### 3. Understanding Results

The analysis provides:

#### Sentiment Categories
- **Positive**: Indicates favorable sentiment
- **Negative**: Indicates unfavorable sentiment
- **Neutral**: Balanced or unclear sentiment

#### Status Indicators
- **Approved**: Highly positive comments
- **Blocked**: Highly negative comments
- **Neutral**: All other combinations

#### Analysis Details
- Overall sentiment explanation
- Confidence score (0-100%)
- Positive and negative terms found
- Sentiment intensity (Low/Medium/High)

## Technical Details

### Built With
- React + Vite
- Google Generative AI (@google/generative-ai)
- React Router DOM
- Modern CSS with Modules

### Project Structure
```
src/
├── components/
│   ├── AnalysisPage.jsx
│   ├── ApiKeyPage.jsx
│   └── *.module.css
├── hooks/
│   ├── useApiKey.js
│   ├── useModels.js
│   └── useSentimentAnalysis.js
└── App.jsx
```

## Security Considerations

- API keys are stored in browser local storage
- Keys are cleared on logout
- No server-side storage of sensitive data
- Protected routes prevent unauthorized access

## Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Verify your API key is correct
   - Ensure you have access to the Gemini API

2. **"Analysis Failed"**
   - Check your internet connection
   - Verify API key permissions
   - Try a different Gemini model

3. **"Page Not Loading"**
   - Clear browser cache
   - Verify development server is running
   - Check console for errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Generative AI team for the Gemini API
- React and Vite teams for the development framework
- Contributors and users of the application
