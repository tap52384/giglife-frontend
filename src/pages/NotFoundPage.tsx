import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="mt-4">Page not found.</p>
      <Link to="/" className="text-blue-500 underline mt-2 block">
        Go back home
      </Link>
    </div>
  );
}
