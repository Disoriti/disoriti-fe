"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import { SmartAuthButton } from "@/components/smart-auth-button";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, Bot, Wand2, Code, Zap, Shield, Lightbulb, Rocket, Target, Lock,
  Keyboard, Brain, LayoutTemplate, SlidersHorizontal, ArrowRight, Mail, 
  Linkedin, Instagram, Check, Star, Users, Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const [timeLeft, setTimeLeft] = useState({ days: 10, hours: 0, minutes: 0, seconds: 0 });
  // const t = useTranslations();

  // Countdown timer effect (10 days from now)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050608' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050608' }}>
      {/* Grid Background - Now extends full page */}
      <div className="absolute inset-0 w-full h-full bg-neon-grid"
        style={{
          '--grid-size': '160px',
          '--grid-line': '1px',
          '--grid-color': 'rgba(0, 255, 169, 0.10)',
          filter: 'none',
          position: 'absolute',
          minHeight: '100%',
          height: 'auto'
        } as React.CSSProperties}
      />

      <LandingNavbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6 pt-20 md:pt-32 pb-8 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left space-y-6 md:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground backdrop-blur-sm bg-background/30 animate-fade-in shadow-glow">
                <Sparkles className="h-3 md:h-4 w-3 md:w-4 text-primary" />
                Next-Gen AI Content Creation
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-gradient leading-tight">
                Transform Ideas into Digital Reality
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground animate-fade-in max-w-lg mx-auto md:mx-0">
                AI-powered design platform that brings your creative vision to life with intelligent automation and professional-grade tools.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in justify-center md:justify-start">
                <SmartAuthButton 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow-lg w-full sm:w-auto"
                >
                  Start Creating
                </SmartAuthButton>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="backdrop-blur-sm bg-background/30 border-primary/20 shadow-glow-sm hover:bg-background/40 w-full sm:w-auto"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground animate-fade-in justify-center md:justify-start">
                <div className="flex items-center gap-1.5 md:gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 backdrop-blur-sm bg-background/30 shadow-glow-sm">
                  <Bot className="h-3 md:h-4 w-3 md:w-4 text-primary" />
                  AI-Powered Design
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 backdrop-blur-sm bg-background/30 shadow-glow-sm">
                  <Wand2 className="h-3 md:h-4 w-3 md:w-4 text-accent" />
                  One-Click Generation
                </div>
              </div>
            </div>

            {/* Right Content - Hero Art */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square">
                <Image
                  src="/hero-art.png"
                  alt="AI Generated Art"
                  fill
                  className="object-contain animate-float"
                  priority
                />
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(0,255,169,0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    transform: 'scale(1.2)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Countdown Timer */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Animated background orbs */}
            <div className="absolute -inset-4 -z-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-6 md:p-10 bg-background/30 shadow-glow-lg overflow-hidden">
              {/* Subtle animated border glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm text-primary backdrop-blur-sm bg-primary/20 mb-4 shadow-glow-sm">
                    <Clock className="h-4 md:h-5 w-4 md:w-5 animate-pulse" />
                    <span className="font-semibold">Beta Release Countdown</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                    Disoriti Beta is Almost Here! 🚀
                  </h2>
                  
                  <p className="text-base md:text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
                    Count down to launch day and be among the first to experience the future of AI-powered content creation
                  </p>
                  
                  {/* Hype chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-3 py-1 text-xs backdrop-blur-sm bg-primary/10">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>Early access spots are limited</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 px-3 py-1 text-xs backdrop-blur-sm bg-accent/10">
                      <Star className="h-3 w-3 text-accent" />
                      <span>Founding users get bonus credits</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-center cursor-pointer"
                    >
                      <div className="relative mb-3">
                        {/* Number with hover fill effect */}
                        <div className="relative inline-block group">
                          {/* Background fill on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-0 group-hover:scale-110 blur-sm" />
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-0 group-hover:scale-100" />
                          
                          {/* Number text */}
                          <div className="relative z-10 px-4 md:px-6 py-2 md:py-3">
                            <div className="text-6xl md:text-8xl lg:text-9xl font-bold text-primary group-hover:text-primary-foreground transition-colors duration-500 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(0, 255, 169, 0.3)' }}>
                              {String(item.value).padStart(2, '0')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Label */}
                      <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-semibold">
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <div className="text-center">
                  <Link href="/signup">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow-lg px-8 py-6 text-base md:text-lg font-semibold group"
                    >
                      <span className="flex items-center gap-2">
                        Get Early Access
                        <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative min-h-screen py-16 md:py-0 md:h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          {/* Vision Statement */}
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground backdrop-blur-sm bg-background/30 mb-4">
              <Lightbulb className="h-3 md:h-4 w-3 md:w-4 text-primary" />
              Our Vision
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Why Disoriti Exists
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              At Disoriti, we believe creativity shouldn't be limited by tools. Our AI blends design intelligence with automation, helping businesses create stunning, ad-ready visuals in seconds.
            </p>
          </div>

          {/* Journey/Story */}
          <div className="max-w-6xl mx-auto mb-8 md:mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* The Problem */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <div className="p-4 backdrop-blur-sm border border-primary/10 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Target className="h-5 w-5 text-primary" />
              </div>
                  <h3 className="text-lg font-semibold mb-2">The Problem</h3>
                  <p className="text-sm text-muted-foreground">
                    Small businesses struggle to make eye-catching ads, limited by complex tools and high costs.
                  </p>
                </div>
              </div>

              {/* The Idea */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <div className="p-4 backdrop-blur-sm border border-primary/10 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Lightbulb className="h-5 w-5 text-primary" />
              </div>
                  <h3 className="text-lg font-semibold mb-2">The Idea</h3>
                  <p className="text-sm text-muted-foreground">
                    Bring AI and design together to democratize professional ad creation.
                  </p>
              </div>
            </div>

              {/* The Solution */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <div className="p-4 backdrop-blur-sm border border-primary/10 rounded-2xl h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">The Solution</h3>
                  <p className="text-sm text-muted-foreground">
                    Disoriti: Fast, futuristic, and user-friendly ad creation powered by AI.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">Our Core Values</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                The principles that drive our innovation
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  icon: Zap,
                  title: "Speed",
                  description: "Generate ads instantly",
                  gradient: "from-[#FF5F6D] to-[#FFC371]"
                },
                {
                  icon: Wand2,
                  title: "Design Intelligence",
                  description: "Ads optimized with AI + best practices",
                  gradient: "from-[#4E65FF] to-[#92EFFD]"
                },
                {
                  icon: Bot,
                  title: "Accessibility",
                  description: "Powerful design for everyone",
                  gradient: "from-[#08AEEA] to-[#2AF598]"
                },
                {
                  icon: Lock,
                  title: "Trust",
                  description: "Secure handling of assets and data",
                  gradient: "from-[#F857A6] to-[#FF5858]"
                }
              ].map((value, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                  <div className="p-3 md:p-4 backdrop-blur-sm border border-primary/10 rounded-2xl text-center">
                    <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg md:rounded-xl mx-auto mb-2 md:mb-3 relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} opacity-20 rounded-lg md:rounded-xl blur-lg group-hover:opacity-30 transition-opacity`} />
                      <div className="absolute inset-0 bg-[#050608]/50 rounded-lg md:rounded-xl backdrop-blur-sm" />
                      <div className="relative h-full flex items-center justify-center">
                        <value.icon className="h-5 md:h-6 w-5 md:w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-sm md:text-base font-semibold mb-1">{value.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative min-h-screen py-16 md:py-0 md:h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground backdrop-blur-sm bg-background/30 mb-4">
              <Rocket className="h-3 md:h-4 w-3 md:w-4 text-primary" />
              The Process
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Create stunning ads in four simple steps
            </p>
          </div>

          {/* Steps Pipeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Desktop Pipeline (Horizontal) */}
            <div className="hidden md:grid grid-cols-4 gap-6 relative">
              {/* Connecting Lines */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 transform -translate-y-1/2 z-0" />
              
              {/* Step 1 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <div className="p-6 backdrop-blur-sm border border-primary/10 rounded-2xl text-center relative z-10 bg-[#050608]/50">
                  <div className="relative w-full aspect-square mb-6">
                    <Image
                      src="/one.png"
                      alt="Enter Prompt"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Enter Prompt</h3>
                  <p className="text-sm text-muted-foreground">
                    Type in a simple prompt describing your ad vision
                  </p>
                </div>
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <div className="p-6 backdrop-blur-sm border border-primary/10 rounded-2xl text-center relative z-10 bg-[#050608]/50">
                  <div className="relative w-full aspect-square mb-6">
                    <Image
                      src="/two.png"
                      alt="AI Enhancement"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Refines</h3>
                  <p className="text-sm text-muted-foreground">
                    Our system enhances your prompt for maximum creativity
                  </p>
                </div>
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                </div>
        </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <div className="p-6 backdrop-blur-sm border border-primary/10 rounded-2xl text-center relative z-10 bg-[#050608]/50">
                  <div className="relative w-full aspect-square mb-6">
                    <Image
                      src="/three.png"
                      alt="Generate Content"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Generate</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant ad copy & visuals created together
                  </p>
                </div>
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <div className="p-6 backdrop-blur-sm border border-primary/10 rounded-2xl text-center relative z-10 bg-[#050608]/50">
                  <div className="relative w-full aspect-square mb-6">
                    <Image
                      src="/four.png"
                      alt="Customize"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Customize</h3>
                  <p className="text-sm text-muted-foreground">
                    Fine-tune your design to perfection
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Pipeline (Vertical) */}
            <div className="md:hidden space-y-4">
              {[
                {
                  image: "/one.png",
                  title: "Enter Prompt",
                  description: "Type in a simple prompt describing your ad vision",
                },
                {
                  image: "/two.png",
                  title: "AI Refines",
                  description: "Our system enhances your prompt for maximum creativity",
                },
                {
                  image: "/three.png",
                  title: "Generate",
                  description: "Instant ad copy & visuals created together",
                },
                {
                  image: "/four.png",
                  title: "Customize",
                  description: "Fine-tune your design to perfection",
                }
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                  <div className="p-4 backdrop-blur-sm border border-primary/10 rounded-2xl bg-[#050608]/50">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-semibold mb-1">{step.title}</h3>
                        <p className="text-xs text-muted-foreground leading-tight">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-3 z-20">
                      <ArrowRight className="w-6 h-6 text-primary animate-pulse rotate-90" />
                    </div>
                  )}
          </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="relative min-h-screen py-16 md:py-0 md:h-screen flex flex-col justify-center">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground backdrop-blur-sm bg-background/30 mb-4">
              <Sparkles className="h-3 md:h-4 w-3 md:w-4 text-primary" />
              Our Generations
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Stunning Creations by Disoriti
            </h2>
          </div>

          {/* Horizontal Scrolling Gallery */}
          <div className="relative">
            {/* Gradient Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            {/* Gallery */}
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="relative flex-none w-[250px] md:w-[300px] aspect-square snap-center">
                  <div className="group relative w-full h-full rounded-2xl overflow-hidden cursor-pointer">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Image */}
                    <div className="relative w-full h-full transform group-hover:scale-110 transition-all duration-500 ease-out">
                      <Image
                        src={`/generated-ad (${i}).png`}
                        alt={`Disoriti Generation ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 via-[#050608]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm bg-background/30">
                          <Bot className="h-3 w-3 text-primary" />
                          AI Generated
                        </div>
                      </div>
                    </div>
                  </div>
        </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <SmartAuthButton 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow-lg"
            >
              Start Creating Your Own
            </SmartAuthButton>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="relative min-h-screen py-16 md:py-0 md:h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground backdrop-blur-sm bg-background/30 mb-4">
              <Users className="h-3 md:h-4 w-3 md:w-4 text-primary" />
              Our Team
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              The Minds Behind Disoriti
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Holographic profiles. Real humans. United by a love for creative AI.
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Aiden Kael",
                role: "CEO",
                image: "/image-3.png",
                blurb: "Vision, product, partnerships",
                floatDelay: "0s",
              },
              {
                name: "Nova Lee",
                role: "CFO",
                image: "/image-4.png",
                blurb: "Sustainable growth, clarity in numbers",
                floatDelay: "0.2s",
              },
              {
                name: "Rhea Sol",
                role: "AI / Software Engineer",
                image: "/image-5.png",
                blurb: "Model orchestration and delightful UX",
                floatDelay: "0.4s",
              },
            ].map((member, index) => (
              <div key={index} className="relative group">
                {/* Holographic Orbit */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-xl opacity-60 group-hover:opacity-90 transition-opacity -z-10" />
                <div className="absolute -inset-0.5 rounded-2xl border border-primary/10 bg-[#050608]/40 backdrop-blur-sm -z-10" />

                {/* Card */}
                <div className="p-4 md:p-6 rounded-2xl border border-primary/10 bg-[#050608]/50 backdrop-blur-sm h-full">
                  {/* Avatar with Aura */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-md" />
                    <div className="absolute inset-0 rounded-full border border-primary/30" />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden animate-float" style={{ animationDelay: member.floatDelay }}>
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="text-center">
                    <h3 className="text-lg md:text-xl font-semibold">{member.name}</h3>
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-2.5 md:px-3 py-1 text-[10px] md:text-xs text-muted-foreground backdrop-blur-sm bg-background/30 mt-2">
                      <Shield className="h-3 w-3 text-primary" />
                      {member.role}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-3">{member.blurb}</p>
                  </div>

                  {/* Neon Baseline */}
                  <div className="mt-4 md:mt-6 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <div className="mt-2 md:mt-3 flex items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-primary/10">Focus</span>
                    <span className="px-2 py-1 rounded bg-accent/10">Impact</span>
                    <span className="px-2 py-1 rounded bg-primary/10">Craft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-10 left-1/3 w-56 md:w-72 h-56 md:h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-neon-grid opacity-[0.08]" />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative min-h-screen py-16 md:py-0 md:h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground backdrop-blur-sm bg-background/30 mb-4">
              <Star className="h-3 md:h-4 w-3 md:w-4 text-primary" />
              Pricing Plans
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Choose Your Plan
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8">
              Select the perfect plan for your advertising needs
            </p>
            
            {/* Monthly/Yearly Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="relative"
              >
                <div className="w-12 h-6 bg-primary rounded-full flex items-center cursor-pointer">
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${isYearly ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </div>
              </button>
              <span className={`text-sm transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Yearly</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="relative group flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
              <div className="p-4 md:p-6 backdrop-blur-sm border border-primary/20 rounded-2xl h-full flex flex-col">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Free</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Try out our platform with basic features</p>
                  <div className="text-2xl md:text-3xl font-bold">$0<span className="text-xs md:text-sm font-normal text-muted-foreground">/month</span></div>
                </div>
                
                <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 text-xs md:text-sm flex-grow">
                  {[
                    "Up to 10 generated ads or posts per month",
                    "Up to 3 generated ads or posts using reference picture per month",
                    "Access to Disoriti AI chat",
                    "Access to layout generator",
                    "Access to automatic prompt generator",
                    "Community support",
                    "Watermark on ads and posts from free users"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 md:gap-3">
                      <Check className="h-3 md:h-4 w-3 md:w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <SmartAuthButton className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                  Start Free
                </SmartAuthButton>
              </div>
            </div>

            {/* Essential Plan */}
            <div className="relative group flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
              <div className="p-4 md:p-6 backdrop-blur-sm border border-primary/10 rounded-2xl h-full flex flex-col">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Essential</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Perfect for individuals and small teams getting started</p>
                  <div className="text-2xl md:text-3xl font-bold">
                    ${isYearly ? '199' : '19.99'}
                    <span className="text-xs md:text-sm font-normal text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && (
                    <p className="text-xs text-primary mt-1">Save $40/year</p>
                  )}
                </div>
                
                <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 text-xs md:text-sm flex-grow">
                  {[
                    "Up to 30 generated ads or posts per month",
                    "Up to 10 generated ads or posts using reference image per month",
                    "Access to Disoriti Chat",
                    "Access to layout generator",
                    "Access to automatic prompt generator",
                    "Access to scheduler",
                    "Access to Disoriti library",
                    "Premium support",
                    "Export in different formats",
                    "Basic analytics"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 md:gap-3">
                      <Check className="h-3 md:h-4 w-3 md:w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <SmartAuthButton className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                  Get Essential
                </SmartAuthButton>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="relative group flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-accent/20 rounded-2xl -z-10 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-500" />
              <div className="p-4 md:p-6 backdrop-blur-sm border border-primary/30 rounded-2xl h-full flex flex-col relative">
                {/* Most Popular Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                </div>

                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Advanced features for growing businesses and agencies</p>
                  <div className="text-2xl md:text-3xl font-bold">
                    ${isYearly ? '399' : '39.99'}
                    <span className="text-xs md:text-sm font-normal text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && (
                    <p className="text-xs text-primary mt-1">Save $80/year</p>
                  )}
                </div>
                
                <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 text-xs md:text-sm flex-grow">
                  {[
                    "Unlimited ads or posts per month",
                    "Up to 40 generated ads or posts using reference image per month",
                    "Access to Disoriti Chat",
                    "Access to layout generator",
                    "Access to automatic prompt generator",
                    "Access to scheduler",
                    "Access to Disoriti library",
                    "Automatic posting to social media accounts (when given access)",
                    "24/7 custom support",
                    "Advanced analytics"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 md:gap-3">
                      <Check className="h-3 md:h-4 w-3 md:w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <SmartAuthButton className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow-lg">
                  Get Premium
                </SmartAuthButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                },
                {
                  question: "What happens to my credits?",
                  answer: "Unused credits roll over to the next month for Essential and Premium plans."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee for all paid plans."
                },
                {
                  question: "Is there a free trial?",
                  answer: "Yes! Premium plan includes a 14-day free trial. No credit card required."
                }
              ].map((faq, index) => (
                <div key={index} className="p-4 md:p-6 backdrop-blur-sm border border-primary/10 rounded-2xl">
                  <h4 className="text-sm md:text-base font-semibold mb-2">{faq.question}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-primary/10">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <Image
                    src="/logo-primary.png"
                    alt="Disoriti"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Disoriti
                </span>
        </div>
              <p className="text-muted-foreground text-sm">
                Transform your ideas into stunning digital reality with AI-powered design intelligence.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Linkedin, href: "https://www.linkedin.com/company/disoriti/posts/?feedView=all", label: "LinkedIn" },
                  { icon: Instagram, href: "https://www.instagram.com/disoriti_/", label: "Instagram" }
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors group"
                  >
                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
          ))}
        </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blogs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-primary/10 pt-8 mb-8">
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get the latest updates on new features and AI innovations.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/50 border border-primary/20 focus:border-primary/40 focus:outline-none text-sm backdrop-blur-sm"
                  />
                </div>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Subscribe
                </Button>
              </div>
            </div>
            </div>

          {/* Bottom */}
          <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Disoriti. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/data-deletion" className="text-muted-foreground hover:text-primary transition-colors">
                Data Deletion
              </Link>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </footer>
    </div>
  );
}