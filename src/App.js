import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserRoutes from './routes/UserRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';
import { ChatProvider } from './services/context/ChatContext';
function App() {
  return (
    <ChatProvider>
<div className="App">
      <Router>
        <Routes>
       
          <Route path="/*" element={<UserRoutes />} />

        </Routes>
      </Router>
    </div>
    </ChatProvider>
    
  );
}

export default App;
