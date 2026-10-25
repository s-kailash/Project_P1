import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="mt-2 inline-block text-blue-600 underline">
        Back to home
      </Link>
    </div>
  );
}