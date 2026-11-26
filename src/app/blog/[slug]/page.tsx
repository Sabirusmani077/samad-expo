import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";
import { Card3D } from "@/components/Card3D";
import { ArrowLeft, Calendar, User } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const post = db.blogPosts?.find((b) => b.slug === slug || b.id === slug);
  if (!post) return { title: "Dispatch Not Found" };
  return {
    title: `${post.title} — Samad Expo News`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const db = readDb();
  const post = db.blogPosts?.find((b) => b.slug === slug || b.id === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1D1C1C]">
      <section className="samad-hero-grid border-b border-[#C8A464]/25 pt-14 pb-16 relative overflow-hidden text-white">
        <ThreeHeroCanvas variant="dark" className="opacity-75" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"
          >
            <Link href="/" className="hover:text-[#C8A464] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#C8A464] transition">
              News &amp; Dispatches
            </Link>
            <span>/</span>
            <span className="text-[#C8A464] truncate max-w-xs">{post.title}</span>
          </nav>

          <span className="inline-block px-3.5 py-1 bg-[#C10016] text-white font-bold text-[10px] uppercase tracking-[0.22em]">
            {post.category || "Maison News"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-[0.1em] text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-5 text-xs text-zinc-300 pt-2">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C8A464]" />
              {post.author || "Samad Expo Editorial"}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C8A464]" />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        {post.coverImage && (
          <Card3D intensity={4}>
            <div className="samad-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[450px]"
              />
            </div>
          </Card3D>
        )}

        <Card3D intensity={3}>
          <div className="samad-card p-8 sm:p-10 font-editorial-serif text-base sm:text-lg text-[#595959] leading-relaxed whitespace-pre-line border-t-2 border-t-[#C10016]">
            {post.content || post.excerpt}
          </div>
        </Card3D>

        <footer className="pt-6 border-t border-[#E5DFD7]">
          <Link
            href="/blog"
            className="font-editorial-serif italic text-base text-[#C10016] inline-flex items-center gap-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </Link>
        </footer>
      </article>
    </div>
  );
}
