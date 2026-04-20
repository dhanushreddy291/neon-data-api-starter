import { AuthView } from "@neondatabase/neon-js/auth/react/ui"
import { useParams } from "react-router"

export default function AuthPage() {
  const { path } = useParams()
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-violet-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-200/30 via-transparent to-transparent dark:from-violet-900/10" />
      <div className="relative flex min-h-screen items-center justify-center p-8">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <svg
              className="h-6 w-6 text-white"
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Neon Notes
          </h2>
          <p className="text-sm text-muted-foreground">
            Collaborative notes powered by Neon
          </p>
        </div>
        <AuthView
          className="w-full max-w-sm rounded-2xl border border-border/50 bg-white/80 shadow-xl shadow-violet-500/5 backdrop-blur-sm dark:bg-slate-900/80"
          path={path}
        />
      </div>
    </div>
  )
}
