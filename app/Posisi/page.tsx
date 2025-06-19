import DaftarPosisi from "@/components/Posisi";
import { SidebarDemo } from "@/components/sidebarDemo";

export default function PosisiPage() {
  return (
      <div className="flex h-screen overflow-hidden">
    <SidebarDemo />
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <DaftarPosisi />
    </div>
  </div>
  
    );
}
