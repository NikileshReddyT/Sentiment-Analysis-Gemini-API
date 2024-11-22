import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ApiKeyPage from './components/ApiKeyPage'
import AnalysisPage from './components/AnalysisPage'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('gemini_api_key') || '';
  });

  // Update localStorage when apiKey changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);

  const handleLogout = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <ApiKeyPage 
                apiKey={apiKey} 
                setApiKey={setApiKey} 
              />
            } 
          />
          <Route 
            path="/analysis" 
            element={
              apiKey ? (
                <AnalysisPage 
                  apiKey={apiKey} 
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
