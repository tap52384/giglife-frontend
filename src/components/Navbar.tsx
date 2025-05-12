// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Gig Life
        </Link>
        <nav className="space-x-4">
          <Link to="/login" className="text-sm font-medium hover:underline">
            Sign In / Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
