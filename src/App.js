import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import "./App.css";

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={() => alert("Logged in!")} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
