import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router"
import { neon } from "@/neon"
import type { Note } from "@/db/schema"
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
import { PlusIcon, SearchIcon } from "lucide-react"

function NoteCard({ note, onClick }: { note: Note; onClick: () => void }) {
  const preview = note.content.slice(0, 100)
  const title = note.content.split("\n")[0].slice(0, 50) || "Untitled"

  return (
    <Card
      className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-base font-medium">
            {title}
          </CardTitle>
          <Badge variant="secondary">You</Badge>
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {preview}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
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
      .order("created_at", { ascending: false })

    if (!error && data) {
      setNotes(data as Note[])
    }
    setIsLoading(false)
  }, [])

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
      navigate(`/notes/${(data as Note).id}`)
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <h2 className="text-lg font-semibold">My Notes</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
          <Button onClick={handleCreateNote} size="sm">
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
            <div className="mb-4 text-5xl">📝</div>
            <h3 className="mb-2 text-lg font-medium">No notes yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first note to get started
            </p>
            <Button onClick={handleCreateNote}>
              <PlusIcon className="mr-1 h-4 w-4" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
