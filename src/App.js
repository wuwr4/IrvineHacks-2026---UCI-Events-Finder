import { Route, Routes, Navigate } from "react-router-dom";

import Map from "./components/Map";

import "./App.css";

function App() {
  /*
    This is the App component which is generated when we create a new React app. 
    This is the main component in React which acts as a container for all other components.

    Here, we are creating our App and providing different paths which render different 
    components.
  */
  return (
    <div className="App">
      <Routes>

        {/* Navigates to the Map page ig not given a URI */}
        <Route path="/" element={<Map />} />

        {/* Navigates to the home page if given an unknown URI */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  ); 
}

export default App;
