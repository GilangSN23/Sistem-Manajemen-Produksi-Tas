import EditPesanan from "@/components/EditPesanan";

export default function EditPesananPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Pesanan</h1>
      <EditPesanan orderId={params.orderId} />
    </div>
  );
}
