import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { BookOpen, Calendar, ArrowRight, User, Sparkles, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog & Corporate News | Samad Expo",
  description:
    "Official updates, industry insights, and platform announcements from Samad Expo.",
};

export default function BlogPage() {
  const db = readDb();
  const posts = (db.blogPosts || []).filter((b) => b.status === "published");

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Athenura Obsidian Hero */}
      <section className="bg-[#040D12] text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-teal-900/30 relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <nav aria-label="Breadcrumb" className="text-xs text-zinc-400 flex items-center gap-2">
            <Link href="/" className="hover:text-teal-400 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Blog &amp; News</span>
          </nav>

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-500/30 bg-teal-950/50 text-xs font-bold text-teal-300">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Media &amp; Industry Insights</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
              News, Announcements &amp; <span className="text-gradient-teal">Perspectives.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Stay informed with official updates from Samad Expo, division expansions, new platform deployments, and software engineering perspectives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        {posts.length === 0 ? (
          <div className="athenura-card p-12 text-center text-slate-500 space-y-3">
            <p className="text-sm font-semibold text-slate-700">No articles published yet.</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Corporate press releases, platform engineering announcements, and case studies will be featured here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="athenura-card overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover border-b border-slate-100" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-tr from-slate-900 to-teal-950 flex items-center justify-center text-teal-300 text-xs font-bold uppercase tracking-wider">
                      Samad Expo Dispatch
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                      <span>{post.category || "News"}</span>
                      {post.publishedAt && (
                        <span className="text-slate-400 font-medium">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-teal-700 transition leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{post.author || "Samad Expo"}</span>
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 transition"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
