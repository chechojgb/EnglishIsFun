import GamesSidebar from '@/components/games/GamesSidebar';
export default function GamesLayout({ children }: { children: React.ReactNode }) {
return (
<div className="flex min-h-screen bg-[#FFF9F9]">
{/* El Sidebar Independiente */}
<GamesSidebar />
{/* El área de contenido que cambia según el juego */}
<main className="flex-1 p-2 overflow-y-auto">
{children}
</main>
</div>
  );
}