// src/layouts/Layout.tsx
import { ReactNode } from "react";
import Navbar from "../components/Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
