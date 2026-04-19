import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router"
import { SignedIn, RedirectToSignIn } from "@neondatabase/neon-js/auth/react/ui"
import Sidebar from "./components/layout/Sidebar"
import Dashboard from "./pages/Dashboard"
import NoteEditor from "./pages/NoteEditor"
import TeamNotes from "./pages/TeamNotes"
import Auth from "./pages/Auth"

function Layout() {
  return (
    <SignedIn>
      <div className="flex h-screen bg-background font-sans text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </SignedIn>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notes/:id" element={<NoteEditor />} />
        <Route path="/shared" element={<TeamNotes />} />
      </Route>

      <Route path="/auth/:path" element={<Auth />} />
      <Route path="*" element={<RedirectToSignIn />} />
    </>
  )
)

export default function App() {
  return <RouterProvider router={router} />
}
