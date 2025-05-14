// src/pages/CompleteProfile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [missingField, setMissingField] = useState<"email" | "phone" | null>(null);

  useEffect(() => {
    const contextRaw = localStorage.getItem("login_context");
    const token = localStorage.getItem("firebase_id_token");
    if (!contextRaw || !token) {
      navigate("/login");
      return;
    }
    try {
      const context = JSON.parse(contextRaw);
      if (context.missing === "email" || context.missing === "phone") {
        setMissingField(context.missing);
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const validate = (val: string): boolean => {
    if (!val) return false;
    if (missingField === "email") {
      const emailPattern = /^[^@\s]+\+?[^@\s]*@[^@\s]+\.[^@\s]+$/;
      return emailPattern.test(val);
    } else if (missingField === "phone") {
      const digits = val.replace(/\D/g, "");
      return digits.length === 10;
    }
    return false;
  };

  const handleSubmit = async () => {
    setError("");
    const token = localStorage.getItem("firebase_id_token");
    if (!token || !validate(value)) {
      setError("Invalid input");
      return;
    }

    setSubmitting(true);
    const payload = missingField === "email" ? { email: value } : { phone: value };

    try {
      const res = await fetch("/api/register_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.status === 401 && result.action === "signout_and_redirect") {
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (res.status === 200 && result.uid) {
        localStorage.setItem("giglife_user", JSON.stringify(result));
        navigate("/dashboard");
      } else {
        setError(result.message || "Failed to complete registration");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
      {missingField && (
        <>
          <label htmlFor="value" className="block mb-1 text-sm">
            {missingField === "email" ? "Email address" : "Phone number"}
          </label>
          <input
            id="value"
            type={missingField === "email" ? "email" : "tel"}
            placeholder={missingField === "email" ? "you@example.com" : "555-555-5555"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded mb-1"
          />
          {error && <p className="text-red-500 bg-yellow-100 rounded px-2 py-1 text-sm mb-2">{error}</p>}
          <button
            disabled={!validate(value) || submitting}
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
