import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">

      {/* Sidebar — fijo en desktop, overlay en mobile */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Columna derecha */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-8 bg-muted/30">
          <Outlet />
        </main>
      </div>

    </div>
  );
}