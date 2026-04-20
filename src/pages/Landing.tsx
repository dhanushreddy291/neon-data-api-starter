import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Bolt,
  BookOpen,
  Database,
  Globe,
  Lock,
  Sparkles,
  Users,
} from "lucide-react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const featureCards: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
    {
      title: "Auth-Ready Routes",
      description: "Sign-in, account, and protected app routes wired for Neon Auth.",
      icon: Database,
    },
    {
      title: "Data API Patterns",
      description: "Typed note queries and mutations through Neon Data API helpers.",
      icon: Lock,
    },
    {
      title: "Notes Demo Included",
      description: "A practical CRUD example to show app structure and data flow.",
      icon: Users,
    },
    {
      title: "Production Baseline",
      description: "Clean UI primitives, route layout, and schema workflow to build on.",
      icon: Globe,
    },
    {
      title: "Pure Client-Side Code",
      description: "No API routes or server components, all the auth and data logic lives in the React app.",
      icon: Sparkles,
    }
  ]

const stack = [
  "React 19",
  "TypeScript",
  "Vite",
  "React Router 7",
  "Tailwind v4",
  "shadcn/ui",
  "Neon Auth",
  "Neon Data API",
  "Drizzle",
]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h/0.14),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <header className="sticky top-0 z-20 border-b bg-background/75 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg border bg-card text-primary">
              <Bolt className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">Neon Notes Starter</span>
          </div>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground" href="#how-it-works">
              How it works
            </a>
            <a className="transition-colors hover:text-foreground" href="#stack">
              Stack
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link to="/notes">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/notes">Open app</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-5 pb-16 pt-16 md:px-8 md:pt-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-7 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              <Sparkles className="size-3.5" />
              Now with Neon Auth + Data API
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="max-w-2xl text-balance font-heading text-4xl leading-[0.98] font-semibold tracking-tight md:text-6xl">
                Vite + Neon Auth/Data API starter with a notes demo app.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                Start from a practical baseline: auth flows, typed data access,
                and a real notes example you can extend into your product.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/notes">
                  Get started
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#features">
                  Explore features
                  <BookOpen data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden border-0 bg-card/75 shadow-xl ring-1 ring-border backdrop-blur motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-5 motion-safe:duration-700 motion-safe:delay-150">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_l_c_h/0.25),transparent_72%)]"
            />
            <CardHeader className="relative border-b">
              <CardTitle>Starter template highlights</CardTitle>
              <CardDescription>
                Built to demonstrate Neon Auth and Data API patterns with a practical notes app example. Update and expand the included features to jumpstart your own product development.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative grid gap-4 py-1">
              {[
                "Sign-in, sign-up, and account management screens",
                "Neon Data API note operations with strong typing",
                "Drizzle schema + migration workflow for app data",
                "Personal and team notes pages for feature demos",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border bg-background/70 px-4 py-3"
                >
                  <div className="mt-0.5 size-2 rounded-full bg-primary" />
                  <p className="text-sm text-foreground/90">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section
          id="features"
          className="flex flex-col gap-8 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-700 motion-safe:delay-200"
        >
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              What this starter gives you
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Focus on product behavior while authentication, data plumbing, and the core UI framework are preconfigured.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featureCards.map((feature, index) => (
              <Card
                key={feature.title}
                className="bg-card/70 shadow-sm ring-border/70 backdrop-blur motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <CardHeader className="gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border bg-background text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid gap-4 rounded-2xl border bg-card/70 p-6 shadow-xs backdrop-blur md:grid-cols-3"
        >
          {[
            {
              step: "01",
              title: "Install and run",
              detail: "Get the starter running locally with Neon Auth and Data API configured out of the box.",
            },
            {
              step: "02",
              title: "Customize the notes demo",
              detail: "Expand note editing, tagging, sharing, and team workflows with existing patterns.",
            },
            {
              step: "03",
              title: "Ship your app",
              detail: "Deploy the same Neon-backed architecture used during local development.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3 rounded-xl border p-4">
              <Badge variant="outline" className="w-fit rounded-full px-2.5 py-0.5">
                {item.step}
              </Badge>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </section>

        <section id="stack" className="flex flex-col gap-4">
          <p className="text-center text-sm uppercase tracking-[0.14em] text-muted-foreground">
            Starter stack
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {stack.map((item) => (
              <Badge key={item} variant="secondary" className="rounded-full px-3 py-1">
                {item}
              </Badge>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/75">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Neon Notes Starter
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a className="transition-colors hover:text-foreground" href="#how-it-works">
              Process
            </a>
            <Separator orientation="vertical" className="h-4" />
            <Link className="transition-colors hover:text-foreground" to="/notes">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
