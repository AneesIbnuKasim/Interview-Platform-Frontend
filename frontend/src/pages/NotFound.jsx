import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center ring-glow">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the void</h2>
        <p className="mt-2 text-sm text-muted-foreground">That page doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
