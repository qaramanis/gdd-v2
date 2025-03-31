export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  game: string | null;
}
