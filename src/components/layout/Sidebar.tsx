import { UserButton } from "@neondatabase/neon-js/auth/react"
import { FileTextIcon, UsersIcon, MenuIcon } from "lucide-react"
import { Link, useLocation } from "react-router"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

function SidebarContent() {
  return (
    <>
      <div className="flex h-14 items-center border-b border-border/50 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <svg
              className="h-4 w-4 text-white"
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
          <h1 className="text-lg font-semibold tracking-tight">Notes</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-1">
          <Link
            to="/notes"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-primary/10 hover:text-primary"
          >
            <FileTextIcon className="h-4 w-4" />
            My Notes
          </Link>
          <Link
            to="/shared"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
          >
            <UsersIcon className="h-4 w-4" />
            Team Notes
          </Link>
        </div>
      </nav>

      <div className="border-t border-border/50 p-3">
        <Link
          to="/account/settings"
          className="flex items-center gap-3 rounded-xl bg-slate-100/50 p-2 transition-all hover:bg-slate-200/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50"
        >
          <UserButton
            size="icon"
            className="rounded-xl ring-2 ring-primary/20 hover:ring-primary/40"
            classNames={{
              trigger: {
                base: "!h-10 !w-10",
              },
            }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Account</span>
            <span className="text-xs text-muted-foreground">
              Manage settings
            </span>
          </div>
        </Link>
      </div>
    </>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const isNoteEditor = location.pathname.startsWith("/notes/")

  return (
    <>
      <aside className="hidden h-full w-64 flex-col border-r border-border/50 bg-white/30 backdrop-blur-sm md:flex dark:bg-slate-900/30">
        <SidebarContent />
      </aside>

      {!isNoteEditor && (
        <Sheet>
          <SheetTrigger asChild className="fixed top-2.5 left-4 z-40 md:hidden">
            <Button variant="outline" size="icon">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col bg-white/30 backdrop-blur-sm dark:bg-slate-900/30">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
