import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-opala-bg text-opala-charcoal">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-opala-border px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-navy">
              Opala Property Management
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[2px] font-medium">
              Live Content Mode
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-opala-muted font-sans">
            <span>Melbourne CBD</span>
            <span className="w-1.5 h-1.5 bg-amber rounded-full"></span>
            <span>Admin Active</span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
