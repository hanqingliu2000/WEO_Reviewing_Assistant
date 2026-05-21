import { mockReviewItems, mockReviewSession } from "../data/mockReviewData";

const severityCounts = mockReviewItems.reduce<Record<string, number>>((counts, item) => {
  counts[item.severity] = (counts[item.severity] ?? 0) + 1;
  return counts;
}, {});

export function App() {
  const firstItem = mockReviewItems[0];

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="app-title">
        <p className="eyebrow">Local review workbench</p>
        <h1 id="app-title">WEO Reviewing Assistant</h1>
        <p className="lede">
          React source is bootstrapped under <code>frontend/src</code>. The production build emits static assets to{" "}
          <code>frontend/dist</code> for Flask to serve.
        </p>
      </section>

      <section className="status-grid" aria-label="Mock review session summary">
        <article className="status-card">
          <span>Session</span>
          <strong>{mockReviewSession.session_id}</strong>
        </article>
        <article className="status-card">
          <span>Country</span>
          <strong>
            {mockReviewSession.country.iso_code} · {mockReviewSession.country.name}
          </strong>
        </article>
        <article className="status-card">
          <span>Flagged pairs</span>
          <strong>{mockReviewItems.length}</strong>
        </article>
      </section>

      <section className="workbench-preview" aria-label="Workbench preview">
        <aside className="preview-column">
          <h2>Navigation</h2>
          <div className="severity-list">
            {Object.entries(severityCounts).map(([severity, count]) => (
              <span className="severity-pill" key={severity}>
                {severity}: {count}
              </span>
            ))}
          </div>
        </aside>

        <section className="preview-main">
          <h2>{firstItem.indicator_name}</h2>
          <p>{firstItem.validation_name}</p>
          <dl>
            <div>
              <dt>Sector</dt>
              <dd>{firstItem.sector_name}</dd>
            </div>
            <div>
              <dt>Flagged periods</dt>
              <dd>{firstItem.flagged_periods.join(", ")}</dd>
            </div>
          </dl>
        </section>

        <aside className="preview-column">
          <h2>Draft</h2>
          <p>Mock draft generation and edit workflow will attach here in the next slice.</p>
        </aside>
      </section>
    </main>
  );
}
