"use client";

import { useState } from "react";
import {
  AgentDefinitionInputSchema,
  type ProviderProfile,
  ProviderProfileInputSchema
} from "@agora/shared/domain";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type BuilderStudioProps = {
  initialProviders: ProviderProfile[];
  locale: Locale;
};

export function BuilderStudio({
  initialProviders,
  locale
}: BuilderStudioProps) {
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [providers, setProviders] = useState(initialProviders);
  const [providerSlug, setProviderSlug] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerSummary, setProviderSummary] = useState("");
  const [providerDescription, setProviderDescription] = useState("");
  const [providerType, setProviderType] = useState<"first_party" | "company" | "independent">("company");
  const [providerTags, setProviderTags] = useState("");
  const [providerError, setProviderError] = useState("");
  const [agentProviderId, setAgentProviderId] = useState(initialProviders[0]?.id ?? "");
  const [agentSlug, setAgentSlug] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentSummary, setAgentSummary] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [agentTags, setAgentTags] = useState("");
  const [agentConstraints, setAgentConstraints] = useState("");
  const [agentTrustSignals, setAgentTrustSignals] = useState("");
  const [agentProvenanceSummary, setAgentProvenanceSummary] = useState("");
  const [agentError, setAgentError] = useState("");
  const [pending, setPending] = useState("");

  const t =
    locale === "zh"
      ? {
          providerTitle: "创建开发者档案",
          providerSubmit: "创建开发者",
          agentTitle: "创建 Agent Listing",
          agentSubmit: "创建 Agent",
          readOnly: "当前模式不可写。",
          invalidProvider: "开发者档案信息不完整。",
          invalidAgent: "Agent 信息不完整。",
          slug: "Slug",
          name: "名称",
          summary: "简介",
          description: "详细说明",
          type: "类型",
          tags: "标签（逗号分隔）",
          constraints: "约束（每行一条）",
          trust: "可信信号（每行一条）",
          provider: "开发者",
          provenance: "来源说明"
        }
      : {
          providerTitle: "Create builder profile",
          providerSubmit: "Create builder",
          agentTitle: "Create agent listing",
          agentSubmit: "Create agent",
          readOnly: "Current mode is not writeable.",
          invalidProvider: "Provider profile is incomplete.",
          invalidAgent: "Agent definition is incomplete.",
          slug: "Slug",
          name: "Name",
          summary: "Summary",
          description: "Description",
          type: "Type",
          tags: "Tags (comma separated)",
          constraints: "Constraints (one per line)",
          trust: "Trust signals (one per line)",
          provider: "Builder",
          provenance: "Provenance summary"
        };

  async function submitProvider(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProviderError("");

    if (readOnlyPreview) {
      setProviderError(t.readOnly);
      return;
    }

    const parsed = ProviderProfileInputSchema.safeParse({
      slug: providerSlug,
      name: providerName,
      summary: providerSummary,
      description: providerDescription,
      type: providerType,
      tags: providerTags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      website: "",
      status: "active"
    });

    if (!parsed.success) {
      setProviderError(t.invalidProvider);
      return;
    }

    setPending("provider");

    try {
      const response = await fetch(`${browserApiBasePath}/providers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const payload = (await response.json()) as { item?: ProviderProfile; error?: string };
      const item = payload.item;

      if (!response.ok || !item) {
        throw new Error(payload.error ?? t.invalidProvider);
      }

      setProviders((prev) => [...prev, item]);
      setAgentProviderId(item.id);
      setProviderSlug("");
      setProviderName("");
      setProviderSummary("");
      setProviderDescription("");
      setProviderTags("");
    } catch (error) {
      setProviderError(error instanceof Error ? error.message : t.invalidProvider);
    } finally {
      setPending("");
    }
  }

  async function submitAgent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAgentError("");

    if (readOnlyPreview) {
      setAgentError(t.readOnly);
      return;
    }

    const parsed = AgentDefinitionInputSchema.safeParse({
      providerId: agentProviderId,
      slug: agentSlug,
      name: agentName,
      summary: agentSummary,
      description: agentDescription,
      provenanceStatus: "seeded",
      provenanceSummary: agentProvenanceSummary,
      tags: agentTags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      constraints: agentConstraints
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      trustSignals: agentTrustSignals
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      status: "active"
    });

    if (!parsed.success) {
      setAgentError(t.invalidAgent);
      return;
    }

    setPending("agent");

    try {
      const response = await fetch(`${browserApiBasePath}/agents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const payload = (await response.json()) as { item?: unknown; error?: string };

      if (!response.ok || !payload.item) {
        throw new Error(payload.error ?? t.invalidAgent);
      }

      setAgentSlug("");
      setAgentName("");
      setAgentSummary("");
      setAgentDescription("");
      setAgentTags("");
      setAgentConstraints("");
      setAgentTrustSignals("");
      setAgentProvenanceSummary("");
    } catch (error) {
      setAgentError(error instanceof Error ? error.message : t.invalidAgent);
    } finally {
      setPending("");
    }
  }

  return (
    <div className="surface-grid surface-grid-two">
      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.providerTitle}</p>
        </div>
        <form className="form" onSubmit={submitProvider}>
          <label>
            <span>{t.slug}</span>
            <input value={providerSlug} onChange={(e) => setProviderSlug(e.target.value)} />
          </label>
          <label>
            <span>{t.name}</span>
            <input value={providerName} onChange={(e) => setProviderName(e.target.value)} />
          </label>
          <label>
            <span>{t.summary}</span>
            <textarea value={providerSummary} onChange={(e) => setProviderSummary(e.target.value)} rows={3} />
          </label>
          <label>
            <span>{t.description}</span>
            <textarea value={providerDescription} onChange={(e) => setProviderDescription(e.target.value)} rows={4} />
          </label>
          <label>
            <span>{t.type}</span>
            <select value={providerType} onChange={(e) => setProviderType(e.target.value as typeof providerType)}>
              <option value="company">company</option>
              <option value="independent">independent</option>
              <option value="first_party">first_party</option>
            </select>
          </label>
          <label>
            <span>{t.tags}</span>
            <input value={providerTags} onChange={(e) => setProviderTags(e.target.value)} />
          </label>
          <button type="submit" disabled={pending.length > 0}>{t.providerSubmit}</button>
        </form>
        {providerError ? <p className="error">{providerError}</p> : null}
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.agentTitle}</p>
        </div>
        <form className="form" onSubmit={submitAgent}>
          <label>
            <span>{t.provider}</span>
            <select value={agentProviderId} onChange={(e) => setAgentProviderId(e.target.value)}>
              <option value="">-</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t.slug}</span>
            <input value={agentSlug} onChange={(e) => setAgentSlug(e.target.value)} />
          </label>
          <label>
            <span>{t.name}</span>
            <input value={agentName} onChange={(e) => setAgentName(e.target.value)} />
          </label>
          <label>
            <span>{t.summary}</span>
            <textarea value={agentSummary} onChange={(e) => setAgentSummary(e.target.value)} rows={3} />
          </label>
          <label>
            <span>{t.description}</span>
            <textarea value={agentDescription} onChange={(e) => setAgentDescription(e.target.value)} rows={4} />
          </label>
          <label>
            <span>{t.provenance}</span>
            <textarea value={agentProvenanceSummary} onChange={(e) => setAgentProvenanceSummary(e.target.value)} rows={3} />
          </label>
          <label>
            <span>{t.tags}</span>
            <input value={agentTags} onChange={(e) => setAgentTags(e.target.value)} />
          </label>
          <label>
            <span>{t.constraints}</span>
            <textarea value={agentConstraints} onChange={(e) => setAgentConstraints(e.target.value)} rows={4} />
          </label>
          <label>
            <span>{t.trust}</span>
            <textarea value={agentTrustSignals} onChange={(e) => setAgentTrustSignals(e.target.value)} rows={4} />
          </label>
          <button type="submit" disabled={pending.length > 0}>{t.agentSubmit}</button>
        </form>
        {agentError ? <p className="error">{agentError}</p> : null}
      </section>
    </div>
  );
}
