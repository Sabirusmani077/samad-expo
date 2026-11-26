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
  if (!post) return { title: "Article Not Found" };
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
    <div className="bg-[#060608] samad-hero-grid min-h-screen py-12 text-white relative overflow-hidden">
      <ThreeHeroCanvas variant="dark" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#FFF33D]/15 blur-[120px]" />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-zinc-400 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-[#FFF33D] font-medium transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#FFF33D] font-medium transition">
            Blog &amp; News
          </Link>
          <span>/</span>
          <span className="text-[#FFF33D] font-bold truncate max-w-xs">
            {post.title}
          </span>
        </nav>

        <header className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFF33D] text-black font-extrabold text-xs uppercase tracking-wider">
            {post.category || "Corporate News"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-zinc-400 border-y border-zinc-800 py-3">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <User className="w-3.5 h-3.5 text-[#FFF33D]" />
              {post.author || "Samad Expo Editorial"}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FFF33D]" />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </header>

        {post.coverImage && (
          <Card3D intensity={5}>
            <div className="samad-card overflow-hidden border-[#FFF33D]/35">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[450px]"
              />
            </div>
          </Card3D>
        )}

        <Card3D intensity={4}>
          <div className="samad-card p-8 sm:p-10 text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-line space-y-4 border-t-4 border-t-[#FFF33D]">
            {post.content || post.excerpt}
          </div>
        </Card3D>

        <footer className="pt-8 border-t border-zinc-800 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FFF33D] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </Link>
        </footer>
      </article>
    </div>
  );
}
