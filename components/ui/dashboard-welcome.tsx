interface DashboardWelcomeProps {
  name?: string;
}

export function DashboardWelcome({ name }: DashboardWelcomeProps) {
  return (
    <div className="mb-6 rounded-xl bg-disoriti-primary/10 px-6 py-4 text-disoriti-primary shadow-sm">
      <h1 className="text-2xl font-bold">Welcome back{ name ? `, ${name}` : '' }!</h1>
      <p className="mt-1 text-disoriti-primary/80">Ready to create something amazing today? 🚀</p>
    </div>
  );
} 