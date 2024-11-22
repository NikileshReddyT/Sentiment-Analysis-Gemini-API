import { useState, useEffect } from 'react';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
  };

  return {
    apiKey,
    setApiKey,
    clearApiKey,
  };
};
