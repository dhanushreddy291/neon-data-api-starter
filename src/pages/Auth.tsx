import { AuthView } from "@neondatabase/neon-js/auth/react/ui"
import { useParams } from "react-router"

export default function AuthPage() {
  const { path } = useParams()
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-8">
      <AuthView className="max-w-md w-full" path={path} />
    </div>
  )
}
