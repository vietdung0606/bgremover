export default function FeaturesSection({
  t,
}: {
  t: Record<string, { title: string; desc: string }>;
}) {
  const features = [
    { key: "instant", icon: "⚡" },
    { key: "privacy", icon: "🔒" },
    { key: "free", icon: "🎉" },
    { key: "quality", icon: "✨" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ key, icon }) => (
          <div key={key} className="flex flex-col items-center text-center gap-3">
            <span className="text-3xl">{icon}</span>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              {t[key].title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {t[key].desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
