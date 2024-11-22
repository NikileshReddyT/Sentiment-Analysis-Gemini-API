import { useState } from 'react';

export const useModels = () => {
  const models = [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Recommended)' },
    { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' },
    { id: 'gemini-1.0-pro-latest', name: 'Gemini 1.0 Pro Latest' },
  ];

  const [selectedModel, setSelectedModel] = useState(models[0].id);

  return {
    models,
    selectedModel,
    setSelectedModel,
  };
};
