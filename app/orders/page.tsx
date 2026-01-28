import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopBar } from "@/components/layout/TopBar";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full 2xl:max-w-[2250px]">
        <SidebarNav />
        <div className="flex min-h-screen flex-1 flex-col bg-white">
          <TopBar />
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-6xl">
              <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
