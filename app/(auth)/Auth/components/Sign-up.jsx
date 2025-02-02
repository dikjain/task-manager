'use client';

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignUp({ setIsSignIn }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  }

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/Auth/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError(err?.errors?.[0]?.message || "Failed to sign up with Google");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 w-full backdrop-blur-sm bg-black/30 transition-all duration-500 ease-in-out ${isInputFocused ? 'opacity-100 z-[150]' : 'opacity-0 z-0'}`} />
      <div className="flex items-center justify-center  p-4 sm:p-5 lg:p-6 bg-gray-100 relative px-4">
        <div className="w-full max-w-md relative z-[160] backdrop-blur-md bg-white rounded-xl shadow-lg border border-indigo-100 p-4">
          <div className="space-y-4 p-6">
            <div className="text-4xl font-bold text-center text-indigo-900">
              TaskMaster
            </div>
            <p className="text-center text-gray-600 font-medium">
              Organize. Prioritize. Succeed.
            </p>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-4 mb-6">
              <button 
                type="button" 
                className="w-full flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 gap-3 transition-all p-3 rounded-xl hover:shadow-md transform hover:-translate-y-0.5"
                onClick={signUpWithGoogle}
                disabled={isLoading}
              >
                <img src="/google.png" alt="Google" className="w-5 imgbox" />
                Continue with Google
              </button>
            </div>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or sign up with email</span>
              </div>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">Email</label>
                <input
                  type="email"
                  id="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  required
                  disabled={isLoading}
                  className="w-full p-3 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-all bg-white"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    required
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-all bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-shake">
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all p-3 rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
          <div className="border-t border-gray-200 p-4 text-center bg-gray-50 rounded-b-xl">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsSignIn(true)}
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors hover:underline"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
