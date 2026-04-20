import { Link } from "react-router"

const techStack = [
  "React 19",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "shadcn/ui",
  "Neon Postgres",
  "Drizzle ORM",
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-semibold">Notes</span>
          </div>
          <Link
            to="/notes"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-80"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Your notes, organized
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            A simple notes app for capturing ideas and staying productive.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border p-6">
            <h3 className="mb-2 font-medium">Create notes</h3>
            <p className="text-sm text-muted-foreground">
              Write and organize your thoughts with a clean editor.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="mb-2 font-medium">Share with team</h3>
            <p className="text-sm text-muted-foreground">
              Share notes with your team and collaborate in real-time.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="mb-2 font-medium">Access anywhere</h3>
            <p className="text-sm text-muted-foreground">
              Sign in from any device and pick up where you left off.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">Built with</p>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
