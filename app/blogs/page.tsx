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
  Sparkles, Calendar, Clock, ArrowRight, User, Tag
} from "lucide-react";

// Sample blog data - in a real app, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: "Ready to Transform Your Marketing? Discover Disoriti",
    excerpt: "The digital world moves faster than ever. Every second, more than 6,000 tweets are sent, 95 million Instagram photos are shared...",
    author: "Disoriti Team",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "AI Marketing",
    image: "/generated-ad (1).png",
    tags: ["AI", "Marketing", "Content Creation", "Social Media"]
  },
  {
    id: 2,
    title: "The Future of AI-Powered Content Creation",
    excerpt: "Artificial Intelligence is revolutionizing how we create, optimize, and distribute content across digital platforms...",
    author: "Sarah Chen",
    date: "2024-01-12",
    readTime: "7 min read",
    category: "Technology",
    image: "/generated-ad (2).png",
    tags: ["AI", "Future", "Technology", "Innovation"]
  },
  {
    id: 3,
    title: "10 Tips for Better Social Media Engagement",
    excerpt: "Discover proven strategies to boost your social media engagement rates and build a stronger connection with your audience...",
    author: "Marcus Rodriguez",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Social Media",
    image: "/generated-ad (3).png",
    tags: ["Social Media", "Engagement", "Tips", "Strategy"]
  },
  {
    id: 4,
    title: "How Small Businesses Can Compete with AI",
    excerpt: "Level the playing field with enterprise-grade AI tools that are now accessible to businesses of all sizes...",
    author: "Alex Thompson",
    date: "2024-01-08",
    readTime: "4 min read",
    category: "Business",
    image: "/generated-ad (4).png",
    tags: ["Small Business", "AI", "Competition", "Growth"]
  },
  {
    id: 5,
    title: "The Psychology Behind Viral Content",
    excerpt: "Understanding what makes content go viral and how AI can help predict and create shareable moments...",
    author: "Dr. Emily Watson",
    date: "2024-01-05",
    readTime: "8 min read",
    category: "Psychology",
    image: "/generated-ad (5).png",
    tags: ["Psychology", "Viral", "Content", "Research"]
  },
  {
    id: 6,
    title: "Measuring ROI in AI-Generated Content",
    excerpt: "Learn how to track and measure the return on investment for your AI-powered marketing campaigns...",
    author: "David Park",
    date: "2024-01-03",
    readTime: "5 min read",
    category: "Analytics",
    image: "/generated-ad (6).png",
    tags: ["ROI", "Analytics", "Measurement", "AI"]
  }
];

const categories = ["All", "AI Marketing", "Technology", "Social Media", "Business", "Psychology", "Analytics"];

export default function BlogsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050608' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter blogs based on category only
  const filteredBlogs = blogPosts.filter(blog => {
    return selectedCategory === "All" || blog.category === selectedCategory;
  });

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm bg-background/30 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              Insights & Updates
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-gradient mb-6">
              Disoriti Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover the latest insights on AI-powered content creation, marketing strategies, and industry trends.
            </p>

            {/* Category Filter */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'bg-background/30 text-muted-foreground hover:bg-background/50 border border-primary/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="relative pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl -z-10 group-hover:from-primary/20 transition-all duration-500" />
                <Link href={`/blogs/${blog.id}`}>
                  <div className="backdrop-blur-sm border border-primary/10 rounded-2xl overflow-hidden group-hover:border-primary/30 transition-all duration-500 cursor-pointer">
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary">
                          <Tag className="h-3 w-3" />
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {blog.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(blog.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.readTime}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* No Results */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-primary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Ready to Create Amazing Content?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators using Disoriti to transform their content strategy.
            </p>
            <SmartAuthButton 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-glow-lg"
            >
              Start Creating Today
            </SmartAuthButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-primary/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Disoriti. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
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
