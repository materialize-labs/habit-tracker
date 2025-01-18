import { BottomNav } from '@/components/ui/bottom-nav';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="container mx-auto p-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
} 