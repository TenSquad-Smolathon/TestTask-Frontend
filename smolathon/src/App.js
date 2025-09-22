import { AuthProvider } from './providers/authProvider';
import { PrivateRoute } from './widgets/PrivateRoute';
import { Login } from './views/Login';
import { NotFound } from './views/NotFound';
import { Landing } from './views/Landing';
import { Routes, Route } from 'react-router-dom';
import { Articles } from './views/Articles';
import { Admin } from './views/admin/Admin';
import './static/styles/App.css';

function App() {
  return (
    <div className='app'>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/articles" element={<Articles />} />,

          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
