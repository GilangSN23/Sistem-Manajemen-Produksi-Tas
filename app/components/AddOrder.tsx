'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";
import { addOrder } from "@/lib/api";

const AddOrder = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [orderType, setOrderType] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const submitOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda belum login!");
      return;
    }

    const newOrder = {
      order_name: name,
      typeorder: orderType,
      quantity: Number(quantity),
      note: description,
      start_date: startDate,
      due_date: deadline,
    };

    try {
      await addOrder(token, newOrder);
      alert("Pesanan berhasil ditambahkan!");
      router.push("/Dashboard");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Terjadi kesalahan saat menambahkan pesanan.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-center text-3xl font-bold mb-8">Tambah Pesanan</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Nama Pesanan
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nama Pesanan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="orderType" className="block mb-1 font-medium">
            Jenis Pesanan
          </label>
          <input
            id="orderType"
            type="text"
            placeholder="Jenis Pesanan"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block mb-1 font-medium">
            Jumlah Pesanan
          </label>
          <input
            id="quantity"
            type="text"
            placeholder="Jumlah Pesanan"
            value={quantity === "" ? "" : quantity}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setQuantity(value === "" ? "" : Number(value));
              }
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Keterangan
          </label>
          <textarea
            id="description"
            placeholder="Keterangan"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block mb-1 font-medium">
              Tanggal Mulai
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block mb-1 font-medium">
              Batas Waktu
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full btn-simpan text-black py-2 rounded hover:bg-blue-700 transition mb-1"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => router.push("/Dashboard")}
            className="w-full btn-kembali text-black py-2 rounded hover:bg-gray-300 transition"
          >
            Kembali
          </button>
        </div>
      </form>

      {/* Modal konfirmasi */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg animate-slide-up-fade">
            <h2 className="text-2xl font-bold mb-4 text-center">Apakah Anda Yakin?</h2>
            <p className="text-sm text-center mb-6">
              Setelah melakukan validasi data, pesanan akan masuk ke dalam list pesanan.
            </p>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => {
                  submitOrder();
                  setShowConfirmModal(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                aria-label="Konfirmasi Simpan"
              >
                <FaCheck /> Simpan
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  router.push("/AddOrder");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                aria-label="Batal Simpan"
              >
                <FaTimes /> Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
