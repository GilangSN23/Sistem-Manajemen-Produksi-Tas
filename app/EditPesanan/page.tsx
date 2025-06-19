import { type FC } from "react";
import EditPesanan from "@/components/EditPesanan";

interface PageProps {
  params: {
    orderId: string;
  };
}

const EditPesananPage: FC<PageProps> = ({ params }) => {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Pesanan</h1>
      <EditPesanan orderId={params.orderId} />
    </div>
  );
};

export default EditPesananPage;
