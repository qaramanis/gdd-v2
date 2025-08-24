export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-6 text-muted-foreground">{message}</div>
  );
}
