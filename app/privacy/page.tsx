"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              Privacy Policy – Disoriti V.O.F.
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="bg-background/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 shadow-lg space-y-6">
            <p>
              Disoriti V.O.F., located at Oosteind 64, 3356 AC Papendrecht, The Netherlands (“Disoriti”, “we”, “us”),
              respects your privacy and processes personal data carefully and in accordance with the General Data Protection Regulation (GDPR).
            </p>

            <h2 className="text-2xl font-semibold">1. Contact Information</h2>
            <p>
              Disoriti V.O.F.<br />
              Oosteind 64<br />
              3356 AC Papendrecht<br />
              The Netherlands<br />
              Email: <a className="underline" href="mailto:info@disoriti.com">info@disoriti.com</a><br />
              Phone: +31 6 29447717
            </p>
            <p>We have not appointed a Data Protection Officer.</p>

            <h2 className="text-2xl font-semibold">2. Personal Data We Process</h2>
            <p>We process the following personal data from users of our website and services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Instagram login credentials or tokens required for authentication and account linking</li>
            </ul>
            <p>We do not use cookies or similar tracking technologies.</p>

            <h2 className="text-2xl font-semibold">3. Purposes and Legal Basis</h2>
            <p>We process your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide you access to our AI content generator</li>
              <li>To manage your account</li>
              <li>To send service notifications and, if you have provided consent, marketing communications</li>
            </ul>
            <p>
              We do not use your personal data for purposes other than those listed above. The legal basis for these processing
              activities is the performance of a contract (the provision of our services) and, for marketing communications, your consent.
            </p>

            <h2 className="text-2xl font-semibold">4. Retention Periods</h2>
            <p>
              We retain your personal data for as long as your account is active. After your account is terminated, we will delete your
              data within 12 months unless a longer retention period is required by law.
            </p>

            <h2 className="text-2xl font-semibold">5. Sharing Data with Third Parties</h2>
            <p>
              We do not sell your personal data. We only share your information with processors that provide services on our behalf
              (for example, hosting providers). These processors are contractually obligated to process your data solely under our instruction.
            </p>

            <h2 className="text-2xl font-semibold">6. Data Storage Location and Transfers Outside the EEA</h2>
            <p>
              Your personal data is stored in a MongoDB database hosted in Amsterdam, The Netherlands, within the European Economic Area (EEA).
              If a transfer outside the EEA becomes necessary, we will implement appropriate safeguards, such as Standard Contractual Clauses,
              in accordance with the GDPR.
            </p>

            <h2 className="text-2xl font-semibold">7. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data, including encrypted transmission and secure servers.
            </p>

            <h2 className="text-2xl font-semibold">8. Your Rights</h2>
            <p>
              You have the right to access, correct, delete, and port your personal data. You may exercise these rights by contacting us at
              <a className="underline ml-1" href="mailto:info@disoriti.com">info@disoriti.com</a>.
            </p>
            <p>
              You also have the right to file a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
            </p>

            <h2 className="text-2xl font-semibold">9. Regional Additions</h2>
            <p>
              Users outside the EU/EEA may have additional rights under their local privacy laws (for example, the CCPA in California,
              PIPEDA in Canada, the Privacy Act in Australia, or the nFDPA in Switzerland). Please refer to our “Regional Additions” section.
            </p>

            <h2 className="text-2xl font-semibold">10. Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. We encourage you to review it regularly. Significant changes will be communicated to you by email.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-primary/10 mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Disoriti. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


