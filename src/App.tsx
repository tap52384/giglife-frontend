// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout"; // or "../layouts/Layout" depending on path
import Home from "./pages/Home";
import Login from "./pages/Login";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}
