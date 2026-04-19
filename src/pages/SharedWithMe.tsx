import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router"
import { neon } from "@/neon"
import type { Note } from "@/db/schema"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SharedNote extends Note {
  sharedByUserId: string
}

function SharedNoteCard({
  note,
  sharedBy,
  onClick,
}: {
  note: SharedNote
  sharedBy: string
  onClick: () => void
}) {
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
          <Badge variant="outline">Shared</Badge>
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {preview}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">Shared by {sharedBy}</p>
      </CardContent>
    </Card>
  )
}

export default function SharedWithMe() {
  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const { data: session } = neon.auth.useSession()

  const fetchSharedNotes = useCallback(async () => {
    if (!session?.user) return
    setIsLoading(true)
    const { data: shares } = await neon
      .from("note_shares")
      .select("note_id, shared_with_user_id")
      .eq("shared_with_user_id", session!.user.id)

    if (shares && shares.length > 0) {
      const noteIds = shares.map((s: { note_id: string }) => s.note_id)
      const { data: notesData } = await neon
        .from("notes")
        .select("*")
        .in("id", noteIds)

      if (notesData) {
        const notesWithSharedBy = notesData.map((note) => ({
          ...note,
          sharedByUserId: shares.find(
            (s: { note_id: string }) => s.note_id === note.id
          )?.shared_with_user_id,
        })) as SharedNote[]
        setSharedNotes(notesWithSharedBy)
      }
    }
    setIsLoading(false)
  }, [session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSharedNotes()
  }, [fetchSharedNotes])

  const filteredNotes = sharedNotes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <h2 className="text-lg font-semibold">Shared with Me</h2>
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
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
            <div className="mb-4 text-5xl">🤝</div>
            <h3 className="mb-2 text-lg font-medium">No shared notes</h3>
            <p className="text-sm text-muted-foreground">
              Notes shared with you will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <SharedNoteCard
                key={note.id}
                note={note}
                sharedBy={note.sharedByUserId || "Unknown"}
                onClick={() => navigate(`/notes/${note.id}`)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
