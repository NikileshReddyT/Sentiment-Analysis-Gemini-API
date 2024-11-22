import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnalysisPage.module.css';
import { useSentimentAnalysis } from '../hooks/useSentimentAnalysis';
import { useModels } from '../hooks/useModels';

function AnalysisPage({ apiKey, onLogout }) {
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  
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
        <h1>Sentiment Analysis</h1>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
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

        {result && (
          <div className={`${styles.result} ${getStatusClass()}`}>
            <div className={styles.statusBanner}>
              {result.sentiment === 'negative' && result.analysis.specifics.intensity === 'high' && 'Blocked'}
              {result.sentiment === 'positive' && result.analysis.specifics.intensity === 'high' && 'Approved'}
              {!(
                (result.sentiment === 'negative' && result.analysis.specifics.intensity === 'high') ||
                (result.sentiment === 'positive' && result.analysis.specifics.intensity === 'high')
              ) && 'Neutral'}
            </div>
            
            <div className={styles.sentiment}>
              <strong>Sentiment:</strong> {result.sentiment}
              <span className={styles.confidence}>
                (Confidence: {(result.confidence * 100).toFixed(1)}%)
              </span>
            </div>
            
            <div className={styles.analysis}>
              <strong>Analysis:</strong> {result.analysis.overall}
            </div>
            
            <div className={styles.terms}>
              {result.analysis.specifics.positive_terms.length > 0 && (
                <div className={styles.termGroup}>
                  <strong>Positive Terms:</strong>
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
                  <strong>Negative Terms:</strong>
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
            
            <div className={styles.intensity}>
              <strong>Intensity:</strong>
              <span className={`${styles.intensityValue} ${styles[result.analysis.specifics.intensity.toLowerCase()]}`}>
                {result.analysis.specifics.intensity}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;
