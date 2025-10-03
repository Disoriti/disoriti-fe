"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar, Shield, Users, CreditCard, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview", icon: FileText },
    { id: "acceptance", title: "Acceptance", icon: Shield },
    { id: "services", title: "Services", icon: Users },
    { id: "payments", title: "Payments", icon: CreditCard },
    { id: "liability", title: "Liability", icon: AlertTriangle },
    { id: "changes", title: "Changes", icon: Calendar },
  ];

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
                <img
                  src="/logo-primary.png"
                  alt="Disoriti"
                  className="object-contain h-full w-full"
                />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Disoriti
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Terms and Conditions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our AI-powered design platform.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 shadow-lg">
                
                {/* Overview */}
                {activeSection === "overview" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      Overview
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        Welcome to Disoriti, an AI-powered design platform that transforms your ideas into stunning digital reality. 
                        These Terms and Conditions ("Terms") govern your use of our website, services, and applications.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part 
                        of these terms, then you may not access the service.
                      </p>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Key Points</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You must be at least 18 years old to use our services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You are responsible for maintaining the security of your account</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>We reserve the right to modify these terms at any time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Our AI-generated content is provided "as is" without warranties</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Acceptance */}
                {activeSection === "acceptance" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Shield className="h-6 w-6 text-primary" />
                      Acceptance of Terms
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        By creating an account, accessing our website, or using any of our services, you acknowledge that you 
                        have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                      </p>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Account Requirements</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You must provide accurate and complete information when creating an account</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You are responsible for all activities that occur under your account</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You must notify us immediately of any unauthorized use of your account</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>We reserve the right to suspend or terminate accounts that violate these terms</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Services */}
                {activeSection === "services" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Users className="h-6 w-6 text-primary" />
                      Our Services
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        Disoriti provides AI-powered design tools and services including but not limited to content generation, 
                        image creation, template design, and collaborative editing features.
                      </p>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Service Availability</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Services are provided on an "as available" basis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>We may modify, suspend, or discontinue services at any time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>We strive for 99.9% uptime but cannot guarantee uninterrupted service</span>
                        </li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-6 mb-3">User Content</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        You retain ownership of content you create using our services. By using our platform, you grant us 
                        a limited license to process, store, and display your content as necessary to provide our services.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payments */}
                {activeSection === "payments" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-primary" />
                      Payments and Billing
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        Our services are offered on both free and paid subscription plans. Paid plans are billed in advance 
                        on a monthly or annual basis.
                      </p>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Billing Terms</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>All fees are non-refundable except as required by law</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Subscription fees are charged automatically on the billing date</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You can cancel your subscription at any time from your account settings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Price changes will be communicated 30 days in advance</span>
                        </li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Credits and Usage</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our AI services operate on a credit system. Credits are consumed based on the complexity and type 
                        of content generated. Unused credits do not roll over between billing periods.
                      </p>
                    </div>
                  </div>
                )}

                {/* Liability */}
                {activeSection === "liability" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                      Limitation of Liability
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        To the maximum extent permitted by law, Disoriti shall not be liable for any indirect, incidental, 
                        special, consequential, or punitive damages, including without limitation, loss of profits, data, 
                        use, goodwill, or other intangible losses.
                      </p>
                      <h3 className="text-xl font-semibold mt-6 mb-3">AI-Generated Content</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>AI-generated content is provided "as is" without warranties</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You are responsible for reviewing and validating all generated content</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>We do not guarantee the accuracy, completeness, or suitability of AI outputs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You assume all risks associated with using AI-generated content</span>
                        </li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Indemnification</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        You agree to defend, indemnify, and hold harmless Disoriti from any claims, damages, or expenses 
                        arising from your use of our services or violation of these Terms.
                      </p>
                    </div>
                  </div>
                )}

                {/* Changes */}
                {activeSection === "changes" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-primary" />
                      Changes to Terms
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        We reserve the right to modify these Terms at any time. We will notify users of any material 
                        changes through email or prominent notice on our website.
                      </p>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Notification Process</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Material changes will be communicated 30 days in advance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Continued use of our services constitutes acceptance of new terms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>You may terminate your account if you disagree with changes</span>
                        </li>
                      </ul>
                      <h3 className="text-xl font-semibold mt-6 mb-3">Contact Information</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about these Terms, please contact us at:
                      </p>
                      <div className="bg-muted/30 rounded-lg p-4 mt-4">
                        <p className="text-sm">
                          <strong>Email:</strong> legal@disoriti.com<br />
                          <strong>Address:</strong> Disoriti Legal Department<br />
                          [Your Company Address]
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
