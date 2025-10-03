"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import { SmartAuthButton } from "@/components/smart-auth-button";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, Clock, User, Tag, ArrowLeft, Share2, Twitter, 
  Linkedin, Facebook, Copy, Check
} from "lucide-react";

// Sample blog data - in a real app, this would come from an API
const blogData = {
  1: {
    id: 1,
    title: "Ready to Transform Your Marketing? Discover Disoriti",
    metaTitle: "Disoriti | AI Content Generator for Smarter Marketing",
    metaDescription: "Create social posts, ads, blogs, and videos in seconds with Disoriti. Save time, boost engagement, and grow your brand with AI-powered marketing",
    author: "Disoriti Team",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "AI Marketing",
    image: "/generated-ad (1).png",
    tags: ["AI", "Marketing", "Content Creation", "Social Media"],
    content: `
      <p class="lead">The digital world moves faster than ever. Every second, more than 6,000 tweets are sent, 95 million Instagram photos are shared, and over 500 hours of video are uploaded to YouTube. With so much content flooding our feeds, how can a business stand out?</p>

      <p>The answer is Disoriti. Disoriti is an AI content generator designed to make marketing smarter, faster, and more effective. Instead of spending hours on brainstorming and writing, businesses can create professional social media posts, ads, blogs, and even video content in just seconds.</p>

      <h2>Fun Facts About AI in Marketing</h2>

      <p>Disoriti isn't just about saving time. It's about turning the power of artificial intelligence into a competitive advantage. Here are some surprising facts that show why AI is reshaping marketing:</p>

      <ul>
        <li><strong>AI can generate a post in under five seconds</strong>, while the average marketer needs at least 15 to 20 minutes.</li>
        <li><strong>Over 80 percent of online users prefer content in their own language.</strong> With Disoriti's multilingual features, businesses can reach global audiences instantly.</li>
        <li><strong>Companies that adopt AI content tools see up to 61 percent more engagement</strong> on social media.</li>
        <li><strong>Algorithms in tools like Disoriti can predict engagement up to 30 percent more accurately</strong> by analyzing when your audience is most active.</li>
        <li><strong>AI can process more data in one minute than a human can in an entire year</strong>, giving marketers instant insights into customer behavior.</li>
      </ul>

      <h2>Why Businesses Choose Disoriti</h2>

      <p>The biggest benefit of using Disoriti is time. With content generated in seconds, teams can focus on strategy and growth instead of struggling with writer's block.</p>

      <p>Disoriti also guarantees consistency: your brand voice stays strong across every platform, even if different people are involved in creating content. Posts are optimized for both social media algorithms and SEO, which means better reach and visibility.</p>

      <p>And with multilingual support, Disoriti helps businesses expand into new markets without hiring extra writers or agencies.</p>

      <h2>With and Without Disoriti: A Simple Example</h2>

      <p><strong>Without Disoriti</strong>, a marketer might manage to write three posts a week, manually choose hashtags, and post at random times.</p>

      <p><strong>With Disoriti</strong>, you can generate twenty posts in ten minutes, complete with captions, hashtags, visuals, and the best publishing schedule.</p>

      <p>The difference is clear: more content, less stress, stronger engagement.</p>

      <h2>The Future of AI Marketing with Disoriti</h2>

      <p>AI in marketing is no longer a trend; it is the new standard. Disoriti brings together social media, blogs, ads, and video in one platform, making it easier than ever for businesses to compete in a crowded digital world.</p>

      <p>Research from PwC predicts that AI could add $15.7 trillion in economic value by 2030. Marketing will play a massive role in that growth, and tools like Disoriti are already helping businesses get ahead.</p>

      <h2>Take the Next Step with Disoriti</h2>

      <p>Marketing doesn't have to be slow, stressful, or expensive. With Disoriti, you can create posts, ads, blogs, and videos in just a few clicks. It saves time, keeps your brand consistent, and helps you reach more people without the headache of switching between tools.</p>

      <p>Think of it as your creative partner that's always ready with fresh ideas. Whether you're running a startup or managing a big brand, Disoriti makes content creation simple.</p>

      <p><strong>So why wait? Take the next step with Disoriti today and see how easy marketing can be.</strong></p>
    `
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const blogId = parseInt(params.id as string);
  const blog = blogData[blogId as keyof typeof blogData];

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050608' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If blog not found, show 404
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050608' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blogs">
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = blog.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050608' }}>
      {/* Grid Background */}
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

      {/* Back Button */}
      <div className="relative pt-32 pb-8">
        <div className="container mx-auto px-6">
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-primary">
                  <Tag className="h-3 w-3" />
                  {blog.category}
                </span>
              </div>
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {blog.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(blog.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {blog.readTime}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary mb-8">
              {blog.title}
            </h1>

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-primary/10">
              <span className="text-sm text-muted-foreground">Share:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-primary prose-strong:font-semibold
                prose-ul:text-muted-foreground prose-li:mb-2
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                [&_.lead]:text-xl [&_.lead]:text-foreground [&_.lead]:font-medium [&_.lead]:mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-primary/10">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Marketing?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of businesses using Disoriti to create amazing content in seconds.
              </p>
              <SmartAuthButton 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow-lg"
              >
                Start Your Free Trial
              </SmartAuthButton>
            </div>
          </div>
        </div>
      </article>

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
              <Link href="/blogs" className="text-muted-foreground hover:text-primary transition-colors">
                All Blogs
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
