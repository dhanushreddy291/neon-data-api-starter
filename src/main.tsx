import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import App from "./App.tsx"
import { neon } from "./neon.ts"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NeonAuthUIProvider
      authClient={neon.auth}
      emailOTP
      social={{ providers: ["google"] }}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </NeonAuthUIProvider>
  </StrictMode>
)
