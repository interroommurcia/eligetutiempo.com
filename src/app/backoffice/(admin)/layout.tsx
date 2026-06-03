import BackofficeSidebar from "../BackofficeSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 flex">
      <BackofficeSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
