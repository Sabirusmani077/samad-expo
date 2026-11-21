import Link from "next/link";

export function Logo({
  size = "md",
  showTagline = false,
  inverted = false,
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  const imgSize =
    size === "lg"
      ? "h-20 w-20 sm:h-24 sm:w-24 rounded-2xl"
      : size === "sm"
      ? "h-8 w-8 rounded-lg"
      : "h-11 w-11 rounded-xl";
  const nameSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <Link
      href="/"
      className={`brand-lockup group inline-flex min-w-0 items-center gap-3 ${className}`}
      aria-label="Samad Expo home"
    >
      <span className="shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/primary-logo.png"
          alt="Samad Expo Logo"
          className={`${imgSize} object-cover select-none border border-slate-900/10 shadow-xs transition-transform duration-200 group-hover:scale-105`}
        />
      </span>
      <span className="brand-type flex min-w-0 flex-col leading-none">
        <span
          className={`${nameSize} font-extrabold tracking-[-0.055em] ${
            inverted ? "text-white" : "text-black"
          }`}
        >
          Samad{" "}
          <span
            className={`font-semibold ${
              inverted ? "text-white" : "text-black"
            }`}
          >Expo</span>
        </span>
        {showTagline && (
          <span
            className={`mt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] ${
              inverted ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Corporate · Digital Ecosystem
          </span>
        )}
      </span>
    </Link>
  );
}
