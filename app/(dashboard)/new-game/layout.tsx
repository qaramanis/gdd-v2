import { GameCreationProvider } from "@/components/new-game/game-creation-context";

export default function NewGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GameCreationProvider>{children}</GameCreationProvider>;
}
