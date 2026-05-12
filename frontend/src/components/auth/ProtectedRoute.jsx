import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { getAccessToken } from "@/lib/authStorage";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { initialized, status, user } = useAppSelector((state) => state.auth);
  const hasToken = Boolean(getAccessToken());

  if (!initialized || status === "checking") {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
