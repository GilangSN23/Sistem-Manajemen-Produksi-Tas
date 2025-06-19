import React, { Suspense } from 'react';
import AddTask from "@/components/AddTask";

export default function AddTaskPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddTask />
    </Suspense>
  );
}
