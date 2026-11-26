import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { BookOpen, User, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog & News | Samad Expo",
  description: "Official platform updates and announcements from Samad Expo.",
};

export default function BlogPage() {
  const db = readDb();
  const posts = (db.blogPosts || []).filter((b) => b.status === "published");

  return (
    <div className="bg-[#060608] min-h-screen text-white">
      <section className="samad-hero-grid border-b border-zinc-800/80 pt-10 pb-14 sm:pt-16 sm:pb-20 relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#FFF33D] font-semibold transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FFF33D] font-bold">Blog &amp; News</span>
          </nav>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF33D]/10 border border-[#FFF33D]/30 text-xs font-bold text-[#FFF33D]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Updates &amp; Perspectives</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              News &amp; <span className="samad-highlight">Announcements</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Platform releases, engineering updates, and announcements from Samad Expo.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-[#0B0B0F] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <Card3D intensity={5}>
              <div className="samad-card p-12 text-center space-y-2">
                <p className="text-sm font-bold text-white">
                  No articles published yet.
                </p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Official announcements and technical write-ups will appear here.
                </p>
              </div>
            </Card3D>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card3D key={post.id} intensity={9}>
                  <div className="samad-card overflow-hidden flex flex-col justify-between group h-full">
                    <div>
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-48 object-cover border-b border-zinc-800"
                        />
                      ) : (
                        <div className="w-full h-48 bg-[#FFF33D]/10 border-b border-zinc-800 flex items-center justify-center text-[#FFF33D] text-xs font-extrabold uppercase tracking-wider">
                          Samad Expo Update
                        </div>
                      )}

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#FFF33D] uppercase tracking-wider">
                          <span>{post.category || "News"}</span>
                          {post.publishedAt && (
                            <span className="text-zinc-500 font-medium">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-extrabold text-white leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-[#FFF33D]" />
                        <span>{post.author || "Samad Expo"}</span>
                      </span>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 font-extrabold text-[#FFF33D] hover:text-white transition"
                      >
                        <span>Read</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
