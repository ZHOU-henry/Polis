import { sampleAgents } from "@agora/shared/domain";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Agora v0</p>
        <h1>AI Agent Platform</h1>
        <p className="lede">
          A narrow, operator-facing MVP for cataloging agent capabilities,
          routing tasks, and reviewing execution records.
        </p>
      </section>

      <section className="panel">
        <h2>Phase-1 Product Surfaces</h2>
        <ul>
          <li>Agent catalog</li>
          <li>Task intake and routing</li>
          <li>Execution record</li>
          <li>Operator review</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Seed Agent Catalog</h2>
        <div className="grid">
          {sampleAgents.map((agent) => (
            <article key={agent.id} className="card">
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <p className="tagline">{agent.tags.join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
