import AdminSidebar from './components/AdminSidebar';
import { SidebarProvider } from './components/sidebar-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto,minmax(0,1fr)]'>
        <AdminSidebar />
        <main className='relative flex w-full flex-1 flex-col self-stretch bg-bg-weak-50'>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
