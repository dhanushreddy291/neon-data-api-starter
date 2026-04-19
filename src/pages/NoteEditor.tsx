import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router"
import { neon } from "@/neon"
import type { Note, NoteShare } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  XIcon,
} from "lucide-react"
import { UserButton } from "@neondatabase/neon-js/auth/react"

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [shares, setShares] = useState<NoteShare[]>([])

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
      setNote(noteResult.data as Note)
      setContent((noteResult.data as Note).content)
    }

    const sharesResult = await neon
      .from("note_shares")
      .select("*")
      .eq("note_id", id)

    if (!sharesResult.error && sharesResult.data) {
      setShares(sharesResult.data as NoteShare[])
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

  const handleShare = async () => {
    if (!id || !shareEmail) return
    await neon.from("note_shares").insert({
      note_id: id,
      shared_with_user_id: shareEmail,
      permission: "read",
    })
    setShareEmail("")
    loadNoteData()
  }

  const handleUnshare = async (shareId: string) => {
    await neon.from("note_shares").delete().eq("id", shareId)
    loadNoteData()
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
        <p className="text-muted-foreground">Note not found</p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareModal(true)}
          >
            <ShareIcon className="mr-1 h-4 w-4" />
            Share
          </Button>

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

      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>Add people to view this note</DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 py-4">
            <Input
              placeholder="Enter email or user ID"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
            <Button onClick={handleShare}>Add</Button>
          </div>

          <Separator />

          <div className="max-h-48 overflow-y-auto py-2">
            {shares.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No one has access yet
              </p>
            ) : (
              shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {share.sharedWithUserId[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm">{share.sharedWithUserId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Read</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnshare(share.id)}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
