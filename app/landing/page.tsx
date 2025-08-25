"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FeatureCard } from "@/components/ui/feature-card"
import { Bot, Sparkles, Zap, ShieldCheck, Rocket, Wand2, Image as ImageIcon, CheckCircle2, HelpCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-accent" />
            <span className="font-semibold">Disoriti</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="hover:text-primary">Features</Link>
            <Link href="#how" className="hover:text-primary">How it works</Link>
            <Link href="#pricing" className="hover:text-primary">Pricing</Link>
            <Link href="#faq" className="hover:text-primary">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-12 md:pt-28 md:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                AI-powered ad generator
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Create high‑converting ads in minutes with AI
              </h1>
              <p className="text-muted-foreground max-w-prose">
                Disoriti helps you generate visuals and copy that match your brand. Go from idea to polished ad in record time.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">Try free</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">Sign in</Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />No credit card required</div>
                <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-accent" />Start in under 2 minutes</div>
              </div>
            </div>
            <div className="relative">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Live preview</CardTitle>
                  <CardDescription>See how Disoriti assembles your ad content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/10] rounded-lg border bg-background/60 backdrop-blur-sm grid place-items-center text-muted-foreground">
                    <div className="flex items-center gap-2 text-sm"><Wand2 className="h-4 w-4 text-primary" /> AI composing layout…</div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -bottom-6 -right-6 hidden md:block">
                <div className="rounded-xl border bg-background px-4 py-2 shadow">
                  <div className="flex items-center gap-2 text-sm"><ImageIcon className="h-4 w-4 text-accent" /> Brand‑safe palette applied</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Everything you need to launch</h2>
          <p className="text-muted-foreground mt-2">From concept to campaign — fast, consistent, and on‑brand.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="AI image generation"
            description="Create platform‑ready visuals with on‑brand color and style."
            icon={ImageIcon}
            href="/dashboard/create/media"
          />
          <FeatureCard
            title="Copy that converts"
            description="Headlines, hooks, and CTAs generated to fit your visual."
            icon={Wand2}
            href="/dashboard/create/ai-content"
          />
          <FeatureCard
            title="Quick editor"
            description="Tweak layout, colors, and hierarchy with smart defaults."
            icon={Sparkles}
            href="/dashboard/create/editor"
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted/30 border-y">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
            <p className="text-muted-foreground mt-2">Three simple steps to your next ad.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map((step) => (
              <Card key={step} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">{step}</span>
                    {step === 1 ? "Describe your idea" : step === 2 ? "Generate with AI" : "Refine and export"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && "Tell us your offer, audience, and tone."}
                    {step === 2 && "We propose visuals and copy that match."}
                    {step === 3 && "Make small edits, then export for your platform."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg border bg-background" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Loved by marketers</h2>
          <p className="text-muted-foreground mt-2">Teams ship campaigns faster with consistent quality.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["We launched in hours, not days.", "The AI suggestions are spot on.", "Brand consistency finally solved."]
            .map((quote, i) => (
              <Card key={i} className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="pt-6 text-sm text-muted-foreground">“{quote}”</CardContent>
              </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 border-y">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">Simple pricing</h2>
            <p className="text-muted-foreground mt-2">Start free, upgrade when you scale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Explore the essentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Basic AI copy",
                  "Limited image generation",
                  "Watermarked exports",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" />{f}</div>
                ))}
                <Link href="/signup">
                  <Button className="w-full">Get started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Pro <Rocket className="h-4 w-4 text-accent" /></CardTitle>
                <CardDescription>For growing teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Unlimited image generation",
                  "Advanced copy variations",
                  "Brand presets & exports",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" />{f}</div>
                ))}
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">Upgrade</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Custom needs and SLAs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "SSO & security reviews",
                  "Custom templates",
                  "Priority support",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" />{f}</div>
                ))}
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Contact sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Frequently asked questions</h2>
          <p className="text-muted-foreground mt-2">Quick answers about Disoriti.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "Can I export without watermarks?", a: "Yes on Pro and Enterprise." },
            { q: "Do you support team collaboration?", a: "Team spaces are on the roadmap." },
            { q: "Which platforms are supported?", a: "Facebook, Instagram, Twitter, LinkedIn." },
            { q: "Is there an API?", a: "A public API is planned post‑GA." },
          ].map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><HelpCircle className="h-4 w-4 text-primary" />{item.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.a}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="py-10 md:py-14 text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold">Ready to create your next campaign?</h3>
            <p className="text-muted-foreground">Start free today. Keep your brand consistent and your pipeline moving.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/signup"><Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">Get started</Button></Link>
              <Link href="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Disoriti</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


