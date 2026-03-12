import Link from "next/link";
import { getAgentCatalog } from "../lib/api";

export default async function HomePage() {
  const agents = await getAgentCatalog();

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
          {agents.map((agent) => (
            <article key={agent.id} className="card">
              <h3>{agent.name}</h3>
              <p>{agent.summary}</p>
              <p className="tagline">{agent.tags.join(" · ")}</p>
              <Link href={`/agents/${agent.slug}`} className="cardlink">
                Inspect and submit task
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
