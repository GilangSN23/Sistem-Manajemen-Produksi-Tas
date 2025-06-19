'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from 'lucide-react';
import { getRoles, addWorker } from "@/lib/api";

interface Role {
  role_id: number;
  roleworker: string;
}

export default function TambahKaryawan() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [roleid, setRoleId] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await getRoles(token);
      setRoles(response); 
    } catch (error) {
      console.error("Gagal mengambil role:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  fetchData();
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama || !roleid || !email || !password) {
      alert("Semua kolom harus diisi.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || "";

      await addWorker({
        name: nama,
        email,
        password,
        role_id: Number(roleid),
      },
      token);

      alert("Karyawan berhasil ditambahkan!");
      router.push("/Karyawan");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Terjadi kesalahan saat menambahkan karyawan.");
    }
  };

  console.log("roles:", roles);
  return (
    <div className="container mx-auto mt-10 px-4 max-w-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Tambah Karyawan</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {/* Nama */}
        <div className="mb-6">
          <label htmlFor="nama" className="block mb-2 font-semibold text-gray-700">
            Nama Karyawan
          </label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Posisi */}
        <div className="mb-6">
          <label htmlFor="posisi" className="block mb-2 font-semibold text-gray-700">
            Posisi Karyawan
          </label>
          <select
            id="posisi"
            value={roleid}
            onChange={(e) => setRoleId(Number(e.target.value))}
            required
            className="w-full border px-3 py-2 rounded-md bg-white"
          >
            <option value="">Pilih posisi</option>
            {Array.isArray(roles) && roles.length > 0 ? (
              roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.roleworker}
                </option>
              ))
            ) : (
              <option disabled>Loading roles atau data kosong</option>
            )}
          </select>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
            Email Karyawan
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
            Password Karyawan
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 pr-10 rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full btn-simpan text-black py-2 rounded-md font-semibold">
          Simpan
        </button>
        <button
          type="button"
          onClick={() => router.push('/Karyawan')}
          className="w-full mt-4 py-2 rounded-md border btn-kembali font-semibold"
        >
          Kembali
        </button>
      </form>
    </div>
  );
}