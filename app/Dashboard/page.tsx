import Dashboard from "@/components/Dashboard";
import { SidebarDemo } from "@/components/sidebarDemo";

const DashboardPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
  <SidebarDemo />
  <div className="flex-1 flex flex-col p-4 overflow-hidden">
    <Dashboard />
  </div>
</div>

  );
};

export default DashboardPage;
