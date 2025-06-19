import React, { useState, useEffect } from 'react';
import { updateTask, getTaskStatus, getRoles, updateTaskStatus } from '@/lib/api';

interface EditTaskPopupProps {
  task: Task;
  token: string;
  onClose: () => void;
  onSave: (updatedTask: TaskType) => void;
  refreshTasks: () => void;
}

interface Role {
  role_id: number;
  rolename: string;
}

interface Task {
  task_id: number;
  worker_id: string;
  role_id: string;  
  worker_name: string;
  roleworker: string;
  quantity: number;
  note: string;
  start_date: string;
  due_date: string;
  statustask: string;
}


export function EditTaskPopup({ task, onClose, token, refreshTasks, onSave }: EditTaskPopupProps) {
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [roleId, setRoleId] = useState(task.role_id);
  const [quantity, setQuantity] = useState(task.quantity);
  const [startDate, setStartDate] = useState(task.start_date);
  const [dueDate, setDueDate] = useState(task.due_date);
  const [note, setNote] = useState(task.note);
  const [status, setStatus] = useState(task.statustask);
  const [localToken, setLocalToken] = useState('');

  useEffect(() => {
    if (!token) {
      console.error('Token tidak tersedia, tidak bisa fetch data.');
      return;
    }

    async function fetchData() {
      try {
        const fetchedRoles = await getRoles(token);
        const fetchedStatuses = await getTaskStatus(token);
        setRoles(fetchedRoles);
        setStatuses(fetchedStatuses);
        console.log('roles fetched:', fetchedRoles);
    console.log('statuses fetched:', fetchedStatuses);
      } catch (err) {
        console.error('Error: Gagal mengambil data role.', err);
      }
    }

    fetchData();
  }, [token]);

  const handleSubmit = async () => {
    try {
      await updateTask(token, task.task_id, {
        worker_id: task.worker_id.toString(),
        role_id: roleId.toString(),
        quantity: quantity,
        note: note,
        statustask: status,
        start_date: startDate,
        due_date: dueDate,
      });

      await updateTaskStatus(token, task.task_id.toString(), { statustask: status });

      onSave({
        ...task,
        worker_id: task.worker_id.toString(),
        role_id: roleId.toString(),
        quantity,
        note,
        statustask: status,
        start_date: startDate,
        due_date: dueDate,
      });

      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Gagal mengupdate task', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-auto shadow-lg animate-slide-up-fade scrollbar-hide">
        <h3 className="text-xl font-semibold mb-6 text-center">Edit Penugasan Karyawan</h3>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Nama Karyawan */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Nama Karyawan:</label>
            <input
              type="text"
              value={task.worker_name}
              disabled
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Posisi */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Posisi:</label>
            <select
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
            >
              {roles.map((role: any) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.roleworker}
                </option>
              ))}
            </select>
          </div>

          {/* Jumlah Target */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Jumlah Target:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Tanggal Mulai & Deadline */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Tanggal Mulai:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Deadline:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Keterangan */}
          <div className="flex items-start gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Keterangan:</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              {statuses.map((s: any, idx: number) => (
                <option key={idx} value={s.statustask}>
                  {s.statustask}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col items-end gap-3 mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 rounded btn-simpan text-black transition"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 rounded btn-kembali text-black transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
