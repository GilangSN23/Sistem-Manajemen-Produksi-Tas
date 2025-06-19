'use client';

import { useState } from "react";
import {SidebarDemo} from "@/components/sidebarDemo"; // default import
import Dashboard from "@/components/Dashboard";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/Login");
  const [identifier, setIdentifier] = useState(""); // email/username
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      alert("Email/Username dan password wajib diisi.");
      return;
    }

    // Simulasi login sukses
    if (identifier && password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-center mb-6">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email atau Username
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-500"
                placeholder="Masukkan email atau username"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-500"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarDemo />
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <Dashboard />
      </div>
    </div>
  );
}
