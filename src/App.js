import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Login from "./components/Login";
import Map from "./components/Map";

import "./App.css";

function App() {

  const navigate = useNavigate(); // Initialize the hook

  const handleLoginSuccess = () => {
    // This is the function passed to the Login component
    navigate("/map"); 
  };
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        
        <Route path="/map" element={<Map />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  ); 
}

export default App;
