import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router"
import { neon } from "@/neon"
import type { Note } from "@/db/schema"
import type { Database } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeftIcon,
  ShareIcon,
  TrashIcon,
  GlobeIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  const isOwner = note ? session?.user?.id === note.ownerId : false

  const saveNote = useCallback(async () => {
    if (!id || !content || !isOwner) return
    setIsSaving(true)
    await neon.from("notes").update({ content }).eq("id", id)
    setIsSaving(false)
    setLastSaved(new Date())
  }, [id, content, isOwner])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOwner && content !== note?.content) {
        saveNote()
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [content, note?.content, saveNote, isOwner])

  const handleDelete = async () => {
    if (!id) return
    await neon.from("notes").delete().eq("id", id)
    navigate("/notes")
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
        <p className="text-muted-foreground">
          Note not found, or you don't have access to it.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border/50 bg-white/30 px-4 backdrop-blur-sm sm:px-6 dark:bg-slate-900/30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate("/notes")}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <FileTextIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="max-w-[120px] truncate text-sm font-medium sm:max-w-[200px]">
              {note.content?.split("\n")[0].slice(0, 30) || "Untitled"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && isSaving ? (
              <Badge variant="secondary" className="rounded-lg text-xs">
                <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                Saving...
              </Badge>
            ) : isOwner && lastSaved ? (
              <Badge
                variant="secondary"
                className="hidden rounded-lg text-xs sm:inline-flex"
              >
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Saved
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session?.user?.id === note.ownerId && (
            <Button
              variant={note.isShared ? "default" : "outline"}
              size="sm"
              onClick={handleToggleShare}
              className="rounded-xl"
            >
              {note.isShared ? (
                <>
                  <GlobeIcon className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Stop Sharing</span>
                  <span className="sm:hidden">Shared</span>
                </>
              ) : (
                <>
                  <ShareIcon className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Share with Team</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </Button>
          )}

          {session?.user?.id === note.ownerId && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}

          <UserButton
            size="icon"
            className="rounded-xl ring-2 ring-primary/20 hover:ring-primary/40"
            classNames={{
              trigger: {
                base: "!h-10 !w-10",
              },
            }}
          />
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-4 border-b border-border/30 bg-white/20 px-6 py-3 backdrop-blur-sm dark:bg-slate-900/20">
          {note.createdAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>
                {new Date(note.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
          {note.updatedAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>
                {new Date(note.updatedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Textarea
            value={content}
            onChange={(e) => isOwner && setContent(e.target.value)}
            placeholder={
              isOwner
                ? "Start writing your note..."
                : "You don't have permission to edit this note."
            }
            readOnly={!isOwner}
            className="min-h-full resize-none border-0 bg-transparent text-base leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 lg:text-lg"
          />
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-100">
          <DialogHeader>
            <DialogTitle>Delete note?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              note and stop sharing it with your team.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false)
                handleDelete()
              }}
              className="rounded-lg"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
