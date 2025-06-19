const API_URL = "https://api-bag.vercel.app";

export async function login(name: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
    body: JSON.stringify({ name, password }),
  });
  console.log(res)
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Gagal login");
  }

  return res.json();
}

export async function getRoles(token: string) {
  const res = await fetch(`${API_URL}/roles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data role.');
  }

  return res.json(); 
}

export async function editRole(token: string, roleId: number, roleWorker: string) {
  const payload = { roleworker: roleWorker };
  const res = await fetch(`${API_URL}/roles/${roleId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roleworker: roleWorker }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal update role");
  }

  return res.json();
}

export async function deleteRole(roleId: number | string, token: string) {
  console.log("Mencoba DELETE role dengan ID:", roleId);
  console.log("Token yang digunakan:", token);
  const res = await fetch(`${API_URL}/roles/${roleId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      "Content-Type": "application/json",
    },
  });
  console.log("Response status:", res.status);

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error data dari server:", errorData);
    throw new Error(errorData.message || "Gagal menghapus role");
  }

  return res.json();
}

export async function addRole(token: string, roleWorker: string) {
  const res = await fetch(`${API_URL}/roles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        roleworker: roleWorker.trim(),
      }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("Backend response:", result);
    throw new Error('Gagal menambahkan role.');
  }

  return result;
}

export async function fetchWorkers(token: string) {
  const res = await fetch(`${API_URL}/workers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("Gagal mengambil data karyawan:", result);
    throw new Error(result.message || "Gagal mengambil data karyawan.");
  }

  return result.data;
}

export async function addWorker(data: {
  name: string;
  email: string;
  password: string;
  role_id: number;
}, token: string) {
  const res = await fetch(`${API_URL}/workers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
  const error = await res.json();
  console.error("Response error:", error);
  throw new Error(error.message || 'Gagal menambahkan karyawan');
}


  return res.json();
}

export async function updateWorker(
  worker_id: number,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role_id?: number;
  },
  token: string
) {
  const res = await fetch(`${API_URL}/workers/${worker_id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Response error:", error);
    throw new Error(error.message || 'Gagal mengupdate karyawan');
  }

  return res.json();
}

export async function deleteWorker(worker_id: number, token: string) {
  const res = await fetch(`${API_URL}/workers/${worker_id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Response error:", error);
    throw new Error(error.message || 'Gagal menghapus karyawan');
  }

  return res.json();
}

export async function addOrder(
  token: string,
  data: {
    order_name: string;
    typeorder: string;
    quantity: number;
    note?: string;
    start_date: string;
    due_date: string;
  }
) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Response error:", error);
    throw new Error(error.message || 'Gagal menambahkan pesanan');
  }

  return res.json();
}

export async function getOrders(token: string, page = 1) {
  const res = await fetch(`${API_URL}/orders?page=${page}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data pesanan');
  }

  return res.json(); 
}

export async function deleteOrder(token: string, orderId: number) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menghapus pesanan');
  }

  return res.json();
}

export async function addTask(
  token: string,
  body: {
    order_id: number,
    worker_id: number,
    role_id: number,
    quantity: number,
    note?: string,
    start_date: string,
    due_date: string
  }
) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menambahkan penugasan');
  }

  return res.json();
}

export async function getWorkerInfo(token: string, workerId: string) {
  const res = await fetch(`${API_URL}/workers/${workerId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data karyawan');
  }

  return res.json();
}

export async function getTasksByWorker(token: string, workerId: string) {
  const res = await fetch(`${API_URL}/tasks/worker/${workerId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data tugas');
  }

  return res.json();
}

export async function getOrderInfo(token: string, orderId: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data pesanan');
  }

  return res.json();
}

export async function getTasksByOrder(token: string, orderId: string, page = 1) {
  const res = await fetch(`${API_URL}/tasks/order/${orderId}?page=${page}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data tugas');
  }

  return res.json();
}

export async function deleteTask(token: string, taskId: string) {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal menghapus task');
  }

  return res.json();
}

export async function updateTask(
  token: string,
  taskId: string,
  payload: {
    worker_id: string;
    role_id: string;
    quantity: number;
    note: string;
    statustask: string;
    start_date: string;
    due_date: string;   
  }
) {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || 'Gagal memperbarui task');
  }

  return result;
}

export async function updateOrder(token: string, orderId: string, payload: any) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal memperbarui pesanan');
  }

  return res.json();
}

export async function updateOrderStatus(token: string, orderId: string, statusorder: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ statusorder }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal memperbarui status order');
  }

  return res.json();
}

export async function getOrderStatuses(token: string) {
  const res = await fetch(`${API_URL}/order-status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil daftar status order');
  }

  return res.json(); 
}

export async function getTaskStatus(token: string) {
  const res = await fetch(`${API_URL}/task-status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal mengambil data status task');
  }

  return res.json();
}

export async function updateTaskStatus(token: string, taskId: string, payload: any) {
  const res = await fetch(`${API_URL}/tasks/${taskId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Gagal memperbarui status task');
  }

  return res.json();
}
