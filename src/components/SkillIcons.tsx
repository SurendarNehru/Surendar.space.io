import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  SiTypescript,
  SiSvelte,
  SiReact,
  SiPython,
  SiNextdotjs,
  SiPostgresql,
  SiMongodb,
  SiNginx,
  SiLinux,
  SiMysql,
  SiPostman,
  SiNodedotjs,
  SiFastify,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

type IconType = typeof SiReact;

type Skill = { label: string; Icon: IconType; color: string; desc: string };

const SKILLS: Skill[] = [
  { label: "TypeScript", Icon: SiTypescript, color: "#3178c6", desc: "Typed JavaScript for safer, scalable apps." },
  { label: "Svelte", Icon: SiSvelte, color: "#ff3e00", desc: "Compiler-first UI framework with no virtual DOM." },
  { label: "React", Icon: SiReact, color: "#61dafb", desc: "Component-driven UI library for the web." },
  { label: "Python", Icon: SiPython, color: "#ffd845", desc: "Scripting, automation and computer vision work." },
  { label: "Next.js", Icon: SiNextdotjs, color: "#ffffff", desc: "React framework for SSR and full-stack routes." },
  { label: "PostgreSQL", Icon: SiPostgresql, color: "#699eca", desc: "Relational database with strong SQL features." },
  { label: "MongoDB", Icon: SiMongodb, color: "#4faa41", desc: "Document database for flexible schemas." },
  { label: "Nginx", Icon: SiNginx, color: "#019639", desc: "Reverse proxy and high-performance web server." },
  { label: "Linux", Icon: SiLinux, color: "#f5f5f5", desc: "Server administration and shell tooling." },
  { label: "MySQL", Icon: SiMysql, color: "#00758f", desc: "Classic relational database for web backends." },
  { label: "Postman", Icon: SiPostman, color: "#ff6c37", desc: "API design, testing and collections." },
  { label: "Node.js", Icon: SiNodedotjs, color: "#83cd29", desc: "JavaScript runtime for APIs and services." },
  { label: "Fastify", Icon: SiFastify, color: "#2ee6a8", desc: "Low-overhead Node framework for fast APIs." },
  { label: "Java", Icon: FaJava, color: "#e76f00", desc: "Android and backend application development." },
];

function SkillTile({ label, Icon, color, desc, index }: Skill & { index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const onMove = (e: React.PointerEvent<HTMLLIElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${(-y * 18).toFixed(2)}deg) rotateY(${(x * 18).toFixed(2)}deg) translateZ(14px) scale(1.06)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
    if (!pinned) setOpen(false);
  };

  const toggle = () => {
    const next = !pinned;
    setPinned(next);
    setOpen(next);
    const el = ref.current;
    if (el && next) el.style.transform = "perspective(600px) translateZ(18px) scale(1.09)";
  };

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.04 * index }}
      onPointerMove={onMove}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={onLeave}
      onClick={toggle}
      onFocus={() => setOpen(true)}
      onBlur={() => !pinned && setOpen(false)}
      tabIndex={0}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#07070c]/70 backdrop-blur-md outline-none transition-transform duration-200 ease-out will-change-transform focus-visible:border-white/40"
      data-glass
      aria-label={`${label} — ${desc}`}
    >
      <Icon
        aria-hidden
        color={color}
        className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
        style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.55))" }}
      />

      <div
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-44 -translate-x-1/2 rounded-xl border border-white/15 bg-[#07070c]/95 px-3 py-2 text-left shadow-xl backdrop-blur-md transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <div className="text-xs font-semibold text-white">{label}</div>
        <p className="mt-0.5 text-[11px] leading-snug text-white/65">{desc}</p>
      </div>

      <span className="sr-only">{label}</span>
    </motion.li>
  );
}

/** Icon-only skills grid — brand marks on dark tiles, 3D pointer tilt, hover/tap tooltips. */
export function SkillIcons() {
  return (
    <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-5">
      {SKILLS.map((s, i) => (
        <SkillTile key={s.label} {...s} index={i} />
      ))}
    </ul>
  );
}
