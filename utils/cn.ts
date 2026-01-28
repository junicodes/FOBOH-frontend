// Tiny className combiner to keep UI primitives clean.
export function cn(...classes: Array<string | null | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}
