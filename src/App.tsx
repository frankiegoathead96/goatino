import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatUI } from './components/ChatUI';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return <ChatUI />;
  }

  return <LandingPage onSkipAuth={() => setIsAuthenticated(true)} />;
}

export default App;
