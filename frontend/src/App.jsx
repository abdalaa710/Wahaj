import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { Home } from './pages/Home/Home';
import { Explore } from './pages/Explore/Explore';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { InvestigationDetails } from './pages/InvestigationDetails/InvestigationDetails';
import { Compare } from './pages/Compare/Compare';
import { Assistant } from './pages/Assistant/Assistant';
import { About } from './pages/About/About';

export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-ivory dark:bg-midnight text-midnight dark:text-ivory transition-colors duration-300">
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/investigation/:id" element={<InvestigationDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
