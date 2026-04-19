import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router"
import { neon } from "@/neon"
import type { Note } from "@/db/schema"
import type { Database } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeftIcon,
  ShareIcon,
  TrashIcon,
  MoreHorizontalIcon,
  GlobeIcon,
} from "lucide-react"
import { UserButton } from "@neondatabase/neon-js/auth/react"

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

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const { data: session } = neon.auth.useSession()

  const loadNoteData = useCallback(async () => {
    if (!id || !session?.user) return
    setIsLoading(true)

    const noteResult = await neon
      .from("notes")
      .select("*")
      .eq("id", id)
      .single()

    if (!noteResult.error && noteResult.data) {
      const mapped = mapNote(
        noteResult.data as Database["public"]["Tables"]["notes"]["Row"]
      )
      setNote(mapped)
      setContent(mapped.content || "")
    }

    setIsLoading(false)
  }, [id, session?.user])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNoteData()
  }, [loadNoteData])

  const saveNote = useCallback(async () => {
    if (!id || !content) return
    setIsSaving(true)
    await neon.from("notes").update({ content }).eq("id", id)
    setIsSaving(false)
    setLastSaved(new Date())
  }, [id, content])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== note?.content) {
        saveNote()
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [content, note?.content, saveNote])

  const handleDelete = async () => {
    if (!id) return
    await neon.from("notes").delete().eq("id", id)
    navigate("/")
  }

  const handleToggleShare = async () => {
    if (!id || !note) return
    const newIsShared = !note.isShared
    await neon.from("notes").update({ is_shared: newIsShared }).eq("id", id)
    setNote({ ...note, isShared: newIsShared })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Note not found, or you don't have access to it.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {isSaving ? (
              <Badge variant="secondary">Saving...</Badge>
            ) : lastSaved ? (
              <Badge variant="secondary">Saved</Badge>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session?.user?.id === note.ownerId && (
            <Button
              variant={note.isShared ? "default" : "outline"}
              size="sm"
              onClick={handleToggleShare}
            >
              {note.isShared ? (
                <>
                  <GlobeIcon className="mr-1 h-4 w-4" />
                  Stop Sharing
                </>
              ) : (
                <>
                  <ShareIcon className="mr-1 h-4 w-4" />
                  Share with Team
                </>
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserButton />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="min-h-full resize-none border-0 bg-transparent text-lg leading-relaxed focus-visible:ring-0"
        />
      </div>
    </div>
  )
}
