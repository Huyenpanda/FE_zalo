
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserRoutes from './routes/UserRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';
import { ChatProvider } from './services/context/ChatContext';
import { AuthProvider } from './services/context/AuthContext';
import ProfilePage from './pages/Profilepage';
import Createpostpage from './pages/Createpostpage';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/*" element={<UserRoutes />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/post/create" element={<Createpostpage />} />
            </Routes>
          </Router>
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
