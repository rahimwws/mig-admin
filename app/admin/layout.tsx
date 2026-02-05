import AdminSidebar from './components/AdminSidebar';
import { SearchMenu } from '@/components/search';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col items-start lg:grid lg:grid-cols-[auto,minmax(0,1fr)]'>
      <AdminSidebar />
      <main className='relative flex w-full flex-1 flex-col self-stretch bg-bg-weak-50'>
        {children}
      </main>
      <SearchMenu />
    </div>
  );
}
