import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router"
import { neon } from "@/neon"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SearchIcon, UsersIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Note } from "@/db/schema"
import type { Database } from "@/types"

function mapNote(row: Database["public"]["Tables"]["notes"]["Row"]): Note {
  return {
    id: row.id,
    ownerId: row.owner_id,
    content: row.content,
    isShared: row.is_shared,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function TeamNoteCard({ note, onClick }: { note: Note; onClick: () => void }) {
  if (!note || !note.content || !note.createdAt) {
    return null
  }

  const preview = note.content.slice(0, 100)
  const title = note.content.split("\n")[0].slice(0, 50) || "Untitled"
  const date = new Date(note.createdAt)

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 dark:bg-slate-900/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-600 dark:from-emerald-900/50 dark:to-teal-900/50 dark:text-emerald-400">
              <UsersIcon className="h-4 w-4" />
            </div>
            <CardTitle className="line-clamp-1 text-base font-medium">
              {title}
            </CardTitle>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            Team
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {preview}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TeamNotes() {
  const [teamNotes, setTeamNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const { data: session } = neon.auth.useSession()

  const fetchTeamNotes = useCallback(async () => {
    if (!session?.user) return
    setIsLoading(true)
    const { data } = await neon.from("notes").select("*").eq("is_shared", true)

    if (data && data.length > 0) {
      setTeamNotes(
        data.map((row) =>
          mapNote(row as Database["public"]["Tables"]["notes"]["Row"])
        )
      )
    }
    setIsLoading(false)
  }, [session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeamNotes()
  }, [fetchTeamNotes])

  const filteredNotes = teamNotes.filter((note) =>
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between gap-4 border-b border-border/50 bg-white/30 px-6 pl-14 backdrop-blur-sm md:pl-4 dark:bg-slate-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold tracking-tight whitespace-nowrap">
            Team Notes
          </h2>
        </div>
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 rounded-xl border-border/50 bg-white/50 pl-9 backdrop-blur-sm focus:bg-white sm:w-56 dark:bg-slate-800/50 dark:focus:bg-slate-800"
          />
        </div>
      </header>

      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg dark:from-emerald-900/50 dark:to-teal-900/50">
              <UsersIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No team notes</h3>
            <p className="text-sm text-muted-foreground">
              Notes shared with the team will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <TeamNoteCard
                key={note.id}
                note={note}
                onClick={() => navigate(`/notes/${note.id}`)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
