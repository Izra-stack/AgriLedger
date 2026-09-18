import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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
              className="w-full bg-[#dfa43a] hover:bg-[#c9902c] text-white font-bold py-4 rounded-lg transition-colors text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
