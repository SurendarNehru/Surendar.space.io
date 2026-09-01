import { useEffect, useState } from "react";

/**
 * Looping typewriter: types the text, holds, deletes, repeats.
 * Respects prefers-reduced-motion by rendering the full text statically.
 */
export function Typewriter({
  text,
  className,
  typeMs = 130,
  deleteMs = 70,
  holdMs = 1600,
}: {
  text: string;
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}) {
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let timer: number;
    if (!deleting && count === text.length) {
      timer = window.setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && count === 0) {
      timer = window.setTimeout(() => setDeleting(false), 420);
    } else {
      timer = window.setTimeout(
        () => setCount((c) => c + (deleting ? -1 : 1)),
        deleting ? deleteMs : typeMs,
      );
    }
    return () => window.clearTimeout(timer);
  }, [count, deleting, reduced, text.length, typeMs, deleteMs, holdMs]);

  const shown = reduced ? text : text.slice(0, count);

  return (
    <span className={className}>
      <span aria-label={text}>{shown}</span>
      {!reduced && (
        <span
          aria-hidden
          className="ml-1 inline-block w-[0.6em] animate-pulse border-b-4 border-current align-baseline"
        />
      )}
    </span>
  );
}
