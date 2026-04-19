import { UserButton } from "@neondatabase/neon-js/auth/react"

export default function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-4">
        <h1 className="text-lg font-semibold">Notes</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-1">
          <a
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <span>📝</span>
            My Notes
          </a>
          <a
            href="/shared"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <span>🤝</span>
            Team Notes
          </a>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserButton size="icon" />
            <span className="text-sm text-muted-foreground">Account</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
