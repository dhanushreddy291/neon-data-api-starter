import { AccountView } from "@neondatabase/neon-js/auth/react/ui"
import { useParams } from "react-router"

export default function AccountPage() {
  const { path } = useParams()
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-primary/5 via-white to-primary/10 dark:from-slate-950 dark:via-slate-900 dark:to-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-primary/5" />
      <div className="relative flex min-h-screen items-center justify-center p-8">
        <AccountView
          className="w-full max-w-4xl rounded-2xl border border-border/50 bg-white/80 p-6 shadow-xl shadow-primary/5 backdrop-blur-sm dark:bg-slate-900/80"
          pathname={path}
        />
      </div>
    </div>
  )
}
