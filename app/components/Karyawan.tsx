'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from "next/navigation";
import { fetchWorkers, updateWorker, getRoles, deleteWorker } from '@/lib/api';

type Karyawan = {
  worker_id: number;
  name: string;
  roleworker: string;
  email: string;
  password: string;
};

export default function DaftarKaryawan() {
  const router = useRouter();
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token tidak ditemukan.");

        const data = await fetchWorkers(token);
        setKaryawan(data);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWorkers();
  }, []);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editKaryawan, setEditKaryawan] = useState<Karyawan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null); // ini harus ada supaya bisa simpan id yg mau dihapus

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Tombol delete di dropdown hanya set id yg mau dihapus, popup muncul
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setOpenDropdownId(null);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Jika klik "Hapus" di popup, baru hapus data
  const handleDelete = async () => {
  if (deleteId !== null) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token tidak ditemukan.");

      await deleteWorker(deleteId, token);
      setKaryawan(prev => prev.filter(k => k.worker_id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      alert(error.message || "Gagal menghapus karyawan.");
    }
  }
};

  const handleEdit = (id: number) => {
    const k = karyawan.find(k => k.worker_id === id);
    if (k) {
      setEditKaryawan(k);
    }
    setOpenDropdownId(null);
  };

  const handleDetail = (id: number) => {
    router.push(`/DetailKaryawan/${id}`);
  };

  // Simpan data dari popup edit
  const handleSave = (updated: Karyawan) => {
    setKaryawan(prev =>
      prev.map(k => (k.worker_id === updated.worker_id ? updated : k))
    );
    setEditKaryawan(null);
  };

  const handleClosePopup = () => {
    setEditKaryawan(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Daftar Karyawan</h1>
        <button
          className="btn-simpan mt-3 px-4 py-2 rounded"
          onClick={() => router.push("/AddKaryawan")}
        >
          + Tambah Karyawan
        </button>
      </div>

      {loading ? (
      <p className="text-gray-600">Memuat data karyawan...</p>
    ) : (
        <div className="bg-white p-4 rounded-lg w-full max-w-full">
        {/* Pembungkus scroll */}
        <div className="overflow-auto max-h-84 w-full border border-gray-200 rounded scrollbar-hide">
          <table className="min-w-[800px] w-full">
            <thead>
              <tr className="bg-[#E0E2E4] text-left text-sm font-semibold text-gray-600 sticky top-0 z-20">
                <th className="py-3 px-4">Nama Karyawan</th>
                <th className="py-3 px-4">Posisi</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Password</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {karyawan.map((k) => (
                <tr key={k.worker_id} className="hover:bg-[#F5F5F5] relative">
                  <td className="py-3 px-4 text-sm text-gray-700">{k.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{k.roleworker}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{k.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{k.password}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleDropdown(k.worker_id)}
                      className="text-2xl leading-none font-bold px-2 hover:bg-gray-200 rounded"
                      aria-label="Menu aksi"
                    >
                      &#8230;
                    </button>

                    {openDropdownId === k.worker_id && (
                      <div className="absolute right-4 mt-8 w-28 bg-white border border-gray-300 rounded shadow-md z-10">
                        <button
                          onClick={() => {
                            handleDetail(k.worker_id);
                            setOpenDropdownId(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Detail
                        </button>

                        <button
                          onClick={() => {
                            handleEdit(k.worker_id);
                            setOpenDropdownId(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(k.worker_id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

      {/* Popup Konfirmasi Delete */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg mx-4">
            <h2 className="text-lg font-semibold mb-4 text-center">Konfirmasi Hapus</h2>
            <p className="mb-6 text-center">Yakin ingin menghapus data karyawan ini?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Edit */}
      {editKaryawan && (
        <EditKaryawanPopup
          karyawan={editKaryawan}
          onClose={handleClosePopup}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function EditKaryawanPopup({
  karyawan,
  onClose,
  onSave,
}: {
  karyawan: Karyawan;
  onClose: () => void;
  onSave: (updated: Karyawan) => void;
}) {
  const [nama, setNama] = useState(karyawan.name);
  const [roles, setRoles] = useState<{ role_id: number; roleworker: string }[]>([]);
  const [posisi, setPosisi] = useState(karyawan.roleworker);
  const [email, setEmail] = useState(karyawan.email);
  const [password, setPassword] = useState(karyawan.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNama(karyawan.name);
    setEmail(karyawan.email);
    setPassword(karyawan.password);
    setPosisi(karyawan.roleworker);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan");
      return;
    }

    getRoles(token)
      .then((data) => {
        console.log("roles data:", data);
        setRoles(data);
        const role = roles.find(r => r.roleworker === posisi);
        setPosisi(role ? role.roleworker : '');
      })
      .catch((err) => setError(err.message));
  }, [karyawan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token tidak ditemukan.");

      const role = roles.find(r => r.roleworker === posisi);
      if (!role) {
        setError("Posisi tidak valid");
        return;
      }

      const updatedData = {
        name: nama,
        email,
        password,
        role_id: role.role_id,
      };

      const updated = await updateWorker(karyawan.worker_id, updatedData, token);

      // sesuaikan kalau response berbeda
      onSave({
        worker_id: karyawan.worker_id,
        name: updated.name || nama,
        email: updated.email || email,
        password: updated.password || password,
        roleworker: posisi,
      });
      onClose();
      alert("Data karyawan berhasil diperbarui!");
    } catch (err: any) {
      alert(err.message || "Gagal update karyawan.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg animate-slide-up-fade">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Data Karyawan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nama */}
          <div className="flex items-center gap-3">
            <label className="w-40 text-sm font-medium text-gray-700">Nama Karyawan:</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Posisi (dropdown) */}
          <div className="flex items-center gap-3">
            <label className="w-40 text-sm font-medium text-gray-700">Posisi:</label>
            <select
              value={posisi}
              onChange={(e) => setPosisi(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Pilih Posisi</option>
              {roles.map(role => (
                <option key={role.role_id} value={role.roleworker}>
                  {role.roleworker}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <label className="w-40 text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Password with toggle */}
          <div className="flex items-center gap-3">
            <label className="w-40 text-sm font-medium text-gray-700">Password:</label>
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring focus:ring-blue-500"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full btn-simpan px-4 py-2 rounded"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-kembali px-4 py-2 rounded"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}