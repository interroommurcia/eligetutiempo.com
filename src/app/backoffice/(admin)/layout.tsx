import BackofficeSidebar from "../BackofficeSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 md:flex">
      <BackofficeSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
