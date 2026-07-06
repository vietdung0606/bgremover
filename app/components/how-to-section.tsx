export default function HowToSection({
  t,
}: {
  t: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
  };
}) {
  const steps = [
    { num: "1", text: t.step1, icon: "📤" },
    { num: "2", text: t.step2, icon: "🤖" },
    { num: "3", text: t.step3, icon: "📥" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold text-center mb-10 text-zinc-800 dark:text-zinc-100">
        {t.title}
      </h2>
      <div className="flex flex-col sm:flex-row items-start justify-center gap-8">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-3 flex-1">
            <span className="text-3xl">{step.icon}</span>
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
              {step.num}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-48">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
