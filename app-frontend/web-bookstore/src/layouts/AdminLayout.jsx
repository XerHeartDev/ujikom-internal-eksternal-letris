import { Outlet } from "react-router-dom";
import NavBarAdmin from "../components/NavBarAdmin";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBarAdmin />

      <main className="grow w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
