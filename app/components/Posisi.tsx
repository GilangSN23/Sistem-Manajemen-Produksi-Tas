'use client';
import React, { useEffect, useState } from 'react';
import { getRoles, editRole, deleteRole, addRole } from '@/lib/api';

type Posisi = {
  id: number;
  roleWorker: string;
};

export default function DaftarPosisi() {
  const [posisi, setPosisi] = useState<Posisi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan.');
      }

      const data = await getRoles(token);

      const resultArray = Object.values(data).map((item: any) => ({
        id: item.role_id,
        roleWorker: item.roleworker,
      }));

      setPosisi(resultArray);
    } catch (err) {
      console.error('Gagal mengambil data posisi:', err);
    } finally {
      setLoading(false);
    }
  };
    fetchData();
  }, []);

  // Modal Hapus
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // Modal Tambah
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPosisi, setNewPosisi] = useState<string>("");

  // Modal Edit
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editPosisiId, setEditPosisiId] = useState<number | null>(null);
  const [editPosisi, setEditPosisi] = useState<string>("");

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setOpenDropdownId(null);
  };

  const openEditModal = (id: number) => {
    const posisiToEdit = posisi.find(p => p.id === id);
    if (posisiToEdit) {
      setEditPosisiId(id);
      setEditPosisi(posisiToEdit.roleWorker);
      setShowEditModal(true);
      setOpenDropdownId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        console.log("Token saat delete:", token);
        console.log("ID yang mau dihapus:", deleteId);

        await deleteRole(deleteId, token);

        setPosisi((prev) => prev.filter((p) => p.id !== deleteId));
        setDeleteId(null);

        alert("Role berhasil dihapus!");
      } catch (error: any) {
        console.error("Error saat delete:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddPosisi = async () => {
    if (newPosisi.trim()) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan");

        console.log("newPosisi trim:", newPosisi.trim());
        await addRole(token, newPosisi.trim());

        // Update UI setelah berhasil tambah
        setPosisi([...posisi, { id: posisi.length + 1, roleWorker: newPosisi }]);
        setNewPosisi("");
        setShowAddModal(false);
        alert("Role berhasil ditambahkan!");
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Gagal menambahkan role.");
      }
    }
  };

  const handleUpdatePosisi = async () => {
    if (editPosisi.trim() && editPosisiId !== null) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan");

        await editRole(token, editPosisiId, editPosisi.trim());

        // Update state lokal setelah berhasil update di server
        setPosisi((prev) =>
          prev.map((p) =>
            p.id === editPosisiId ? { ...p, roleWorker: editPosisi.trim() } : p
          )
        );

        setShowEditModal(false);
        setEditPosisiId(null);
        setEditPosisi("");
      } catch (error: any) {
        alert(error.message || "Gagal mengupdate posisi");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
  <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
      <h1 className="text-xl md:text-2xl font-bold text-black mb-2 sm:mb-0">Data Posisi Pekerjaan</h1>
      <button
        className="btn-simpan mt-3 px-4 py-2 rounded"
        onClick={() => setShowAddModal(true)}
      >
        + Tambah Posisi
      </button>
    </div>

    {loading ? (
      <p className="text-gray-600 text-center py-10">Memuat data posisi...</p>
    ) : (
      <div className="bg-white p-4 rounded-lg w-full max-w-full">
        {/* Pembungkus scroll */}
        <div className="overflow-auto max-h-84 w-full border border-gray-200 rounded scrollbar-hide">
          {/* Biar tabelnya lebar minimal supaya scroll keluar */}
          <table className="min-w-[800px] w-full">
            <thead>
              <tr className="bg-[#E0E2E4] text-left text-sm font-semibold text-gray-600 sticky top-0 z-20">
                <th className="py-3 px-4">Posisi</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posisi.map((p) => (
                <tr key={p.id} className="hover:bg-[#F5F5F5] relative">
                  <td className="py-3 px-4 text-sm text-gray-700">{p.roleWorker}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleDropdown(p.id)}
                      className="text-2xl font-bold px-2 hover:bg-gray-200 rounded"
                    >
                      &#8230;
                    </button>
                    {openDropdownId === p.id && (
                      <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-300 rounded shadow-md z-10">
                        <button
                          onClick={() => openEditModal(p.id)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(p.id)}
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

    {/* Modal Tambah */}
    {showAddModal && (
      <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg animate-slide-up-fade"
        >
          <h2 className="text-lg font-semibold mb-4 text-center">Tambah Posisi</h2>
          <input
            type="text"
            value={newPosisi}
            onChange={(e) => setNewPosisi(e.target.value)}
            placeholder="Nama posisi"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddPosisi}
            className="w-full btn-simpan mt-3 px-4 py-2 rounded"
          >
            Simpan
          </button>
          <button
            onClick={() => setShowAddModal(false)}
            className="w-full btn-kembali mt-3 px-4 py-2 rounded"
          >
            Kembali
          </button>
        </div>
      </div>
    )}

    {/* Modal Edit */}
    {showEditModal && (
      <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg animate-slide-up-fade"
        >
          <h2 className="text-lg font-semibold mb-4 text-center">Edit Posisi</h2>
          <input
            type="text"
            value={editPosisi}
            onChange={(e) => setEditPosisi(e.target.value)}
            placeholder="Nama posisi"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUpdatePosisi}
            disabled={loading}
            className="w-full btn-simpan mt-3 px-4 py-2 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            onClick={() => setShowEditModal(false)}
            className="w-full btn-kembali mt-3 px-4 py-2 rounded"
          >
            Kembali
          </button>
        </div>
      </div>
    )}

    {/* Modal Konfirmasi Hapus */}
    {deleteId !== null && (
      <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg mx-4">
          <h2 className="text-lg font-semibold mb-4 text-center">Konfirmasi Hapus</h2>
          <p className="mb-6 text-center">Yakin ingin menghapus posisi ini?</p>
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
  </div>
);
}