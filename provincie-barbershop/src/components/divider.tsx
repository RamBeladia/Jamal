/** SVG line that draws itself L→R when it scrolls into view (via .in, set by useScrollReveal). */
export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <svg viewBox="0 0 1200 2" preserveAspectRatio="none">
        <line x1="0" y1="1" x2="1200" y2="1" />
      </svg>
    </div>
  );
}
