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
    </div>
  );
}