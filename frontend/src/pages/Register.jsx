import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { BrandPane } from "./Login";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/features/auth/authSlice";

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dispatch(loginSuccess({ id: "u1", name: name || "You", email }));
      navigate("/dashboard");
    }, 600);
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <BrandPane />
      <div className="flex items-center justify-center p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free during beta. Takes 30 seconds.</p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="outline"><Github size={16}/> GitHub</Button>
            <Button variant="outline"><Mail size={16}/> Google</Button>
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Full name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Ada Lovelace" className="mt-1"/>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1"/>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="relative mt-1">
                <Input type={show ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account…" : "Create account"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have one? <Link to="/login" className="text-foreground hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
