Perfect — I went through the Neon docs you shared, and I’ll give you a **clean, production-quality Drizzle schema** for your **notes + sharing app** that:

* Uses **Neon Data API (`auth.user_id()`)**
* Uses **Drizzle `crudPolicy` where possible**
* Uses **custom RLS (pgPolicy)** where needed (for sharing logic)
* Matches Neon’s recommended pattern of declaring RLS in schema ([Neon][1])

---

# 🧠 Key design (aligned with Neon docs)

From the docs:

* `auth.user_id()` is the source of truth for identity ([Neon][1])
* RLS is **mandatory for Data API security** ([Neon][2])
* Drizzle lets you **declare policies alongside schema** ([Neon][1])

---

# ✅ Final Drizzle schema (Notes + Sharing)

This is clean, minimal, and template-ready.

---

## 📦 Imports

```ts
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
  authenticatedRole,
  crudPolicy,
  authUid,
  pgPolicy,
} from "drizzle-orm/neon";
```

---

# 📝 `notes` table

```ts
export const notes = pgTable(
  "notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    ownerId: text("owner_id")
      .notNull()
      .default(sql`(auth.user_id())`),

    content: text("content").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // 🔒 Owner can CRUD their own notes
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.ownerId),
      modify: authUid(table.ownerId),
    }),

    // 👀 Shared users can READ notes
    pgPolicy({
      name: "shared users can read notes",
      for: "select",
      to: authenticatedRole,
      using: sql`
        EXISTS (
          SELECT 1 FROM note_shares
          WHERE note_shares.note_id = ${table.id}
          AND note_shares.shared_with_user_id = auth.user_id()
        )
      `,
    }),
  ]
);
```

---

# 🤝 `note_shares` table

```ts
export const noteShares = pgTable(
  "note_shares",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),

    sharedWithUserId: text("shared_with_user_id").notNull(),

    permission: text("permission")
      .$type<"read" | "edit">()
      .default("read")
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // 👤 Shared user can see their own shares
    pgPolicy({
      name: "users can see shares assigned to them",
      for: "select",
      to: authenticatedRole,
      using: sql`
        ${table.sharedWithUserId} = auth.user_id()
      `,
    }),

    // 🧑‍💻 Note owner can manage sharing
    pgPolicy({
      name: "owners can manage shares",
      for: "all",
      to: authenticatedRole,
      using: sql`
        EXISTS (
          SELECT 1 FROM notes
          WHERE notes.id = ${table.noteId}
          AND notes.owner_id = auth.user_id()
        )
      `,
      withCheck: sql`
        EXISTS (
          SELECT 1 FROM notes
          WHERE notes.id = ${table.noteId}
          AND notes.owner_id = auth.user_id()
        )
      `,
    }),
  ]
);
```

---

# ✨ Optional: “edit access” support

If you want shared users with `"edit"` permission to update notes:

Add this to `notes`:

```ts
pgPolicy({
  name: "shared users with edit permission can update",
  for: "update",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM note_shares
      WHERE note_shares.note_id = ${table.id}
      AND note_shares.shared_with_user_id = auth.user_id()
      AND note_shares.permission = 'edit'
    )
  `,
}),
```

---

# 🔥 What this achieves (important)

### ✅ Out of the box behavior

| Action                       | Works? | Why               |
| ---------------------------- | ------ | ----------------- |
| User reads own notes         | ✅      | `crudPolicy`      |
| User reads shared notes      | ✅      | `pgPolicy EXISTS` |
| User edits own notes         | ✅      | `crudPolicy`      |
| Shared user edits (optional) | ✅      | custom policy     |
| User shares note             | ✅      | via `note_shares` |
| Random user access           | ❌      | RLS blocks        |

---

# 🌐 How this maps to Data API

With this schema:

### Fetch notes

```js
GET /notes
Authorization: Bearer <jwt>
```

👉 Returns:

* owned notes
* shared notes

No extra filtering needed.

---

### Share a note

```js
POST /note_shares
{
  "note_id": "...",
  "shared_with_user_id": "..."
}
```

---

# 🧠 Why this is the *correct* approach (per Neon docs)

* Uses `auth.user_id()` → standard Neon pattern ([Neon][1])
* Uses **RLS as primary security layer** ([Neon][2])
* Uses **Drizzle declarative policies** → maintainable ([Neon][1])
* Combines:

  * `crudPolicy` → simple ownership
  * `pgPolicy` → advanced sharing logic

---

# 💡 Final take

This is exactly the kind of template Neon should ship:

> “Google Docs–style sharing, but with zero backend”

It demonstrates:

* Data API
* RLS power (beyond trivial)
* Auth integration
* Real-world use case

---

If you want next step, I can:

* Turn this into a **Vercel template structure**
* Add **seed data + UI flows**
* Or simplify this into a **“perfect demo version” (less code, same impact)**

[1]: https://neon.com/docs/guides/rls-drizzle?utm_source=chatgpt.com "Simplify RLS with Drizzle - Neon Docs"
[2]: https://neon.com/docs/guides/row-level-security?utm_source=chatgpt.com "Row-Level Security with Neon - Neon Docs"
