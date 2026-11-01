export function CardGridSkeleton({
  count = 3,
  variant = "story",
}: {
  count?: number;
  variant?: "story" | "officer";
}) {
  return (
    <div
      className={variant === "officer" ? "officer-grid loading-grid" : "cards loading-grid"}
      role="status"
      aria-label="Loading content"
      aria-busy="true"
    >
      <span className="sr-only">Loading content…</span>
      {Array.from({ length: count }, (_, index) =>
        variant === "officer" ? (
          <div className="officer-card-skeleton" key={index} aria-hidden="true">
            <span className="skeleton skeleton-avatar" />
            <span className="skeleton skeleton-kicker" />
            <span className="skeleton skeleton-name" />
            <span className="skeleton skeleton-line" />
          </div>
        ) : (
          <div className="story-card-skeleton" key={index} aria-hidden="true">
            <span className="skeleton skeleton-image" />
            <span className="skeleton skeleton-kicker" />
            <span className="skeleton skeleton-name" />
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line short" />
          </div>
        ),
      )}
    </div>
  );
}

export function RowListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="loading-rows" role="status" aria-label="Loading list" aria-busy="true">
      <span className="sr-only">Loading list…</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="loading-row" key={index} aria-hidden="true">
          <span className="skeleton skeleton-row-avatar" />
          <span className="loading-row-copy">
            <span className="skeleton skeleton-name" />
            <span className="skeleton skeleton-line" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail-skeleton" role="status" aria-label="Loading story" aria-busy="true">
      <span className="sr-only">Loading story…</span>
      <span className="skeleton skeleton-kicker" />
      <span className="skeleton skeleton-title" />
      <span className="skeleton skeleton-line" />
      <span className="skeleton skeleton-line short" />
      <span className="skeleton skeleton-detail-image" />
      <span className="skeleton skeleton-prose" />
      <span className="skeleton skeleton-prose" />
    </div>
  );
}
