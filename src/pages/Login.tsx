// src/pages/Login.tsx
import { useState, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, sendSignInLinkToEmail, getAuth, signInWithEmailLink } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
  const [mode, setMode] = useState<"phone" | "email">("phone");

  // Shared
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Phone auth
  const [phone, setPhone] = useState("");

  // Email link auth
  const [email, setEmail] = useState("");

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Initialize invisible reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSendPhoneCode = async () => {
    setupRecaptcha();
    try {
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      alert("Verification code sent to phone");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerifyPhoneCode = async () => {
    try {
      const result = await confirmationResult.confirm(code);
      alert("Phone login successful!");
    } catch (err: any) {
      alert("Invalid verification code");
    }
  };

  const handleSendEmailLink = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin + "/login",
        handleCodeInApp: true
      });
      window.localStorage.setItem("emailForSignIn", email);
      alert("Email link sent. Check your inbox.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerifyEmailLink = async () => {
    const storedEmail = window.localStorage.getItem("emailForSignIn");
    if (storedEmail && window.location.href.includes("signIn")) {
      try {
        await signInWithEmailLink(auth, storedEmail, window.location.href);
        alert("Email login successful!");
      } catch (err: any) {
        alert("Email login failed.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-md py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In or Register</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setMode("phone")}
          className={`px-4 py-2 rounded ${mode === "phone" ? "bg-black text-white" : "bg-gray-200"}`}>Phone</button>
        <button onClick={() => setMode("email")}
          className={`px-4 py-2 rounded ${mode === "email" ? "bg-black text-white" : "bg-gray-200"}`}>Email</button>
      </div>

      {mode === "phone" ? (
        <>
          <input
            type="tel"
            placeholder="+1 555 555 5555"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={handleSendPhoneCode} className="w-full bg-black text-white py-2 rounded mb-4">
            Send Code
          </button>
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
      ) : (
        <>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={handleSendEmailLink} className="w-full bg-black text-white py-2 rounded">
            Send Sign-in Link
          </button>
        </>
      )}

      <p className="text-sm text-center text-muted-foreground mt-8">
        By signing in, you agree to the <a href="/tos" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>

      <div ref={recaptchaContainerRef} id="recaptcha-container"></div>
    </div>
  );
}
