import React, { useState } from "react";
import { auth, db, verifyDormFn } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { query, collection, doc, where, setDoc, getDocs } from "firebase/firestore";

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dorm: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------- SIGN UP -----------------
  const handleSignUp = async () => {
    setError("");

    const { firstName, lastName, email, password, dorm } = form;

    // Validate fields
    if (!firstName || !lastName || !email || !password || !dorm) {
      setError("All fields are required");
      return;
    }

    if (!email.endsWith("@uci.edu")) {
      setError("Email must be a uci.edu address");
      return;
    }

    try {
      // Check if email already exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setError("Email already exists. Try signing in by clicking below.");
        return;
      }

      // --------------------- Verify Dorm ---------------------
      const dormResult = await verifyDormFn({ address: dorm });
      const { formattedAddress, lat, lng } = dormResult.data;

      // --------------------- Create Firebase Auth User ---------------------
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Save user info in Firestore
      await setDoc(doc(db, "users", uid), {
        firstName,
        lastName,
        email,
        dorm: (lat, lng),
        lat,
        lng, 
        address: formattedAddress
      });

      // Success → go to dashboard
      onLoginSuccess();

    } catch (err) {
      console.error(err);
      if (err.message.includes("Melissa")) {
        setError("Dorm address could not be verified. Please check your input.");
      } else {
        setError(err.message || "Email or Password is incorrect.");
      }
    }
  };

  // ----------------- SIGN IN -----------------
  const handleSignIn = async () => {
    setError("");
    const { email, password } = form;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Email or password is incorrect.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <style>
    {`
      @keyframes drift {
        from { transform: translateX(-30px); }
        to { transform: translateX(30px); }
      }
      @keyframes snoutWave {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-8deg); }
      }
      .cloud-animate {
        animation: drift 6s ease-in-out infinite alternate;
      }
      .peter-snout {
        animation: snoutWave 2.5s ease-in-out infinite;
        transform-origin: 25px 35px;
      }
    `}
  </style>
  <div className="cloud-animate" style={{ position: "absolute", top: "10%", left: "15%", opacity: 0.8 }}>
    <svg width="400" height="130" viewBox="0 0 24 24" fill="white">
      <path d="M17.5,19c-3.03,0-5.5-2.47-5.5-5.5c0-0.23,0.02-0.45,0.05-0.67C9.17,12.35,7,10.42,7,8c0-2.21,1.79-4,4-4c0.55,0,1.07,0.11,1.53,0.32C13.4,2.83,15.07,2,17,2c3.31,0,6,2.69,6,6c0,0.34-0.03,0.67-0.08,1C23.59,9.33,24,10.11,24,11c0,1.66-1.34,3-3,3c-0.17,0-0.33-0.02-0.5-0.05C19.95,16.83,17.2,19,17.5,19z" />
    </svg>
  </div>
  <div className="cloud-animate" style={{ position: "absolute", top: "10%", left: "60%", opacity: 0.8 }}>
    <svg width="200" height="300" viewBox="0 0 24 24" fill="white">
      <path d="M17.5,19c-3.03,0-5.5-2.47-5.5-5.5c0-0.23,0.02-0.45,0.05-0.67C9.17,12.35,7,10.42,7,8c0-2.21,1.79-4,4-4c0.55,0,1.07,0.11,1.53,0.32C13.4,2.83,15.07,2,17,2c3.31,0,6,2.69,6,6c0,0.34-0.03,0.67-0.08,1C23.59,9.33,24,10.11,24,11c0,1.66-1.34,3-3,3c-0.17,0-0.33-0.02-0.5-0.05C19.95,16.83,17.2,19,17.5,19z" />
    </svg>
  </div>
  <div className="cloud-animate" style={{ position: "absolute", top: "20%", left: "2%", opacity: 0.8 }}>
    <svg width="400" height="300" viewBox="0 0 24 24" fill="white">
      <path d="M17.5,19c-3.03,0-5.5-2.47-5.5-5.5c0-0.23,0.02-0.45,0.05-0.67C9.17,12.35,7,10.42,7,8c0-2.21,1.79-4,4-4c0.55,0,1.07,0.11,1.53,0.32C13.4,2.83,15.07,2,17,2c3.31,0,6,2.69,6,6c0,0.34-0.03,0.67-0.08,1C23.59,9.33,24,10.11,24,11c0,1.66-1.34,3-3,3c-0.17,0-0.33-0.02-0.5-0.05C19.95,16.83,17.2,19,17.5,19z" />
    </svg>
  </div>
  <div className="cloud-animate" style={{ position: "absolute", top: "50%", left: "60%", opacity: 0.8 }}>
    <svg width="500" height="150" viewBox="0 0 24 24" fill="white">
      <path d="M17.5,19c-3.03,0-5.5-2.47-5.5-5.5c0-0.23,0.02-0.45,0.05-0.67C9.17,12.35,7,10.42,7,8c0-2.21,1.79-4,4-4c0.55,0,1.07,0.11,1.53,0.32C13.4,2.83,15.07,2,17,2c3.31,0,6,2.69,6,6c0,0.34-0.03,0.67-0.08,1C23.59,9.33,24,10.11,24,11c0,1.66-1.34,3-3,3c-0.17,0-0.33-0.02-0.5-0.05C19.95,16.83,17.2,19,17.5,19z" />
    </svg>
  </div>
  <div className="cloud-animate" style={{ position: "absolute", top: "40%", left: "20%", opacity: 0.8 }}>
    <svg width="210" height="200" viewBox="0 0 24 24" fill="white">
      <path d="M17.5,19c-3.03,0-5.5-2.47-5.5-5.5c0-0.23,0.02-0.45,0.05-0.67C9.17,12.35,7,10.42,7,8c0-2.21,1.79-4,4-4c0.55,0,1.07,0.11,1.53,0.32C13.4,2.83,15.07,2,17,2c3.31,0,6,2.69,6,6c0,0.34-0.03,0.67-0.08,1C23.59,9.33,24,10.11,24,11c0,1.66-1.34,3-3,3c-0.17,0-0.33-0.02-0.5-0.05C19.95,16.83,17.2,19,17.5,19z" />
    </svg>
  </div>
  <div className="cloud-animate" style={{ position: "absolute", top: "0%", left: "60%", opacity: 0.8 }}>
    <svg width="400" height="400" viewBox="0 0 24 24" fill="white">
      <path d="M17.5,19c-3.03,0-5.5-2.47-5.5-5.5c0-0.23,0.02-0.45,0.05-0.67C9.17,12.35,7,10.42,7,8c0-2.21,1.79-4,4-4c0.55,0,1.07,0.11,1.53,0.32C13.4,2.83,15.07,2,17,2c3.31,0,6,2.69,6,6c0,0.34-0.03,0.67-0.08,1C23.59,9.33,24,10.11,24,11c0,1.66-1.34,3-3,3c-0.17,0-0.33-0.02-0.5-0.05C19.95,16.83,17.2,19,17.5,19z" />
    </svg>
  </div>
      <div style={{ marginBottom: "30px" }}>
      <h1 style={{ 
        fontSize: "3rem", 
        fontWeight: "800", 
        margin: "0", 
        color: "#333",
        letterSpacing: "-1px"
      }}>
        ANTEvents
      </h1>
      <p style={{ 
        fontSize: "1.1rem", 
        color: "#555", 
        lineHeight: "1.5",
        marginTop: "10px",
        padding: "0 10px"
      }}>
        Welcome to <strong>ANTEvents</strong>, your comprehensive collection of campus life! 
        Find your community and never miss a beat at UCI.
      </p>
    </div>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {isSignUp && (
        <>
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          <input name="email" placeholder="UCI Email" value={form.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input name="dorm" placeholder="Dorm Address" value={form.dorm} onChange={handleChange} />
          <button onClick={handleSignUp}>Sign Up</button>
        </>
      )}

      {!isSignUp && (
        <>
          <input name="email" placeholder="UCI Email" value={form.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <button onClick={handleSignIn}>Sign In</button>
        </>
      )}

      <p style={{ marginTop: 10 }}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Sign In" : "Sign Up"}
        </span>
      </p>

    <img 
  src="images.png" 
  alt="Peter the Anteater"
  className="peter-animate"
  style={{ 
    position: "absolute", 
    bottom: "15px", 
    left: "1%", 
    width: "auto", // Adjust based on your image size
    height: "550px",
    zIndex: 5,
    mixBlendMode: "multiply"
  }} 
/>
      
    </div>
  );
}