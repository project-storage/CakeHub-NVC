import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Orders Cake
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg">
          A modernized frontend architecture built with Next.js 15, App Router, Zustand, and TanStack Query.
        </p>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
