import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ApiKeyPage.module.css';

function ApiKeyPage({ apiKey, setApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey);
  const navigate = useNavigate();

  // Redirect to analysis page if API key exists
  useEffect(() => {
    if (apiKey) {
      navigate('/analysis');
    }
  }, [apiKey, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiKey(inputKey);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Welcome to Sentiment Analyzer</h1>
        <p>Enter your Google Gemini API Key to get started</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter your API Key"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Get Started
          </button>
        </form>
        
        <div className={styles.info}>
          <p>Don't have an API key?</p>
          <a 
            href="https://ai.google.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Get one here
          </a>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyPage;
