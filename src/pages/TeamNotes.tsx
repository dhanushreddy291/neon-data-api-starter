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
import { SearchIcon } from "lucide-react"
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
          <Badge variant="outline">Team</Badge>
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {preview}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
          })}
        </p>
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
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <h2 className="text-lg font-semibold">Team Notes</h2>
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
            <h3 className="mb-2 text-lg font-medium">No team notes</h3>
            <p className="text-sm text-muted-foreground">
              Notes shared with the team will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
