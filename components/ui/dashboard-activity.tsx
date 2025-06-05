interface ActivityItem {
  id: string;
  message: string;
  time: string;
}

interface DashboardActivityProps {
  activities: ActivityItem[];
}

export function DashboardActivity({ activities }: DashboardActivityProps) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-white">Recent Activity</h2>
      <ul className="space-y-3">
        {activities.length === 0 ? (
          <li className="text-disoriti-primary/60">No recent activity.</li>
        ) : (
          activities.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-disoriti-primary" />
              <div>
                <span className="text-white">{item.message}</span>
                <span className="ml-2 text-xs text-disoriti-primary/60">{item.time}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
} 