import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-5 lg:px-8 py-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}