import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnalysisPage.module.css';
import { useSentimentAnalysis } from '../hooks/useSentimentAnalysis';
import { useModels } from '../hooks/useModels';
import { useTheme } from '../hooks/useTheme.jsx';

function AnalysisPage({ apiKey, onLogout }) {
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const { models, selectedModel, setSelectedModel } = useModels();
  const { result, loading, error, analyzeSentiment } = useSentimentAnalysis(apiKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await analyzeSentiment(comment, selectedModel);
  };

  const getStatusClass = () => {
    if (!result) return '';
    
    const { sentiment, analysis } = result;
    const { intensity } = analysis.specifics;
    
    if (sentiment === 'negative' && intensity === 'high') {
      return styles.blocked;
    }
    if (sentiment === 'positive' && intensity === 'high') {
      return styles.approved;
    }
    return styles.neutral;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sentiment Analysis</h1>
        <div className={styles.controls}>
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className={styles.themeToggleIcon}>
              {isDarkMode ? '🌞' : '🌙'}
            </span>
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
          <button onClick={onLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
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
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment to analyze..."
            className={styles.textarea}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {loading && (
          <div className={styles.loading}>
            Analyzing your text... Please wait
          </div>
        )}

        {!loading && result && (
          <div className={`${styles.result} ${getStatusClass()}`}>
            <div className={styles.statusBanner}>
              {result.sentiment === 'negative' && result.analysis.specifics.intensity === 'high' && 'Blocked'}
              {result.sentiment === 'positive' && result.analysis.specifics.intensity === 'high' && 'Approved'}
              {!(
                (result.sentiment === 'negative' && result.analysis.specifics.intensity === 'high') ||
                (result.sentiment === 'positive' && result.analysis.specifics.intensity === 'high')
              ) && 'Neutral'}
            </div>
            
            <div className={styles.resultContent}>
              <div className={styles.mainMetrics}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Sentiment</span>
                  <span className={`${styles.metricValue} ${styles[result.sentiment]}`}>
                    {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                  </span>
                  <span className={styles.confidence}>
                    {(result.confidence * 100).toFixed(1)}% confidence
                  </span>
                </div>

                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Intensity</span>
                  <span className={`${styles.metricValue} ${styles[result.analysis.specifics.intensity]}`}>
                    {result.analysis.specifics.intensity.charAt(0).toUpperCase() + 
                     result.analysis.specifics.intensity.slice(1)}
                  </span>
                </div>
              </div>

              <div className={styles.analysis}>
                <h3 className={styles.sectionTitle}>Analysis</h3>
                <p className={styles.analysisText}>{result.analysis.overall}</p>
              </div>
              
              <div className={styles.terms}>
                {result.analysis.specifics.positive_terms.length > 0 && (
                  <div className={styles.termGroup}>
                    <h3 className={styles.sectionTitle}>Key Positive Elements</h3>
                    <div className={styles.termList}>
                      {result.analysis.specifics.positive_terms.map((term, index) => (
                        <span key={index} className={`${styles.term} ${styles.positive}`}>
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.analysis.specifics.negative_terms.length > 0 && (
                  <div className={styles.termGroup}>
                    <h3 className={styles.sectionTitle}>Key Negative Elements</h3>
                    <div className={styles.termList}>
                      {result.analysis.specifics.negative_terms.map((term, index) => (
                        <span key={index} className={`${styles.term} ${styles.negative}`}>
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {result.analysis.specifics.recommendations && result.analysis.specifics.recommendations.length > 0 && (
                <div className={styles.suggestions}>
                  <h3 className={styles.sectionTitle}>Suggestions</h3>
                  <ul className={styles.suggestionList}>
                    {result.analysis.specifics.recommendations.map((suggestion, index) => (
                      <li key={index} className={styles.suggestionItem}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
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
