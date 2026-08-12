import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

type Item = {
  year: string;
  title: string;
  place: string;
  desc: string;
};

const items: Item[] = [
  {
    year: "2026",
    title: "Full Stack Developer",
    place: "Saveetha Engineering College",
    desc: "Completed a full-stack program with focus on frontend and backend web technologies.",
  },
  {
    year: "2025",
    title: "Frontend Developer",
    place: "Product Studio",
    desc: "Shipped realtime dashboards, edge APIs, and a design system used across 6 products.",
  },
  // removed duplicate/older role per request
  {
    year: "2022",
    title: "B.Tech, Computer Science",
    place: "University",
    desc: "Graduated with focus on distributed systems, graphics, and human-computer interaction.",
  },
];

export function Timeline() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-12 text-center sm:mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Trajectory
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">
          Journey through the stars
        </h2>
      </div>

      <div className="relative">
        <div
          className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/25 to-transparent md:left-1/2"
          aria-hidden
        />
        <ul className="space-y-10 sm:space-y-16">
          {items.map((it, i) => {
            const left = i % 2 === 0;
            return (
              <motion.li
                key={it.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid grid-cols-1 items-center gap-4 pl-10 md:grid-cols-2 md:pl-0"
              >
                <div
                  className={`${left ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}
                >
                  <GlassCard className="inline-block !p-5 sm:!p-6 text-left">
                    <div className="text-xs font-medium tracking-widest text-white/60">
                      {it.year}
                    </div>
                    <div className="mt-1 text-base font-semibold text-white sm:text-lg">
                      {it.title}
                    </div>
                    <div className="text-xs text-white/50 sm:text-sm">{it.place}</div>
                    <p className="mt-3 text-xs leading-relaxed text-white/70 sm:text-sm">
                      {it.desc}
                    </p>
                  </GlassCard>
                </div>
                <span className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-white md:left-1/2" />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
