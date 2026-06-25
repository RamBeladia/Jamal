/** Smooth-scroll to a section id, accounting for the sticky header offset. */
export function smoothScrollTo(id: string, reduced: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 68;
  window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduced ? "auto" : "smooth" });
  if (history && history.replaceState) history.replaceState(null, "", "#" + id);
}
