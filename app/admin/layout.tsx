import { Sidebar } from "./components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background relative selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <main className="flex-1 pt-16 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
