import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { QuotaProvider } from './context/QuotaContext';

function App() {
  useEffect(() => {
    // Initialize analytics or other setup tasks
    document.title = 'Background Removal Service';
  }, []);

  return (
    <AuthProvider>
      <QuotaProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </QuotaProvider>
    </AuthProvider>
  );
}

export default App;