# 📝 Notes App (with Sharing) — UI Specification

## 🎨 Design Direction

* Clean, minimal, modern (inspired by Notion / Linear)
* Light + dark mode support
* Soft shadows, rounded corners (`rounded-xl`)
* Subtle borders, neutral colors
* Focus on typography + whitespace

---

# 📄 1. Auth Page (Login / Signup)

### Layout

* Centered card
* Split screen (optional):

  * Left: branding / illustration
  * Right: auth form

### UI Elements

* Logo (top)
* Heading: **“Welcome back”**
* Input:

  * Email
  * Password (or magic link)
* Buttons:

  * “Continue”
* Divider: `or`
* OAuth buttons (Clerk / Google)

### Notes

* Keep friction low (prefer magic link if possible)

---

# 🏠 2. Dashboard (Notes List)

### Layout

* Sidebar (left)
* Main content (right)

---

## Sidebar

* App logo
* “New Note” button (primary)
* Navigation:

  * 📝 My Notes
  * 🤝 Shared with Me
* User profile (bottom)

---

## Main Content

### Header

* Title: **“My Notes”**
* Search bar (top right)
* Optional filter dropdown

---

### Notes Grid/List

Each note card:

* Title (first line of content)
* Preview (2 lines)
* Metadata:

  * “You” or “Shared”
  * Created date

👉 Style:

* Card with hover effect
* Subtle border
* Slight scale on hover

---

### Empty State

* Icon (document)
* Text: “No notes yet”
* CTA: **“Create your first note”**

---

# ✍️ 3. Note Editor Page

### Layout

* Full-width editor
* Minimal distractions

---

## Header

* Back button ←
* Title (editable inline)
* Actions (right side):

  * Share button
  * Delete (icon)
  * More menu (⋯)

---

## Editor Area

* Large text area
* Placeholder:

  > “Start writing…”

Optional:

* Auto-save indicator (“Saved”)

---

## UX Details

* Clean typography (Notion-like)
* No heavy toolbar (keep minimal)

---

# 🤝 4. Share Modal

### Trigger

* Click “Share” button in editor

---

## Modal Layout

* Title: **“Share Note”**
* Input:

  * “Enter email or user ID”
* Button: **“Add”**

---

## Shared Users List

Each row:

* Avatar (or initials)
* Email / name
* Permission dropdown:

  * Read
  * Edit
* Remove (✕ icon)

---

## Footer

* Close button
* Optional: “Copy link” (future)

---

# 👀 5. Shared with Me Page

### Layout

Same as Dashboard

---

## Header

* Title: **“Shared with Me”**

---

## Notes List

* Same card UI as dashboard
* Label:

  * “Shared by <user>”

---

# 👤 6. Profile Dropdown

### Trigger

* Bottom-left avatar

---

### Menu

* Name + email
* Divider
* Logout

---

# 🔍 7. Search (Optional but powerful)

### Behavior

* Live filtering notes
* Searches:

  * Content
  * Titles

---

# ⚡ Micro-interactions

* Hover:

  * Cards lift slightly
* Click:

  * Smooth transitions
* Save:

  * “Saving…” → “Saved”
* Share:

  * Instant update in UI

---

# 📱 Responsive Behavior

### Mobile

* Sidebar → collapsible drawer
* Notes → stacked list
* Editor → full screen

---

# 🧠 UX Principles (important for template)

* No clutter
* No config screens
* No onboarding