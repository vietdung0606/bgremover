export default function Footer({ tagline }: { tagline: string }) {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{tagline}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} AI Background Remover. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
