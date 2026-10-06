import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar superior */}
        <Navbar />

        {/* Contenido de la página */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
