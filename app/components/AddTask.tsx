'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';
import { addTask, getRoles, fetchWorkers, getOrders } from '@/lib/api';
import jsPDF from 'jspdf';

const AddTask = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId'); 

  const [task, setTask] = useState('');        
  const [name, setName] = useState('');        
  const [order, setOrder] = useState('');    
  const [quantity, setQuantity] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) return;

      setToken(savedToken);

      try {
        const [rolesRes, workersRes, ordersRes] = await Promise.all([
          getRoles(savedToken),
          fetchWorkers(savedToken),
          getOrders(savedToken),
        ]);

        setRoles(rolesRes || []);
        setWorkers(workersRes || []);
        setOrders(ordersRes.data || []);

        if (orderId) {
          setOrder(orderId.toString());
        }

      } catch (err) {
        console.error('Gagal mengambil data:', err);
      }
    };

    fetchData();
  }, [orderId]);

  const selectedOrder = orders.find(o => o.order_id.toString() === order);

  const isDateValid = () => {
    if (!selectedOrder) return false;
    if (!startDate || !deadline) return false;

    return (
      startDate >= selectedOrder.start_date &&
      deadline <= selectedOrder.due_date
    );
  };

  const validateForm = () => {
    if (!token) {
      alert('Token tidak ditemukan, silakan login ulang.');
      return false;
    }

    if (!order || !name || !task || !quantity || !startDate || !deadline) {
      alert('Semua field wajib diisi dengan benar.');
      return false;
    }

    if (!isDateValid()) {
      alert(`Tanggal mulai dan deadline harus berada di antara tanggal pesanan:\nMulai: ${selectedOrder?.start_date}\nDeadline: ${selectedOrder?.due_date}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    const success = await submitTask();

    setIsSaving(false);

    if (success) {
      setShowPopup(true);
    }
  };

  // Submit data ke API
  const submitTask = async () => {
    if (!validateForm()) return false;

    const payload = {
      order_id: Number(order),
      worker_id: Number(name),
      role_id: Number(task),
      quantity: Number(quantity),
      note: description,
      start_date: startDate,
      due_date: deadline,
    };

    try {
      setIsSaving(true);
      await addTask(token, payload);
      setIsSaving(false);
      return true;
    } catch (error: any) {
      setIsSaving(false);
      alert(error.message || 'Gagal menambahkan penugasan.');
      return false;
    }
  };

  // Generate PDF SPK
  const generatePDF = async() => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('Surat Perintah Kerja (SPK)', 105, 20, undefined, 'center');

    // Garis bawah judul
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    // Set font normal untuk isi
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Posisi X dan Y
    const labelX = 14;
    const colonX = 60;
    const valueX = 70;
    let currentY = 35;
    const lineHeight = 8;

    // Ambil data yang dibutuhkan
    const orderName = selectedOrder?.order_name || '-';
    const workerName = workers.find(w => w.worker_id.toString() === name)?.name || '-';
    const roleName = roles.find(r => r.role_id.toString() === task)?.roleworker || '-';
    const taskQty = quantity || '-';
    const taskNote = description || '-';
    const start = startDate || '-';
    const due = deadline || '-';

    // Fungsi buat baris data
    const drawRow = (label, value) => {
      doc.text(label, labelX, currentY);
      doc.text(":", colonX, currentY);
      doc.text(String(value), valueX, currentY);
      currentY += lineHeight;
    };

    drawRow("Nama Pesanan", orderName);
    drawRow("Nama", workerName);
    drawRow("Posisi", roleName);
    drawRow("Jumlah Target", taskQty);
    drawRow("Tanggal Mulai", start);
    drawRow("Deadline", due);
    drawRow("Keterangan", taskNote);

    const tanggal = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    doc.text(`Surakarta, ${tanggal}`, 140, currentY + 8);
    doc.text('Manajer', 140, currentY + 16);
    doc.text('Bu Hartono', 140, currentY + 28);

    doc.setFontSize(40);
    doc.setTextColor(150);
    doc.text('Tas Bu Hartono', 105, 150, { align: 'center', angle: 45 });

    doc.save(`SPK_${orderName}_${workerName}_${Date.now()}.pdf`);
  };

  // Tombol Cetak SPK di popup
  const handleCetakSPK = async () => {
    setShowPopup(false);
    await generatePDF(); 
    router.push('/Dashboard');
  };

  const handleBackToDashboard = () => {
    if (orderId) {
      router.push(`/DetailPesanan/${orderId}`); 
    } else {
      router.push('/Dashboard'); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold py-3 mb-6">Tambah Penugasan</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Dropdown Tugas */}
        <div>
          <label htmlFor="task" className="block mb-2 font-medium text-gray-700">Tugas</label>
          <select
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Tugas</option>
            {roles.map((r) => (
              <option key={r.role_id} value={r.role_id}>{r.roleworker}</option>
            ))}
          </select>
        </div>

        {/* Dropdown Nama */}
        <div>
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Nama</label>
          <select
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Nama</option>
            {workers.map((w) => (
              <option key={w.worker_id} value={w.worker_id}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Dropdown Pesanan */}
        <div>
          <label htmlFor="order" className="block mb-2 font-medium text-gray-700">Nama Pesanan</label>
          <select
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            required
            disabled={!!orderId} // kalau orderId ada, disable dropdown
            className={`w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${orderId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">Pilih Pesanan</option>
            {orders.map((o) => (
              <option key={o.order_id} value={o.order_id}>
                {o.order_name}
              </option>
            ))}
          </select>
          {selectedOrder && (
            <p className="text-xs text-gray-500 mt-1">
              Rentang Pesanan: {selectedOrder.start_date} sampai {selectedOrder.due_date}
            </p>
          )}
        </div>

        {/* Jumlah */}
        <div>
          <label htmlFor="quantity" className="block mb-2 font-medium text-gray-700">Jumlah Pesanan</label>
          <input
            id="quantity"
            type="text"
            value={quantity === "" ? "" : quantity}
            onChange={(e) => {
              const val = e.target.value;
              setQuantity(val === '' ? '' : Number(val));
            }}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedOrder?.quantity && (
            <p className="text-xs text-gray-500 mt-1">
              Total kuantitas pesanan ini: {selectedOrder.quantity}
            </p>
          )}
        </div>

        {/* Keterangan */}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Keterangan</label>
          <textarea
            id="description"
            placeholder="Keterangan"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Tanggal Mulai & Deadline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block mb-2 font-medium text-gray-700">Tanggal Mulai</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={selectedOrder?.start_date}
              max={selectedOrder?.due_date}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block mb-2 font-medium text-gray-700">Deadline</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              min={selectedOrder?.start_date}
              max={selectedOrder?.due_date}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tombol Simpan */}
        <div>
          <button
            type="submit"
            className="w-full btn-simpan text-white py-3 rounded-md transition"
            disabled={isSaving}
          >
            Simpan
          </button>
        </div>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg animate-slide-up-fade">
            <h2 className="text-2xl font-bold mb-4 text-center">Penugasan Tersimpan</h2>
            <p className="text-sm text-center mb-6">
              Data penugasan berhasil disimpan. Silakan pilih aksi berikut.
            </p>
            <div className="flex justify-center gap-8">
              <button
                onClick={handleCetakSPK}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                disabled={isSaving}
                aria-label="Cetak SPK"
              >
                <FaPrint /> {isSaving ? 'Mencetak...' : 'Cetak SPK'}
              </button>
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                disabled={isSaving}
                aria-label="Kembali"
              >
                <FaArrowLeft /> {isSaving ? 'Mengalihkan...' : 'Kembali'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;
