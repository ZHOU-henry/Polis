import Link from "next/link";
import { getEngagements } from "../../lib/api";
import { localizeProvider } from "../../lib/catalog-copy";
import { getEngagementHealth } from "../../lib/engagement-intelligence";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function EngagementsPage() {
  const locale = await getLocale();
  const engagements = (await getEngagements()).map((engagement) => ({
    ...engagement,
    provider: localizeProvider(engagement.provider, locale)
  }));
  const expansionPipeline = engagements.filter(
    (engagement) =>
      engagement.customerConfirmationStatus === "expansion_requested" ||
      getEngagementHealth(engagement) === "expansion"
  );
  const blocked = engagements.filter(
    (engagement) => getEngagementHealth(engagement) === "blocked"
  );

  const t =
    locale === "zh"
      ? {
          eyebrow: "承接项目",
          title: "从被接受响应开始，平台进入正式交付阶段。",
          lede: "这里不是浏览层，而是已经进入正式承接的工作对象列表。",
          back: "返回平台",
          empty: "当前还没有正式承接项目。",
          action: "查看承接详情"
        }
      : {
          eyebrow: "Engagements",
          title: "Once a response is accepted, the platform enters formal delivery.",
          lede: "This is not a browsing surface. It is the list of work objects that have already entered engagement.",
          back: "Back to platform",
          empty: "No formal engagements exist yet.",
          action: "Open engagement"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.lede}</p>
          <div className="buttonrow">
            <Link href="/" className="actionlink">
              {t.back}
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">
            {locale === "zh" ? "Expansion Pipeline" : "Expansion Pipeline"}
          </p>
          <h2>
            {locale === "zh"
              ? "把试点成功后可能扩开的对象单独抽出来"
              : "Pull out the engagements that can credibly expand after the pilot"}
          </h2>
        </div>
        <div className="surface-grid surface-grid-two">
          <article className="card">
            <h3>{locale === "zh" ? "扩展候选" : "Expansion candidates"}</h3>
            <p>
              {locale === "zh"
                ? `${expansionPipeline.length} 个 engagement 已经带出明显扩展信号。`
                : `${expansionPipeline.length} engagements already carry explicit expansion signals.`}
            </p>
          </article>
          <article className="card">
            <h3>{locale === "zh" ? "风险拦截" : "Risk gates"}</h3>
            <p>
              {locale === "zh"
                ? `${blocked.length} 个 engagement 仍然处于阻塞状态，不能直接进入扩展。`
                : `${blocked.length} engagements are still blocked and should not move into expansion yet.`}
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="timeline">
          {engagements.length === 0 ? (
            <p>{t.empty}</p>
          ) : (
            engagements.map((engagement) => (
              <article key={engagement.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{engagement.provider.name}</p>
                  <span className={`statuspill ${toneClass(engagement.status)}`}>
                    {humanizeToken(engagement.status, locale)}
                  </span>
                </div>
                <p>{engagement.title}</p>
                <p>{engagement.summary}</p>
                <p className="tagline">
                  {locale === "zh" ? "客户确认" : "Customer confirmation"} /{" "}
                  {engagement.customerConfirmationStatus
                    ? humanizeToken(engagement.customerConfirmationStatus, locale)
                    : locale === "zh"
                      ? "未开始"
                      : "Not started"}
                  {" / "}
                  {locale === "zh" ? "开放 incident" : "Open incidents"} / {engagement.openIncidentCount}
                </p>
                <p className="timestamp">{formatTimestamp(engagement.createdAt, locale)}</p>
                <Link href={`/engagements/${engagement.id}`} className="cardlink">
                  {t.action}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
