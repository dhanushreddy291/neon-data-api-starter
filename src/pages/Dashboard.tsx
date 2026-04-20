import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router"
import { neon } from "@/neon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusIcon, SearchIcon, FileTextIcon } from "lucide-react"
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

function NoteCard({ note, onClick }: { note: Note; onClick: () => void }) {
  if (!note || !note.content || !note.createdAt) {
    return null
  }

  const preview = note.content.slice(0, 100)
  const title = note.content.split("\n")[0].slice(0, 50) || "Untitled"
  const date = new Date(note.createdAt)

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 dark:bg-slate-900/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              <FileTextIcon className="h-4 w-4" />
            </div>
            <CardTitle className="line-clamp-1 text-base font-medium">
              {title}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            You
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

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const { data: session } = neon.auth.useSession()

  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await neon
      .from("notes")
      .select("*")
      .eq("owner_id", session?.user?.id || "")
      .order("created_at", { ascending: false })

    if (!error && data) {
      const notes: Note[] = data.map(mapNote)
      setNotes(notes)
    }
    setIsLoading(false)
  }, [session])

  useEffect(() => {
    if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNotes()
    }
  }, [session, fetchNotes])

  const handleCreateNote = async () => {
    const { data } = await neon
      .from("notes")
      .insert({ content: "" })
      .select()
      .single()

    if (data) {
      navigate(
        `/notes/${mapNote(data as Database["public"]["Tables"]["notes"]["Row"]).id}`
      )
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between gap-4 border-b border-border/50 bg-white/30 px-6 pl-14 backdrop-blur-sm md:pl-4 dark:bg-slate-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold tracking-tight whitespace-nowrap">
            My Notes
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 rounded-xl border-border/50 bg-white/50 pl-9 backdrop-blur-sm focus:bg-white sm:w-56 dark:bg-slate-800/50 dark:focus:bg-slate-800"
            />
          </div>
          <Button
            onClick={handleCreateNote}
            className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90"
          >
            <PlusIcon className="mr-1 h-4 w-4" />
            New Note
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-lg dark:bg-primary/20">
              <FileTextIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No notes yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first note to get started
            </p>
            <Button
              onClick={handleCreateNote}
              className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90"
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <NoteCard
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
