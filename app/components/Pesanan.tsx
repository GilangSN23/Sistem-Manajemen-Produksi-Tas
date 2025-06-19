'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { getOrders, deleteOrder } from '@/lib/api';

type Pesanan = {
  order_id: number;
  order_name: string;
  typeorder: string;
  quantity: number;
  start_date: string;
  due_date: string;
  statusorder: 'Diproses' | 'Selesai';
};

export default function Pesanan() {
  const [pesananData, setPesananData] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Tidak ada token');

        const response = await getOrders(token, 1);
        setPesananData(response.data);
      } catch (err: any) {
        console.error("Gagal fetch:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Tidak ada token');

      await deleteOrder(token, deleteId);

      setPesananData(prev => prev.filter(item => item.order_id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert(`Gagal menghapus pesanan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Data Pesanan</h1>
      {loading ? (
        <p className="text-gray-600">Memuat data pesanan...</p>
      ) : (
        <div className="bg-white p-4 rounded-lg w-full max-w-full">
          {/* Wrapping container dengan fixed height dan overflow */}
          <div className="max-h-84 overflow-y-auto overflow-x-auto border border-gray-200 rounded scrollbar-hide">
            <table className="min-w-[800px] w-full border-collapse">
              <thead className="sticky top-0 bg-[#E0E2E4] z-30">
              <tr className="bg-[#E0E2E4] text-left text-sm font-semibold text-gray-600">
                <th className="py-3 px-4">Nama Pesanan</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Jumlah</th>
                <th className="py-3 px-4">Rentang Waktu</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pesananData.map((pesanan) => (
                <tr key={pesanan.order_id} className="hover:bg-[#F5F5F5]">
                  <td className="py-3 px-4 text-sm text-gray-700">{pesanan.order_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{pesanan.typeorder}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{pesanan.quantity}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(pesanan.start_date).toLocaleDateString()} -{' '}
                    {new Date(pesanan.due_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      pesanan.statusorder === 'Selesai'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {pesanan.statusorder}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Link href={`/DetailPesanan/${pesanan.order_id}`}>
                      <button
                        type="button"
                        className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded cursor-pointer"
                      >
                        Detail
                      </button>
                    </Link>
                    <button
                      onClick={() => confirmDelete(pesanan.order_id)}
                      className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg mx-4">
            <h2 className="text-lg font-semibold mb-4 text-center">Konfirmasi Hapus</h2>
            <p className="mb-6 text-center">Yakin ingin menghapus data pesanan ini?</p>
            <div className="flex justify-center gap-4">
              <button onClick={cancelDelete} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
                Batal
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
