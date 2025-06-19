// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { getTasksByOrder, updateTask, fetchWorkers } from '@/lib/api'; // aku koreksi fungsi getTaskById

// const EditTaskPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const taskId = params.taskId;

//   const [task, setTask] = useState(null);
//   const [workers, setWorkers] = useState([]);
//   const [formData, setFormData] = useState({
//     worker_id: '',
//     role_id: '',
//     quantity: '',
//     note: '',
//     statustask: '',
//     start_date: '',
//     due_date: '',
//   });

//   useEffect(() => {
//     const fetchTaskAndWorkers = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('Token tidak ditemukan');

//         const workersData = await fetchWorkers(token);
//         setWorkers(workersData);

//         const data = await getTaskById(token, taskId);
//         setTask(data);
//         setFormData({
//           worker_id: data.worker_id,
//           role_id: data.role_id,
//           quantity: data.quantity,
//           note: data.note || '',
//           statustask: data.statustask,
//           start_date: data.start_date?.split('T')[0] || '',
//           due_date: data.due_date?.split('T')[0] || '',
//         });
//       } catch (error) {
//         console.error('Gagal mengambil data tugas:', error);
//       }
//     };

//     if (taskId) {
//       fetchTaskAndWorkers();
//     }
//   }, [taskId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'quantity' || name === 'role_id' || name === 'worker_id' ? Number(value) : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await updateTask(token, taskId, formData);
//       alert('Tugas berhasil diperbarui');
//       router.push('/Dashboard');
//     } catch (error) {
//       console.error('Gagal memperbarui tugas:', error);
//       alert('Gagal memperbarui tugas');
//     }
//   };

//   if (!task) return <p>Memuat data tugas...</p>;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
//       <div>
//         <label className="block mb-1 font-semibold">Nama Karyawan:</label>
//         <select
//           name="worker_id"
//           value={formData.worker_id}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2"
//         >
//           <option value="">-- Pilih Karyawan --</option>
//           {workers.map(worker => (
//             <option key={worker.id} value={worker.id}>
//               {worker.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label className="block mb-1 font-semibold">Posisi (Role ID):</label>
//         <input
//           type="number"
//           name="role_id"
//           value={formData.role_id}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>
//       <div>
//         <label className="block mb-1 font-semibold">Jumlah Target (Quantity):</label>
//         <input
//           type="number"
//           name="quantity"
//           value={formData.quantity}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>
//       <div>
//         <label className="block mb-1 font-semibold">Status:</label>
//         <select
//           name="statustask"
//           value={formData.statustask}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2"
//         >
//           <option value="Belum Mulai">Belum Mulai</option>
//           <option value="Proses">Proses</option>
//           <option value="Revisi">Revisi</option>
//           <option value="Selesai">Selesai</option>
//         </select>
//       </div>
//       <div>
//         <label className="block mb-1 font-semibold">Tanggal Mulai:</label>
//         <input
//           type="date"
//           name="start_date"
//           value={formData.start_date}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>
//       <div>
//         <label className="block mb-1 font-semibold">Deadline:</label>
//         <input
//           type="date"
//           name="due_date"
//           value={formData.due_date}
//           onChange={handleChange}
//           required
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>
//       <div>
//         <label className="block mb-1 font-semibold">Keterangan (Note):</label>
//         <textarea
//           name="note"
//           value={formData.note}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2"
//           rows={3}
//         />
//       </div>
//       <button
//         type="submit"
//         className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Simpan
//       </button>
//     </form>
//   );
// };

// export default EditTaskPage;
