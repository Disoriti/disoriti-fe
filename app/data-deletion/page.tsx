"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <img src="/logo-primary.png" alt="Disoriti" className="object-contain h-full w-full" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Disoriti
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Data Deletion Instructions
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>

          <div className="bg-background/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 shadow-lg space-y-6">
            <p>
              If you have used Disoriti and wish to delete your data, please follow the steps below. We will handle your request in
              accordance with our Privacy Policy.
            </p>

            <ol className="list-decimal pl-6 space-y-3">
              <li>
                Send an email to <a className="underline" href="mailto:info@disoriti.com">info@disoriti.com</a> with the subject line “Data
                Deletion Request.”
              </li>
              <li>
                Include the email address or account information you used to sign up so we can verify ownership of the account.
              </li>
              <li>
                We will permanently delete your personal data and account information from our systems within 30 days of receiving your
                request.
              </li>
            </ol>

            <p>
              If you have logged in using your Instagram account, you can also remove Disoriti’s access directly through your Instagram settings
              under <span className="font-medium">Settings → Security → Apps and Websites → Active</span>.
            </p>

            <p>
              For any questions about data deletion, please contact us at <a className="underline" href="mailto:info@disoriti.com">info@disoriti.com</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-primary/10 mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">© {new Date().getFullYear()} Disoriti. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/data-deletion" className="text-muted-foreground hover:text-primary transition-colors">
                Data Deletion
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

