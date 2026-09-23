import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await credential.user.getIdToken();
      const data = await loginUser({ idToken });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const firebaseCode = error?.code as string | undefined;
      const firebaseMessages: Record<string, string> = {
        "auth/invalid-credential": "The email or password is incorrect.",
        "auth/invalid-login-credentials": "The email or password is incorrect.",
        "auth/user-not-found": "The email or password is incorrect.",
        "auth/wrong-password": "The email or password is incorrect.",
        "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      };

      if (error?.request && !error?.response) {
        toast.error("The AgriLedger server is not running. Start both the frontend and API, then try again.");
        return;
      }

      toast.error(
        error.response?.data?.error ||
          (firebaseCode && firebaseMessages[firebaseCode]) ||
          "Unable to sign in. Please try again.",
      );
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0c2615]">
      {/* Left Side - Branding */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 bg-brand-dark">
        <div className="max-w-md flex flex-col items-center text-center">
          <img
            src="/white-logo.png"
            alt="AgriLedger Logo"
            className="w-80 lg:w-[28rem] md:w-[28rem] mb-8"
          />
          <p className="text-white text-xl md:text-2xl font-medium leading-relaxed -translate-y-10">
            Track Harvest, Payments and
            <br />
            Producer Accounts in one place.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-[#12331f]">
        <div className="w-full max-w-md flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Login
          </h1>
          <p className="text-white/70 text-base mb-10">
            Sign in to your AGRILedger account.
          </p>

          <form className="flex flex-col" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="johndoe@agriledger.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-white/20 rounded-lg pl-4 pr-12 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-colors tracking-[0.2em]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#dfa43a] hover:bg-[#c9902c] disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-colors text-base"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
