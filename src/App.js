import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserRoutes from './routes/UserRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
       
          <Route path="/*" element={<UserRoutes />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;