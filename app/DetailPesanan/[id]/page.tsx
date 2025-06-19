'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import { jsPDF } from 'jspdf';
import { EditTaskPopup } from '@/components/EditTaskPopup';
import { getOrderInfo, getTasksByOrder, deleteTask, updateTask, getTaskStatus, updateOrder, updateOrderStatus, getOrderStatuses, getRoles, updateTaskStatus } from '@/lib/api';
import { SidebarDemo } from '@/components/sidebarDemo';

interface Order {
  order_id: number;
  order_name: string;
  typeorder: string;
  quantity: number;
  start_date: string;
  due_date: string;
  note: string;
  statusorder: string;
}

interface Task {
  task_id: number;
  order_id: string;
  worker_id: string;
  worker_name: string;
  role_id: string;
  roleworker: string;
  statustask: string;
  quantity: number;
  note: string;
  start_date: string;
  due_date: string;
}

interface Worker {
  worker_id: string;
  name: string;
  roleworker: string;
  email: string;
  password: string;
}

interface StatusOption {
  value: string;
  label: string;
}

const daysArray = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function DetailOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [order_name, setOrderName] = useState('');
  const [typeorder, setTypeOrder] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [start_date, setStartDate] = useState('');
  const [due_date, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [statusorder, setStatusOrder] = useState<string>('');
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);


  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderData = await getOrderInfo(token, orderId);
        setOrder(orderData);

        const tasksData = await getTasksByOrder(token, orderId);
        setTasks(tasksData.data || []);

        const options = await getOrderStatuses(token);
        const formattedOptions = options.map((opt: any) => ({
          value: opt.statusorder,
          label: opt.statusorder,
        }));
        setStatusOptions(formattedOptions);

        if (orderData?.statusorder) {
          setStatusOrder(orderData.statusorder);
        }

      } catch (err: any) {
        setError(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, token]);

  const generateSpkPdf = (task) => {
    const doc = new jsPDF();

    // Konten utama
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('Surat Perintah Kerja (SPK)', 105, 20, undefined, 'center');

    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const labelX = 14;
    const colonX = 60;
    const valueX = 70;
    let currentY = 35;
    const lineHeight = 8;

    const drawRow = (label, value) => {
      doc.text(label, labelX, currentY);
      doc.text(":", colonX, currentY);
      doc.text(String(value), valueX, currentY);
      currentY += lineHeight;
    };

    drawRow("Nama", task.worker_name);
    drawRow("Posisi", task.roleworker);
    drawRow("Jumlah Target", task.quantity);
    drawRow("Tanggal Mulai", task.start_date);
    drawRow("Batas Waktu", task.due_date);
    drawRow("Keterangan", task.note);
    drawRow("Status", task.statustask);

    const tanggal = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    doc.text(`Surakarta, ${tanggal}`, 140, currentY + 8);
    doc.text('Manajer', 140, currentY + 16);
    doc.text('Bu Hartono', 140, currentY + 28);

    doc.setFontSize(40);
    doc.setTextColor(150); 
    doc.text('Tas Bu Hartono', 105, 150, { align: 'center', angle: 45 });

    doc.save(`SPK_${task.worker_name}.pdf`);
  };

  const confirmDelete = (taskId: number) => {
    setDeleteId(taskId);
    setOpenDropdown(null);
  };

  const cancelDelete = () => {
      setDeleteId(null);
    };
  
  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        await deleteTask(token, deleteId.toString());
        setTasks((prevTasks) => prevTasks.filter(task => task.task_id !== deleteId));
        cancelDelete(); 
      } catch (err: any) {
        alert(err.message || "Gagal menghapus tugas");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        order_name,
        typeorder,
        quantity,
        start_date,
        due_date,
        note,
        statusorder, 
      };

      console.log("📦 Payload untuk updateOrder:", payload);

      await updateOrder(token, orderId, payload);

      alert('Pesanan berhasil diperbarui!');
      setShowEditPopup(false);
      window.location.reload();
    } catch (err: any) {
      console.error("❌ Gagal updateOrder:", err);
      alert(err.message || 'Gagal memperbarui pesanan.');
    }
  };

  // Fungsi navigasi bulan
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const generateCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

  const getTasksWithDuration = () => {
    if (!tasks || tasks.length === 0) return [];
    
    return tasks.map(task => {
      const start = new Date(task.start_date);
      const end = new Date(task.due_date);
      const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const startDay = start.getDate();
      
      return { ...task, startDay, duration };
    });
  };


  const getOrdersForDay = (date: number) => {
    return getTasksWithDuration().filter(order => {
        const taskStart = new Date(order.start_date);
        const taskEnd = new Date(order.due_date);

        const currentDate = new Date(currentYear, currentMonth, date);

        return currentDate >= taskStart && currentDate <= taskEnd;
    });
    };

  const tasksWithDuration = getTasksWithDuration();
 
  const renderCalendarRows = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const rows: JSX.Element[] = [];

    tasksWithDuration.forEach((task, index) => {
      const start = new Date(task.start_date);
      const end = new Date(task.due_date);

      const isInThisMonth =
        (start.getFullYear() === currentYear && start.getMonth() === currentMonth) ||
        (end.getFullYear() === currentYear && end.getMonth() === currentMonth) ||
        (start < new Date(currentYear, currentMonth + 1, 1) &&
          end > new Date(currentYear, currentMonth, 0));

      if (!isInThisMonth) return;

      const rowCells: JSX.Element[] = [];

      const startDay = start.getMonth() === currentMonth && start.getFullYear() === currentYear
        ? start.getDate()
        : 1;

      const endDay = end.getMonth() === currentMonth && end.getFullYear() === currentYear
        ? end.getDate()
        : daysInMonth;

      // Sel kosong sebelum blok task
      for (let day = 1; day < startDay; day++) {
        rowCells.push(
          <td
            key={`empty-before-${index}-${day}`}
            className="px-2 py-1 border border-gray-200 text-center text-sm text-gray-400"
            style={{ minWidth: "40px" }}
          >
            -
          </td>
        );
      }

      // Isi kolom sesuai durasi task
      const span = endDay - startDay + 1;
      rowCells.push(
        <td
          key={`task-${task.task_id}`}
          colSpan={span}
          className="px-2 py-1 bg-green-200 text-xs text-center rounded border border-green-400"
          title={`${task.worker_name} (${task.roleworker})`}
          style={{ minWidth: `${40 * span}px` }}
        >
          <div className="font-medium">{task.worker_name}</div>
          <div className="text-[0.65rem] italic text-green-800 mt-1">
            {task.roleworker}
          </div>
        </td>
      );

      // Sel kosong setelah blok
      for (let day = endDay + 1; day <= daysInMonth; day++) {
        rowCells.push(
          <td
            key={`empty-after-${index}-${day}`}
            className="px-2 py-1 border border-gray-200 text-center text-sm text-gray-400"
            style={{ minWidth: "40px" }}
          >
            -
          </td>
        );
      }

      rows.push(<tr key={`row-${index}`}>{rowCells}</tr>);
    });

    return rows;
  };


  // Fungsi untuk format nama bulan
  const formatMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleString("id-ID", {
      month: "long",
    });
  };

  const toggleDropdown = (taskId: string) => {
    setOpenDropdown(openDropdown === taskId ? null : taskId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p>Order tidak ditemukan.</p>;

  return (
      <div className="flex h-screen overflow-hidden">
        <SidebarDemo />
        <div className="flex-1 h-screen overflow-y-auto bg-gray-50">
          <div className="flex-1 overflow-y-auto p-4"></div>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">Detail Pesanan</h1>
              <p>Pesanan {order.order_name}</p>
    
              {/* Info karyawan */}
              <div className=" p-4 rounded mb-6 text-gray-800 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <label className="w-36 font-medium text-gray-700">Nama Pesanan</label>
                  <div className="flex-1 border border-gray-300 px-3 py-1.5 rounded bg-gray-50">
                    {order.order_name}
                  </div>
                </div>

                {/* Jenis Pesanan */}
                <div className="flex items-start gap-2">
                  <label className="w-36 font-medium text-gray-700">Jenis Pesanan</label>
                  <div className="flex-1 border border-gray-300 px-3 py-1.5 rounded bg-gray-50">
                    {order.typeorder}
                  </div>
                </div>

                {/* Jumlah Pesanan */}
                <div className="flex items-start gap-2">
                  <label className="w-36 font-medium text-gray-700">Jumlah Pesanan</label>
                  <div className="flex-1 border border-gray-300 px-3 py-1.5 rounded bg-gray-50">
                    {order.quantity}
                  </div>
                </div>

                {/* Tanggal Mulai dan Batas Waktu di satu baris */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-1 items-start gap-2">
                    <label className="w-36 font-medium text-gray-700">Tanggal Mulai</label>
                    <div className="flex-1 border border-gray-300 px-3 py-1.5 rounded bg-gray-50">
                      {order.start_date}
                    </div>
                  </div>
                  <div className="flex flex-1 items-start gap-2">
                    <label className="w-36 font-medium text-gray-700">Batas Waktu</label>
                    <div className="flex-1 border border-gray-300 px-3 py-1.5 rounded bg-gray-50">
                      {order.due_date}
                    </div>
                  </div>
                </div>

                {/* Keterangan */}
                <div className="flex items-start gap-2">
                  <label className="w-36 font-medium text-gray-700">Keterangan</label>
                  <div className="flex-1 border border-gray-300 px-3 py-1.5 rounded bg-gray-50 whitespace-pre-line">
                    {order.note}
                  </div>
                </div>
              </div>
    
              {/* 3 kolom kecil: status, tambah penugasan, edit */}
              <div className="flex flex-wrap gap-2 mb-4 sm:gap-4 justify-start">
                {/* Status */}
                <div className="bg-blue-100 px-4 py-3 rounded text-left font-semibold text-blue-600 min-w-[150px] flex items-center h-[48px]">
                  Status: {order.statusorder}
                </div>

                <Link href={`/Addtask?orderId=${order.order_id}`}>
                  <div className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg shadow-sm flex items-center h-[48px] cursor-pointer min-w-[150px]">
                    <span className="text-base font-semibold text-center mx-auto">+ Penugasan</span>
                  </div>
                </Link>

                {/* Tombol Edit */}
                <button
                  onClick={() => {
                    if (order) {
                      setOrderName(order.order_name);
                      setTypeOrder(order.typeorder);
                      setQuantity(order.quantity);
                      setStartDate(order.start_date);
                      setDueDate(order.due_date);
                      setNote(order.note);
                      setStatusOrder(order.statusorder);
                      setShowEditPopup(true);
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded h-[48px] min-w-[150px] font-semibold"
                >
                  Edit
                </button>
              </div>

                {/* Navigasi Bulan */}
                <div className="flex justify-between items-center mb-2 gap-2">
                    <button
                    onClick={() => {
                        if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                        } else {
                        setCurrentMonth(currentMonth - 1);
                        }
                    }}
                    className="flex-1 sm:flex-none border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-100"
                    >
                    &lt; Sebelumnya
                    </button>
    
                    <h4 className="font-semibold text-lg">
                    {formatMonthName()} {currentYear}
                    </h4>
    
                    <button
                    onClick={() => {
                        if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                        } else {
                        setCurrentMonth(currentMonth + 1);
                        }
                    }}
                    className="flex-1 sm:flex-none border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-100"
                    >
                    Selanjutnya &gt;
                    </button>
                </div>
    
                {/* Tabel Kalender */}
              <div className="flex-grow px-2 sm:px-6 py-1 overflow-hidden">
                  <div className="bg-white p-4 rounded-lg h-full overflow-hidden mt-0">
                  <div className="overflow-auto h-full border border-gray-300 rounded">
                      <table className="min-w-full border-collapse">
                      <thead>
                      <tr className="bg-gray-100 sticky top-0 z-10">
                          {generateCalendar().map((date) => (
                          <th
                              key={date}
                              className="px-4 py-2 text-center font-medium text-gray-700"
                              style={{ minWidth: "40px" }}
                          >
                              {date}
                          </th>
                          ))}
                      </tr>
                      </thead>
                      <tbody>{renderCalendarRows()}</tbody>
                      </table>
                  </div>
                  </div>
              </div>
              </div>
    
              {/* Tabel Daftar Tugas */}
              <div className="overflow-x-auto rounded shadow-sm mb-10">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Nama Karyawan</th>
                      <th className="px-4 py-2 text-left">Posisi</th>
                      <th className="px-4 py-2 text-left">Jumlah Target</th>
                      <th className="px-4 py-2 text-left">Keterangan</th>
                      <th className="px-4 py-2 text-left">Rentang Waktu</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.task_id} className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-2">{task.worker_name}</td>
                        <td className="px-4 py-2">{task.roleworker}</td>
                        <td className="px-4 py-2">{task.quantity}</td>
                        <td className="px-4 py-2">{task.note}</td>
                        <td className="px-4 py-2">
                          {new Date(task.start_date).toLocaleDateString()} -{" "}
                          {new Date(task.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{task.statustask}</td>
                        <td className="px-4 py-2 relative">
                          <button
                            onClick={() => toggleDropdown(task.task_id.toString())}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            &#8230;
                          </button>
                          {openDropdown === task.task_id.toString() && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                              <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              onClick={() => generateSpkPdf(task)}>
                                SPK
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowEditPopup(true);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                              onClick={() => confirmDelete(task.task_id)}>
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
            {showEditPopup && (
              <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl min-w-[700px] shadow-lg animate-slide-up-fade">
                  <h2 className="text-xl font-semibold mb-4 text-center">Edit Pesanan</h2>
                  <form onSubmit={handleEditOrder} className="space-y-4">
                    {/* Nama Pesanan */}
                    <div className="flex items-center gap-3">
                      <label className="w-40 text-sm font-medium text-gray-700">Nama Pesanan:</label>
                      <input
                        type="text"
                        value={order_name}
                        onChange={(e) => setOrderName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Jenis Pesanan */}
                    <div className="flex items-center gap-3">
                      <label className="w-40 text-sm font-medium text-gray-700">Jenis Pesanan:</label>
                      <input
                        type="text"
                        value={typeorder}
                        onChange={(e) => setTypeOrder(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Jumlah */}
                    <div className="flex items-center gap-3">
                      <label className="w-40 text-sm font-medium text-gray-700">Jumlah Pesanan:</label>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Tanggal Mulai & Batas Waktu */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <label className="w-40 text-sm font-medium text-gray-700">Tanggal Mulai:</label>
                        <input
                          type="date"
                          value={start_date}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Batas Waktu:</label>
                        <input
                          type="date"
                          value={due_date}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Keterangan */}
                    <div className="flex items-center gap-3">
                      <label className="w-40 text-sm font-medium text-gray-700">Keterangan:</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <label className="w-40 text-sm font-medium text-gray-700">Status:</label>
                      <select
                        value={statusorder}
                        onChange={(e) => setStatusOrder(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex flex-col items-end gap-2 mt-4">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 rounded btn-simpan text-black transition"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditPopup(false)}
                        className="w-full px-4 py-2 rounded btn-kembali text-black transition"
                      >
                        Kembali
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {showEditPopup && selectedTask && (
            <EditTaskPopup
            task={selectedTask}
            token={localStorage.getItem('token') || ''}
            onClose={() => setShowEditPopup(false)}
            onSave={(updatedTask) => {
              setTasks(prev => prev.map(t => t.task_id === updatedTask.task_id ? updatedTask : t));
              setShowEditPopup(false);
            }}
          />
          )}
        </div>
)}