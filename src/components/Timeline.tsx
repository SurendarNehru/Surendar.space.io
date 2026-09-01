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
    title: "Graduated — B.E. Computer Science & Engineering",
    place: "Saveetha Engineering College",
    desc: "Completed my B.E. in CSE with a focus on full stack engineering, computer vision and human-centred interfaces.",
  },
  {
    year: "2025",
    title: "Frontend Developer",
    place: "Projects & Freelance",
    desc: "Built responsive, animated interfaces with React, TanStack and Three.js — shipping accessible UI, motion systems and 3D scenes.",
  },
  {
    year: "2024",
    title: "Learning the full stack",
    place: "Self-taught & Campus Labs",
    desc: "Went deep on JavaScript, React, Node, databases and Git — turning tutorials into real apps like SwapIt, Care Connect and EyeCursor.",
  },
];

export function Timeline() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Trajectory
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
          Journey through the stars
        </h2>
      </div>

      <div className="relative">
        <div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/25 to-transparent"
          aria-hidden
        />
        <ul className="space-y-16">
          {items.map((it, i) => {
            const left = i % 2 === 0;
            return (
              <motion.li
                key={it.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-2"
              >
                <div
                  className={`${left ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}
                >
                  <GlassCard className="inline-block !p-6 text-left">
                    <div className="text-xs font-medium tracking-widest text-white/60">
                      {it.year}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {it.title}
                    </div>
                    <div className="text-sm text-white/50">{it.place}</div>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {it.desc}
                    </p>
                  </GlassCard>
                </div>
                <span className="absolute left-1/2 top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-white " />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
