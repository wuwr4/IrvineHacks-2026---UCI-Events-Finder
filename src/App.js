
import React from "react"

import Login from "./components/Login";
import Map from "./components/Map";

import "./App.css";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Listen for login/logout
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <div className="App"> {/* <--- Add this className here */}
      {isLoggedIn ? <Map /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />}
    </div>
  );
}

export default App;
