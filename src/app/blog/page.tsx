import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { BookOpen, Calendar, ArrowRight, User } from "lucide-react";

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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Blog & News</span>
        </nav>

        {/* Hero */}
        <section className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_#FFF33D] space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            <BookOpen className="w-3.5 h-3.5" />
            Media & Insights
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight max-w-3xl">
            News, Announcements & Strategic Insights
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Stay informed with the latest updates from Samad Expo, division expansions, new platform
            deployments, and business perspectives.
          </p>
        </section>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 p-12 text-center text-slate-500 bg-slate-50">
            No articles published yet. Corporate press releases and announcements will be featured here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border-2 border-slate-200 hover:border-slate-900 transition-all overflow-hidden bg-white flex flex-col justify-between"
              >
                <div>
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover border-b" />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      Article Cover
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{post.category || "News"}</span>
                      {post.publishedAt && (
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-950 leading-snug">{post.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author || "Samad Expo"}</span>
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-black hover:underline flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
