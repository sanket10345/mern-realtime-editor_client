// App.js
import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import TextEditor from './components/TextEditor';
import HomePage from './components/HomePage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  // For simplicity, using a fixed document ID. You can expand this as needed.
  const [documentId] = useState("1");

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUser(userId);
    }
  }, []); // Ensure the dependency array is correctly placed

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <Router>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doc/:docId/version/:verId" element={<TextEditor />} />
          <Route path="/doc/:docId" element={<TextEditor />} />
          </Routes>
        </Router>
        // <HomePage 
        // //user={user} documentId={documentId}
        // />
        
      )}
    </div>
  );
}

export default App;
