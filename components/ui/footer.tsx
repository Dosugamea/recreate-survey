export function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "アンケートアプリ";

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-4">
      <div className="flex justify-end">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          powered by {appName}
        </p>
      </div>
    </footer>
  );
}
