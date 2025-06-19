import DaftarKaryawan from "@/components/Karyawan";
import { SidebarDemo } from "@/components/sidebarDemo";

export default function KaryawanPage() {
  return (
      <div className="flex h-screen overflow-hidden">
    <SidebarDemo />
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <DaftarKaryawan />
    </div>
  </div>
  
    );
}
