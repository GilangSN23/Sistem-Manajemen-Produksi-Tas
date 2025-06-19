'use client'; 

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; 
import { getOrderInfo, updateOrder } from '@/lib/api';

interface EditPesananProps {
  orderId: string;
}

type Order = {
  order_id: string;
  order_name: string;
  typeorder: string;
  quantity: number;
  note?: string;
  statusorder: string;
  start_date: string;
  due_date: string;
};

export default function EditPesanan({ orderId }: EditPesananProps) {
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orderName, setOrderName] = useState('');
  const [typeOrder, setTypeOrder] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || ''; 
        const data = await getOrderInfo(token, orderId);
        setOrder(data);

        setOrderName(data.order_name);
        setTypeOrder(data.typeorder);
        setQuantity(data.quantity);
        setNote(data.note || '');
        setStatusOrder(data.statusorder);
        setStartDate(data.start_date.split('T')[0]); 
        setDueDate(data.due_date.split('T')[0]);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Gagal ambil data order');
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token') || '';
      await updateOrder(token, orderId, {
        order_name: orderName,
        typeorder: typeOrder,
        quantity,
        note,
        statusorder: statusOrder,
        start_date: startDate,
        due_date: dueDate,
      });

      alert('Order berhasil diperbarui!');
      router.push(`/orders/${orderId}`); 
    } catch (err: any) {
      alert(err.message || 'Gagal update order');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nama Order:
        <input value={orderName} onChange={e => setOrderName(e.target.value)} required />
      </label>

      <label>
        Tipe Order:
        <input value={typeOrder} onChange={e => setTypeOrder(e.target.value)} required />
      </label>

      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          required
          min={0}
        />
      </label>

      <label>
        Note:
        <textarea value={note} onChange={e => setNote(e.target.value)} />
      </label>

      <label>
        Status Order:
        <input value={statusOrder} onChange={e => setStatusOrder(e.target.value)} required />
      </label>

      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
      </label>

      <label>
        Due Date:
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
        />
      </label>

      <button type="submit">Update Order</button>
    </form>
  );
}
