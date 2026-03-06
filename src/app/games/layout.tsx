import GamesSidebar from '@/components/games/GamesSidebar';

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF9F9]">
      <GamesSidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}