import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ApiKeyPage from './components/ApiKeyPage'
import AnalysisPage from './components/AnalysisPage'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useApiKey } from './hooks/useApiKey'

function App() {
  const { apiKey, setApiKey, clearApiKey } = useApiKey();

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
                  onLogout={clearApiKey}
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
