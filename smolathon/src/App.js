import { AuthProvider } from './providers/authProvider';
import { PrivateRoute } from './widgets/PrivateRoute';
import { Login } from './views/Login';
import { NotFound } from './views/NotFound';
import { Landing } from './views/Landing';
import { Routes, Route } from 'react-router-dom';
import { Articles } from './views/Articles';
import { Admin } from './views/admin/Admin';
import { Redactor } from './views/admin/Redactor';
import { RentAuto } from './views/services/RentAuto';
import { Evacuate } from './views/services/Evacuate';
import { Documents } from './views/services/Documents';

import './static/styles/App.css';

const services = [
  <Route path="/services/rent-auto" element={<RentAuto />} />,
  <Route path="/services/evacuate" element={<Evacuate />} />,
  <Route path="/services/documents" element={<Documents />} />
];

const admins = [
  <Route path="/login" element={<Login />} />,
  <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />,
  <Route path="/admin/redactor" element={<PrivateRoute><Redactor /></PrivateRoute>} />
];

function App() {
  return (
    <div className='app'>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/articles" element={<Articles />} />
          <Route path="/news" element={<News />} />

          {services}
          {admins}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
