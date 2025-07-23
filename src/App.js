import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import JobDetails from './pages/JobDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <JobProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="add" element={<AddJob />} />
                <Route path="job/:id" element={<JobDetails />} />
                <Route path="job/:id/edit" element={<JobDetails />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </JobProvider>
    </ErrorBoundary>
  );
}

export default App;
