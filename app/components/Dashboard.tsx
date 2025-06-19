'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrders, getOrderInfo } from '@/lib/api';

interface Order {
  order_id: number;
  order_name: string;
  typeorder: string;
  quantity: number;
  start_date: string;
  due_date: string;
  statusorder: string;
  note: string;
}

interface OrderDetail {
  order_id: number;
  order_name: string;
  note: string;
  quantity: number;
  start_date: string;
  due_date: string;
  statusorder: string;
}

const daysArray = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [showDetailPopup, setShowDetailPopup] = useState(false);


  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/Login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await getOrders(token, 1);
        setOrders(response.data);

        const datesSet = new Set<string>();
        response.data.forEach((order: Order) => {

          const orderDate = new Date(order.start_date);
          if (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear
          ) {
            datesSet.add(order.start_date);
          }
        });
        setBlockedDates(datesSet);
      } catch (error) {
        console.error("Gagal fetch orders:", error);
      }
    };

    fetchOrders();
  }, [currentMonth, currentYear, router]);

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
    return orders.map(orders => {
        const start = new Date(orders.start_date);
        const end = new Date(orders.due_date);
        
        const duration =
        Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

        const startDay = start.getDate();

        return { ...orders, startDay, duration };
    });
    };

  const getOrdersForDay = (date: number) => {
    return getTasksWithDuration().filter(orders => {
        const taskStart = new Date(orders.start_date);
        const taskEnd = new Date(orders.due_date);

        const currentDate = new Date(currentYear, currentMonth, date);

        return currentDate >= taskStart && currentDate <= taskEnd;
    });
    };

  const tasksWithDuration = getTasksWithDuration();
 
  const renderCalendarRows = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const rows: JSX.Element[] = [];

    tasksWithDuration.forEach((order, index) => {
      const start = new Date(order.start_date);
      const end = new Date(order.due_date);

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

      // Sel kosong sebelum blok order
      for (let day = 1; day < startDay; day++) {
        rowCells.push(
          <td
            key={`empty-before-${index}-${day}`}
            className="px-2 py-1 text-center text-sm text-gray-300"
            style={{ minWidth: "40px" }}
          >
          </td>
        );
      }

      // Satu sel yang panjang (colSpan)
      const span = endDay - startDay + 1;
      rowCells.push(
        <td
          key={`order-${order.order_id}`}
          colSpan={span}
          className="px-2 py-1 bg-blue-100 text-xs text-center rounded-lg cursor-pointer hover:bg-blue-200 transition"
          title={`${order.order_name} (${order.statusorder})`}
          style={{ minWidth: `${40 * span}px` }}
          onClick={() => handleOrderClick(order)}
        >
          <div className="font-medium">{order.order_name}</div>
          <div className="text-[0.65rem] italic text-blue-800 mt-1">
            {order.statusorder}
          </div>
        </td>
      );

      // Sel kosong setelah blok order
      for (let day = endDay + 1; day <= daysInMonth; day++) {
        rowCells.push(
          <td
            key={`empty-after-${index}-${day}`}
            className="px-2 py-1 text-center text-sm text-gray-300"
            style={{ minWidth: "40px" }}
          >
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

  const ordersInProduction = orders.filter(
    (order) => order.statusorder !== "Selesai"
  );

  const totalOrdersInProduction = ordersInProduction.length;

  const fetchOrderDetail = async (orderId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const res = await getOrderInfo(token, orderId);
      setSelectedOrder(res.data);
    } catch (err) {
      setErrorDetail("Gagal memuat detail pesanan");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder({
      order_id: order.order_id,
      order_name: order.order_name,
      typeorder: order.typeorder,
      note: order.note,
      quantity: order.quantity,
      start_date: order.start_date,
      due_date: order.due_date,
      statusorder: order.statusorder,
    });
    setShowDetailPopup(true);
  };


  const closePopup = () => {
    setShowDetailPopup(false);
    setSelectedOrder(null);
    setErrorDetail(null);
  };

  return (
    <div className="bg-white-100 h-full flex flex-col gap-6 overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 mt-4">
        <Link href="/AddOrder">
          <div className="btn-simpan text-black p-4 rounded-lg shadow-sm flex flex-col justify-center items-center h-full cursor-pointer">
            <span className="text-lg font-semibold text-center">+ Pesanan</span>
          </div>
        </Link>
        <Link href="/Addtask">
          <div className="btn-simpan text-black p-4 rounded-lg shadow-sm flex flex-col justify-center items-center h-full cursor-pointer">
            <span className="text-lg font-semibold text-center">+ Penugasan</span>
          </div>
        </Link>
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-center items-center h-full">
          <h5 className="text-lg font-semibold mb-2 text-center">Pesanan Produksi</h5>
          <span className="text-2xl font-bold">{totalOrdersInProduction} Pesanan</span>
        </div>
      </div>

      {/* Navigasi Bulan */}
      <div className="bg-white px-6 py-1 shadow-sm flex justify-between items-center">
        <button
          onClick={handlePreviousMonth}
          className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
        >
          &lt; Bulan Sebelumnya
        </button>
        <h4 className="text-lg font-semibold">{formatMonthName()} {currentYear}</h4>
        <button
          onClick={handleNextMonth}
          className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
        >
          Bulan Selanjutnya &gt;
        </button>
      </div>

      {/* Tabel Kalender */}
      <div className="flex-grow px-2 sm:px-6 py-1 overflow-hidden">
        <div className="bg-white p-4 rounded-lg h-full overflow-hidden mt-0 shadow-sm">
          <div className="overflow-auto h-full rounded-lg">
            <table className="min-w-full border-collapse text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 sticky top-0 z-10 text-xs uppercase tracking-wider">
                  {generateCalendar().map((date) => (
                    <th
                      key={date}
                      className="px-3 py-2 text-center font-semibold"
                      style={{ minWidth: "50px" }}
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
            {/* Modal Popup Detail Pesanan */}
        {showDetailPopup && selectedOrder && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md border-4">
            <h2 className="text-center text-xl font-extrabold mb-6">Detail Pesanan</h2>

            <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-3 items-center">
              <span className="font-semibold text-left">Nama Pesanan</span>
              <span>:</span>
              <span>{selectedOrder.order_name}</span>

              <span className="font-semibold text-left">Jenis Pesanan</span>
              <span>:</span>
              <span>{selectedOrder.typeorder}</span>

              <span className="font-semibold text-left">Jumlah</span>
              <span>:</span>
              <span>{selectedOrder.quantity}</span>

              <span className="font-semibold text-left">Tanggal Mulai</span>
              <span>:</span>
              <span>{selectedOrder.start_date}</span>

              <span className="font-semibold text-left">Tanggal Selesai</span>
              <span>:</span>
              <span>{selectedOrder.due_date}</span>

              <span className="font-semibold text-left">Keterangan</span>
              <span>:</span>
              <span>{selectedOrder.note}</span>

              <span className="font-semibold text-left">Status</span>
              <span>:</span>
              <span>{selectedOrder.statusorder}</span>
            </div>

            <button
              className="mt-3 w-full btn-kembali text-black font-semibold py-2 rounded"
              onClick={() => setShowDetailPopup(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>      
  );
};

export default Dashboard;