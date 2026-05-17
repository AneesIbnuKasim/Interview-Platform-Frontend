import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-xl p-8 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">404</h1>
        <h2 className="mt-4 text-lg font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-primary inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
