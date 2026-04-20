import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router"
import { SignedIn, RedirectToSignIn } from "@neondatabase/neon-js/auth/react/ui"
import Sidebar from "./components/layout/Sidebar"
import Dashboard from "./pages/Dashboard"
import NoteEditor from "./pages/NoteEditor"
import TeamNotes from "./pages/TeamNotes"
import Auth from "./pages/Auth"
import Account from "./pages/Account"
import Landing from "./pages/Landing"

function NotesLayout() {
  return (
    <>
      <SignedIn>
        <div className="flex h-screen bg-white dark:bg-slate-950">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </SignedIn>
      <RedirectToSignIn />
    </>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Landing />} />

      <Route path="/home" element={<Landing />} />

      <Route path="/auth/:path" element={<Auth />} />

      <Route element={<NotesLayout />}>
        <Route path="/notes" element={<Dashboard />} />
        <Route path="/notes/:id" element={<NoteEditor />} />
        <Route path="/shared" element={<TeamNotes />} />
      </Route>

      <Route path="/account/:path" element={<Account />} />

      <Route
        path="*"
        element={
          <SignedIn>
            <Navigate to="/notes" />
          </SignedIn>
        }
      />
    </>
  )
)

export default function App() {
  return <RouterProvider router={router} />
}
