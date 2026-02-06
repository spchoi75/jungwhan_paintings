import Header from '@/components/common/Header';
import ViewTabs from '@/components/portfolio/ViewTabs';

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="pt-24 pb-16 px-6">
        <h1 className="text-3xl font-light tracking-wide text-center mb-8 text-[var(--foreground)]">
          Portfolio
        </h1>
        <ViewTabs />
        {children}
      </div>
    </main>
  );
}
