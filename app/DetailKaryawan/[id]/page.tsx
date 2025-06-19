'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getWorkerInfo, getTasksByWorker } from '@/lib/api';
import { SidebarDemo } from '@/components/sidebarDemo';

interface Worker {
  worker_id: string;
  name: string;
  roleworker: string;
  email: string;
  password: string;
}

interface Task {
  task_id: number;
  order_id: number;
  order_name: string;
  role_id: number;
  roleworker: string;
  statustask: string;
  quantity: number;
  note: string;
  start_date: string;
  due_date: string;
}

const daysArray = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function DetailKaryawanPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const params = useParams();
  const id = params.id as string;
  const [worker, setWorker] = useState<Worker | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Biasanya token diambil dari localStorage atau context auth
  const [token, setToken] = useState<string>('');
  const workerId = 1; // Contoh workerId, bisa kamu ganti sesuai kebutuhan

  useEffect(() => {
    if (!id) return; // jangan fetch kalau id belum ada

    const token = localStorage.getItem('token') || '';
    const fetchData = async () => {
      try {
        const workerData = await getWorkerInfo(token, id);
        setWorker(workerData.data);

        const tasksData = await getTasksByWorker(token, id);
        setTasks(tasksData.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    return tasks.map(task => {
        const start = new Date(task.start_date);
        const end = new Date(task.due_date);
        // Hitung durasi dalam hari, termasuk start dan end
        const duration =
        Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

        // Tentukan posisi start di bulan ini
        const startDay = start.getDate();

        return { ...task, startDay, duration };
    });
    };

  const getOrdersForDay = (date: number) => {
    return getTasksWithDuration().filter(task => {
        const taskStart = new Date(task.start_date);
        const taskEnd = new Date(task.due_date);

        // Cek apakah tanggal 'date' di bulan dan tahun sekarang termasuk dalam rentang tugas
        const currentDate = new Date(currentYear, currentMonth, date);

        return currentDate >= taskStart && currentDate <= taskEnd;
    });
    };

  const tasksWithDuration = getTasksWithDuration();
 
  const renderCalendarRows = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const normalizeDate = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const cells: JSX.Element[] = [];
    let day = 1;

    while (day <= daysInMonth) {
        // Cari tugas yang aktif di hari ini (bulan dan tahun sekarang)
        const activeTask = tasksWithDuration.find(task => {
        const taskStart = normalizeDate(new Date(task.start_date));
        const taskEnd = normalizeDate(new Date(task.due_date));
        const currentDate = normalizeDate(new Date(currentYear, currentMonth, day));
        return currentDate >= taskStart && currentDate <= taskEnd;
        });


        if (activeTask) {
        // Hitung durasi tugas yang tersisa di bulan ini dari hari ini
        const taskEndDate = new Date(activeTask.due_date);
        const daysLeftInMonth = daysInMonth - day + 1;
        const remainingDuration = Math.min(
            Math.floor(
            (taskEndDate.getTime() - new Date(currentYear, currentMonth, day).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1,
            daysLeftInMonth
        );

        cells.push(
            <td
            key={`task-${activeTask.task_id}-${day}`}
            colSpan={remainingDuration}
            className="px-2 py-1 bg-blue-200 text-xs text-center rounded border border-blue-400"
            style={{ minWidth: 40 * remainingDuration }}
            title={`${activeTask.order_name} (${activeTask.statustask})`}
            >
            <div><strong>{activeTask.order_name}</strong></div>
            <div className="text-[0.65rem] italic text-blue-800 mt-1">
                {activeTask.statustask}
            </div>
            </td>
        );

        day += remainingDuration;
        } else {
        cells.push(
            <td
            key={`empty-${day}`}
            className="px-4 py-2 border border-gray-300"
            style={{ minWidth: 40 }}
            >
            -
            </td>
        );
        day++;
        }
    }

    return <tr>{cells}</tr>;
    };

  // Fungsi untuk format nama bulan
  const formatMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleString("id-ID", {
      month: "long",
    });
  };

  if (loading) return <p>Loading...</p>;
  if (!worker) return <p>Data karyawan tidak ditemukan.</p>;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarDemo />
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Detail Karyawan</h1>

          {/* Info karyawan */}
          <div className="bg-white p-6 rounded mb-6 text-gray-800 space-y-4">
            <div className="flex items-center">
                <label className="w-40 font-medium text-gray-700">Nama Karyawan</label>
                <div className="flex-1 border border-gray-300 px-3 py-2 rounded bg-white-50">
                {worker.name}
                </div>
            </div>

            <div className="flex items-center">
                <label className="w-40 font-medium text-gray-700">Posisi Karyawan</label>
                <div className="flex-1 border border-gray-300 px-3 py-2 rounded bg-white-50">
                {worker.roleworker}
                </div>
            </div>

            <div className="flex items-center">
                <label className="w-40 font-medium text-gray-700">Email</label>
                <div className="flex-1 border border-gray-300 px-3 py-2 rounded bg-white-50">
                {worker.email}
                </div>
            </div>

            <div className="flex items-center">
                <label className="w-40 font-medium text-gray-700">Password</label>
                <div className="flex-1 border border-gray-300 px-3 py-2 rounded bg-white-50">
                {worker.password}
                </div>
            </div>
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
            <div className="flex-grow px-2 sm:px-6 py-4 overflow-hidden">
                <div className="bg-white p-4 rounded-lg h-full overflow-hidden">
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


          {/* Tabel Daftar Tugas */}
          <div className="overflow-x-auto rounded shadow-sm">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="px-4 py-2 text-left">Nama Pesanan</th>
                    <th className="px-4 py-2 text-left">Posisi</th>
                    <th className="px-4 py-2 text-left">Jumlah Target</th>
                    <th className="px-4 py-2 text-left">Keterangan</th>
                    <th className="px-4 py-2 text-left">Rentang Waktu</th>
                    <th className="px-4 py-2 text-left">Status</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.task_id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-2">{task.order_name}</td>
                    <td className="px-4 py-2">{task.roleworker}</td>
                    <td className="px-4 py-2">{task.quantity}</td>
                    <td className="px-4 py-2">{task.note}</td>
                    <td className="px-4 py-2">
                        {new Date(task.start_date).toLocaleDateString()} - {new Date(task.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{task.statustask}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}