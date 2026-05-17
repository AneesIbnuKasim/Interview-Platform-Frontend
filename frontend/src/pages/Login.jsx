import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/features/auth/authSlice";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <BrandPane />
      <FormPane />
    </div>
  );
}

export function BrandPane() {
  return (
    <div className="relative hidden overflow-hidden border-r border-border bg-card md:block">
      <div className="relative flex h-full flex-col justify-between p-10">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background">
            <Code2 size={16} />
          </span>
          <span className="text-lg">Pairloop</span>
        </Link>
        <div className="max-w-md">
          <h2 className="text-balance text-3xl font-semibold leading-tight">
            The calm, focused way to interview engineers.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Live editor, HD video, and chat — all in one workspace built for
            evaluating real signal.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border bg-background/45 p-3">
              Collaborative coding without leaving the room.
            </div>
            <div className="rounded-lg border border-border bg-background/45 p-3">
              Host controls, scheduling, chat, and screen share included.
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pairloop, Inc.
        </p>
      </div>
    </div>
  );
}

function FormPane() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { error, status } = useAppSelector((state) => state.auth);
  const loading = status === "loading";

  async function submit(e) {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch {
      // Error is rendered from Redux state.
    }
  }

  return (
    <div className="flex items-center justify-center bg-background p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in to continue to your dashboard.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <div className="relative mt-1">
              <Input
                type={show ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
