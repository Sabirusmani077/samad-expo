import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

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
    <div className="bg-white min-h-screen py-10">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-900 font-medium">
            Blog & News
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{post.title}</span>
        </nav>

        <header className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FFF33D] text-black font-extrabold font-extrabold text-xs uppercase tracking-wider border border-slate-900/20">
            {post.category || "Corporate News"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-y border-slate-100 py-3">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <User className="w-3.5 h-3.5" />
              {post.author || "Samad Expo Editorial"}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
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
          <div className="rounded-3xl border-2 border-slate-900 overflow-hidden shadow-[6px_6px_0px_#FFF33D]">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover max-h-[450px]" />
          </div>
        )}

        <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
          {post.content || post.excerpt}
        </div>

        <footer className="pt-8 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-black hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </Link>
        </footer>
      </article>
    </div>
  );
}
