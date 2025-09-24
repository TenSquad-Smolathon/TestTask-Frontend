import { AuthProvider } from './providers/authProvider';
import { PrivateRoute } from './widgets/PrivateRoute';
import { Login } from './views/Login';
import { NotFound } from './views/NotFound';
import { Landing } from './views/Landing';
import { Routes, Route } from 'react-router-dom';


import { Admin } from './views/admin/Admin';
import { AdminRedactor } from './views/admin/Redactor';
import { AdminOrders } from './views/admin/Orders';
import { AdminStats } from './views/admin/Stats';
import { AdminMaps } from './views/admin/Maps';

import { Articles } from './views/Articles';
import { News } from './views/News';
import { Stats } from './views/Stats';
import { About } from './views/About';
import { Services } from './views/Services';
import { AccidentsMap } from './views/AccidentsMap';
import { Project } from './views/Project';
import { Contacts } from './views/other/Contacts';
import { Vacancies } from './views/other/Vacancies';
import { Documents } from './views/other/Documents';

import './static/styles/App.css';


const services = [
  <Route path="/services/accidents-map" element={<AccidentsMap />} />,
  <Route path="/services/stats" element={<Stats />} />
];

const admins = [
  <Route path="/login" element={<Login />} />,

  <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />,
  <Route path="/admin/redactor" element={<PrivateRoute><AdminRedactor /></PrivateRoute>} />,
  <Route path="/admin/stats" element={<PrivateRoute><AdminStats /></PrivateRoute>} />,
  <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />,
  <Route path="/admin/maps" element={<PrivateRoute><AdminMaps /></PrivateRoute>} />,

  <Route path="/admin/*" element={<Login />} />
];

function App() {
  return (
    <div className='app'>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/articles" element={<Articles />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />

          <Route path="/contacts" element={<Contacts />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/documents" element={<Documents />} />

          <Route path="/project/:name" element={<Project />} />
          <Route path="/services/:name" element={<Services />} />,

          {services}
          {admins}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
