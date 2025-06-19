'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !password) {
      setErrorMsg("Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(name.trim(), password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", name.trim());
      alert("Login berhasil!");
      router.push("/Dashboard");
    } catch (error: any) {
      setErrorMsg(error.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-6">Login</h2>

        {errorMsg && (
          <p className="mb-4 text-red-600 text-center font-semibold">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Masukkan username"
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password karyawan"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

          <button
            type="submit"
            className={`w-full py-2 btn-simpan text-black rounded ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
