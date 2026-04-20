import { Link } from "react-router"

const appFeatures = [
  {
    title: "Create notes",
    description:
      "Write and organize your thoughts with a clean, minimal editor.",
  },
  {
    title: "Share with team",
    description: "Share notes with your team and collaborate in real-time.",
  },
  {
    title: "Access anywhere",
    description: "Sign in from any device and pick up where you left off.",
  },
  {
    title: "Dark mode",
    description: "Toggle between light and dark. Press D to switch.",
  },
]

const techStack = [
  {
    title: "React 19",
    description: "Modern React with hooks and concurrent features.",
  },
  {
    title: "TypeScript",
    description: "Type-safe JavaScript for better developer experience.",
  },
  { title: "Vite 7", description: "Fast build tool and dev server." },
  { title: "Tailwind CSS v4", description: "Utility-first CSS framework." },
  { title: "shadcn/ui", description: "Beautiful, accessible UI components." },
  { title: "React Router v7", description: "File-based routing for React." },
  { title: "Neon Postgres", description: "Serverless Postgres database." },
  {
    title: "Neon Auth",
    description: "Authentication with email OTP and Google OAuth.",
  },
  {
    title: "Neon Data API",
    description: "PostgREST-style API for your database.",
  },
  {
    title: "Drizzle ORM",
    description: "Type-safe database queries and migrations.",
  },
  {
    title: "Row Level Security",
    description: "PostgreSQL RLS policies for data protection.",
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
              <svg
                className="h-4 w-4 text-white dark:text-slate-900"
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
            <span className="font-semibold text-slate-900 dark:text-white">
              Notes
            </span>
          </div>
          <Link
            to="/notes"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-white">
            Your notes, organized
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-600 dark:text-slate-400">
            A simple notes app for capturing ideas, sharing with your team, and
            staying productive.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Features
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {appFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              >
                <h3 className="mb-2 font-medium text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Built with
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => (
              <div
                key={tech.title}
                className="rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              >
                <h3 className="mb-2 font-medium text-slate-900 dark:text-white">
                  {tech.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
