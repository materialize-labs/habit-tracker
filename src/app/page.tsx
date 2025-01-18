import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to Habit Tracker</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          A minimalist app to help you build and maintain good habits, one day at a time.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
