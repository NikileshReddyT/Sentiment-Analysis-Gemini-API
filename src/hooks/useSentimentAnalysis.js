import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const useSentimentAnalysis = (apiKey) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeSentiment = async (comment, selectedModel) => {
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

  return {
    result,
    loading,
    error,
    analyzeSentiment,
  };
};
