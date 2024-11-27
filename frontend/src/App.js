import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/AuthPage';
import SurveyPage from './pages/SurveyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/encuestas" element={<SurveyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
