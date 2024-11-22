import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import styles from './AnalysisPage.module.css';

const models = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' },
  { id: 'gemini-1.0-pro-latest', name: 'Gemini 1.0 Pro Latest' }
];

function AnalysisPage({ apiKey, onLogout }) {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isBlocked = (sentiment, intensity) => {
    return sentiment === 'negative' && intensity === 'high';
  };

  const isHighlyPositive = (sentiment, intensity) => {
    return sentiment === 'positive' && intensity === 'high';
  };

  const getStatusClass = (sentiment, intensity) => {
    if (isBlocked(sentiment, intensity)) return styles.blocked;
    if (isHighlyPositive(sentiment, intensity)) return styles.approved;
    return styles.neutral;
  };

  const analyzeSentiment = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: selectedModel });

      const prompt = `Analyze the sentiment of this comment and provide the analysis in JSON format with the following structure:
      {
        "text": "the input text",
        "sentiment": "positive/negative/neutral",
        "confidence": number between 0 and 1,
        "analysis": {
          "overall": "detailed explanation",
          "specifics": {
            "positive_terms": ["array of positive words"],
            "negative_terms": ["array of negative words"],
            "intensity": "low/medium/high"
          }
        }
      }
      
      Comment to analyze: "${comment}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const analysisResult = JSON.parse(jsonStr);
        setResult(analysisResult);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Error analyzing sentiment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Sentiment Analysis</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
      
      <div className={styles.card}>
        <div className={styles.inputGroup}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            className={styles.textarea}
            rows={4}
          />
          
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={styles.select}
          >
            {models.map(model => (
              <option className={styles.option} key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={analyzeSentiment} 
            disabled={!comment || loading}
            className={styles.button}
          >
            {loading ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {result && (
          <div className={styles.result}>
            <h2>Analysis Result</h2>
            <div className={`${styles.resultCard} ${getStatusClass(result.sentiment, result.analysis.specifics.intensity)}`}>
              <div className={styles.statusBanner}>
                {isBlocked(result.sentiment, result.analysis.specifics.intensity) ? 
                  'Comment Blocked' : 
                  isHighlyPositive(result.sentiment, result.analysis.specifics.intensity) ?
                  'Comment Approved' : 
                  'Comment Neutral'}
              </div>
              <div className={styles.resultItem}>
                <span>Text:</span>
                <span>{result.text}</span>
              </div>
              <div className={styles.resultItem}>
                <span>Sentiment:</span>
                <span className={styles[result.sentiment]}>
                  {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span>Confidence:</span>
                <span>{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className={styles.resultItem}>
                <span>Overall Analysis:</span>
                <span>{result.analysis.overall}</span>
              </div>
              <div className={styles.resultItem}>
                <span>Intensity:</span>
                <span className={styles[result.analysis.specifics.intensity]}>
                  {result.analysis.specifics.intensity.charAt(0).toUpperCase() + 
                   result.analysis.specifics.intensity.slice(1)}
                </span>
              </div>
              {result.analysis.specifics.positive_terms.length > 0 && (
                <div className={styles.resultItem}>
                  <span>Positive Terms:</span>
                  <div className={styles.terms}>
                    {result.analysis.specifics.positive_terms.map((term, index) => (
                      <span key={index} className={styles.positiveTerm}>{term}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.analysis.specifics.negative_terms.length > 0 && (
                <div className={styles.resultItem}>
                  <span>Negative Terms:</span>
                  <div className={styles.terms}>
                    {result.analysis.specifics.negative_terms.map((term, index) => (
                      <span key={index} className={styles.negativeTerm}>{term}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;
