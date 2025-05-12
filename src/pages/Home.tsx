// src/pages/Home.tsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Join Gig Life — your next gig starts here
      </h1>
      <h1 className="text-4xl font-bold text-red-500 bg-yellow-100 p-4 rounded">
  Tailwind is working!
</h1>
      <p className="max-w-xl text-muted-foreground text-lg">
        Get local, vetted moving job leads. Fast, fair, and flexible.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Sign In
        </Link>
        <Link
          to="/login"
          className="rounded-md border px-6 py-3 hover:bg-gray-100"
        >
          Register Now
        </Link>
      </div>
    </section>
  );
}
