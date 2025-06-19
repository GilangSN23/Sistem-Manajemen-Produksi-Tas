import Pesanan from "@/components/Pesanan";
import { SidebarDemo } from "@/components/sidebarDemo";

export default function PesananPage() {
  return (
    <div className="flex h-screen overflow-hidden">
  <SidebarDemo />
  <div className="flex-1 flex flex-col p-4 overflow-hidden">
    <Pesanan />
  </div>
</div>

  );
}
