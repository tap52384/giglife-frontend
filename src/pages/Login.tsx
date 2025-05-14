// src/pages/Login.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  onAuthStateChanged,
  getIdToken,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

// Extend window for recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firebaseError, setFirebaseError] = useState("");
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const registerUser = async (token: string) => {
    try {
      const res = await fetch("/api/register_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (res.status === 401 && result.action === "signout_and_redirect") {
        await signOut(auth);
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (result.requires_additional_verification) {
        localStorage.setItem("firebase_id_token", token);
        localStorage.setItem("login_context", JSON.stringify({
          method: mode,
          missing: mode === "phone" ? "email" : "phone"
        }));
        navigate("/complete-profile");
        return;
      }

      localStorage.setItem("firebase_id_token", token);
      localStorage.setItem("giglife_user", JSON.stringify(result));
      navigate("/dashboard");
    } catch (err) {
      alert("Login succeeded but user registration failed.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        await registerUser(token);
      }
    });
    return unsubscribe;
  }, [navigate]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleSendPhoneCode = async () => {
    setPhoneError("");
    setFirebaseError("");
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      setPhoneError("Please enter a valid 10-digit US phone number.");
      return;
    }
    const formattedPhone = `+1${digitsOnly}`;
    setupRecaptcha();
    try {
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      alert("Verification code sent to phone");
    } catch (err: any) {
      setFirebaseError(err.message || "Failed to send verification code.");
    }
  };

  const handleVerifyPhoneCode = async () => {
    try {
      const result = await confirmationResult.confirm(code);
      const token = await result.user.getIdToken();
      await registerUser(token);
    } catch (err: any) {
      alert("Invalid verification code");
    }
  };

  const handleSendEmailLink = async () => {
    setEmailError("");
    setFirebaseError("");
    const emailPattern = /^[^@\s]+\+?[^@\s]*@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin + "/login",
        handleCodeInApp: true,
      });
      window.localStorage.setItem("emailForSignIn", email);
      alert("Email link sent. Check your inbox.");
    } catch (err: any) {
      setFirebaseError(err.message || "Failed to send email link.");
    }
  };

  useEffect(() => {
    const storedEmail = window.localStorage.getItem("emailForSignIn");
    if (storedEmail && window.location.href.includes("login")) {
      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then(async (result) => {
          const token = await result.user.getIdToken();
          await registerUser(token);
        })
        .catch(() => alert("Email login failed."));
    }
  }, [navigate]);

  useEffect(() => {
    if (mode === "phone" && phoneInputRef.current) {
      phoneInputRef.current.focus();
    } else if (mode === "email" && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [mode]);

  const handleToggleMode = () => {
    setMode((prev) => (prev === "phone" ? "email" : "phone"));
  };

  return (
    <div className="mx-auto max-w-md py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In or Register</h1>

      {mode === "phone" ? (
        <>
          <input
            type="tel"
            ref={phoneInputRef}
            placeholder="555-555-5555"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded mb-1"
          />
          {phoneError && <p className="text-red-500 bg-yellow-100 rounded px-2 py-1 text-sm mb-2">{phoneError}</p>}
          {firebaseError && <p className="text-red-500 bg-yellow-100 rounded px-2 py-1 text-sm mb-2">{firebaseError}</p>}
          <button onClick={handleSendPhoneCode} className="w-full bg-black text-white py-2 rounded mb-4">
            Send Code
          </button>
          {confirmationResult && (
            <>
              <input
                type="text"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <button onClick={handleVerifyPhoneCode} className="w-full bg-black text-white py-2 rounded">
                Verify & Sign In
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <input
            type="email"
            ref={emailInputRef}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-1"
          />
          {emailError && <p className="text-red-500 bg-yellow-100 rounded px-2 py-1 text-sm mb-2">{emailError}</p>}
          {firebaseError && <p className="text-red-500 bg-yellow-100 rounded px-2 py-1 text-sm mb-2">{firebaseError}</p>}
          <button onClick={handleSendEmailLink} className="w-full bg-black text-white py-2 rounded">
            Send Sign-in Link
          </button>
        </>
      )}

      <div className="text-center mt-6">
        <button
          onClick={handleToggleMode}
          className="text-sm text-gray-600 hover:underline bg-transparent border-none"
          aria-label={mode === "phone" ? "Use email address instead" : "Use phone number instead"}
        >
          {mode === "phone" ? "Use email address instead" : "Use phone number instead"}
        </button>
      </div>

      <p className="text-sm text-center text-muted-foreground mt-8">
        By signing in, you agree to the <a href="/tos" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>

      <div ref={recaptchaContainerRef} id="recaptcha-container"></div>
    </div>
  );
}
