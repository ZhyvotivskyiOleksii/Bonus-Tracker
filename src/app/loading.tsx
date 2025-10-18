
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm">
      <div className="stack" role="status" aria-label="Loading">
        <div className="stack__card" />
        <div className="stack__card" />
        <div className="stack__card" />
      </div>
      <div className="mt-6 text-xs tracking-wider text-foreground/80 uppercase">sweep-drop</div>
    </div>
  );
}
