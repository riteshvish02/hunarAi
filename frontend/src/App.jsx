import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import VoiceStudioPage from './pages/VoiceStudioPage';
import PeopleSearchPage from './pages/PeopleSearchPage';
import ResponsesDashboardPage from './pages/ResponsesDashboardPage';
import AttendanceSystemPage from './pages/AttendanceSystemPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<VoiceStudioPage />} />
          <Route path="/people-search" element={<PeopleSearchPage />} />
          <Route path="/responses" element={<ResponsesDashboardPage />} />
          <Route path="/attendance" element={<AttendanceSystemPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
