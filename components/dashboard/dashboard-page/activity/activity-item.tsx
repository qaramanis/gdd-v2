export default function ActivityItem({
  icon: Icon,
  action,
  time,
}: {
  icon: React.ElementType;
  action: string;
  time: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-1.5 bg-primary/10 rounded mt-0.5">
        <Icon className="h-3 w-3" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm">{action}</p>
        <p className="text-xs text-accent">{time}</p>
      </div>
    </div>
  );
}
