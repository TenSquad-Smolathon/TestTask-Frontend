import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/authProvider';
import './static/styles/App.css';

import { Login } from './views/Login';
import { NotFound } from './views/NotFound';
import { Landing } from './views/Landing';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
