import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getEngagements, getTaskRequests, getTaskRuns } from "../../lib/api";
import { localizeAgent, localizeProvider } from "../../lib/catalog-copy";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function OpsPage() {
  const locale = await getLocale();
  const requests = (await getTaskRequests()).map((request) => ({
    ...request,
    agent: localizeAgent(request.agent, locale)
  }));
  const runs = (await getTaskRuns()).map((run) => ({
    ...run,
    agent: localizeAgent(run.agent, locale)
  }));
  const engagements = (await getEngagements()).map((engagement) => ({
    ...engagement,
    provider: localizeProvider(engagement.provider, locale)
  }));

  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  );
  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  );

  const t =
    locale === "zh"
      ? {
          eyebrow: "平台运营",
          title: "平台运营者需要一眼看清需求、运行、审核与承接全局。",
          lede: "运营侧不是做内容浏览，而是做平台流转、风险控制和交付推进。",
          primary: "查看执行台",
          secondary: "查看承接项目",
          active: "运行中",
          review: "待审核",
          requests: "需求总数",
          engagements: "承接项目",
          activeTitle: "实时运行",
          reviewTitle: "审核队列",
          engagementTitle: "正式承接对象",
          actionRun: "查看运行",
          actionEngagement: "查看承接"
        }
      : {
          eyebrow: "Platform Ops",
          title: "Operators need one surface for demand, runs, review, and engagements.",
          lede: "The ops role is not browsing content. It is controlling platform flow, risk, and delivery movement.",
          primary: "Open queue",
          secondary: "Open engagements",
          active: "active",
          review: "review",
          requests: "requests",
          engagements: "engagements",
          activeTitle: "Live runs",
          reviewTitle: "Review queue",
          engagementTitle: "Formal engagements",
          actionRun: "Inspect run",
          actionEngagement: "Open engagement"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.lede}</p>
          <div className="buttonrow">
            <Link href="/queue" className="actionlink actionlink-primary">
              {t.primary}
            </Link>
            <Link href="/engagements" className="actionlink">
              {t.secondary}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{t.eyebrow}</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{activeRuns.length}</strong>
              <span>{t.active}</span>
            </div>
            <div className="stat">
              <strong>{reviewQueue.length}</strong>
              <span>{t.review}</span>
            </div>
            <div className="stat">
              <strong>{requests.length}</strong>
              <span>{t.requests}</span>
            </div>
            <div className="stat">
              <strong>{engagements.length}</strong>
              <span>{t.engagements}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/execution-reel-loop.svg"
            alt="Operations execution visual."
            kicker={locale === "zh" ? "运营控制" : "Operations"}
            title={
              locale === "zh"
                ? "运营侧优先看到平台流动而不是静态页面"
                : "Ops should see flow before static content"
            }
            caption={
              locale === "zh"
                ? "运营者需要持续掌控需求、响应、运行和承接的状态变化。"
                : "Operators need continuous visibility over demand, responses, runs, and engagements."
            }
          />
          <MediaCard
            src="/media/quality-vision-loop.svg"
            alt="Audit and review visual."
            kicker={locale === "zh" ? "审核" : "Review"}
            title={
              locale === "zh"
                ? "审核与风险控制是运营侧的核心职责"
                : "Review and risk control are core ops duties"
            }
            caption={
              locale === "zh"
                ? "平台运营不是只做监控，更要推动审核与交付闭环。"
                : "Ops is not passive monitoring. It pushes review and delivery to closure."
            }
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "运行" : "Runs"}</p>
          <h2>{t.activeTitle}</h2>
        </div>
        <div className="timeline">
          {activeRuns.slice(0, 6).map((run) => (
            <article key={run.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{run.agent.name}</p>
                <span className={`statuspill ${toneClass(run.status)}`}>
                  {humanizeToken(run.status, locale)}
                </span>
              </div>
              <p>{run.taskTitle}</p>
              <p>{run.latestMessage || "-"}</p>
              <Link href={`/runs/${run.id}`} className="cardlink">
                {t.actionRun}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "审核" : "Review"}</p>
          <h2>{t.reviewTitle}</h2>
        </div>
        <div className="timeline">
          {reviewQueue.slice(0, 6).map((run) => (
            <article key={run.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{run.agent.name}</p>
                <span className={`statuspill ${toneClass(run.status)}`}>
                  {humanizeToken(run.status, locale)}
                </span>
              </div>
              <p>{run.taskTitle}</p>
              <p>{run.resultSummary || "-"}</p>
              <Link href={`/runs/${run.id}`} className="cardlink">
                {t.actionRun}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "承接" : "Engagements"}</p>
          <h2>{t.engagementTitle}</h2>
        </div>
        <div className="timeline">
          {engagements.slice(0, 6).map((engagement) => (
            <article key={engagement.id} className="timelineitem">
              <div className="timelinehead">
                <p className="tagline">{engagement.provider.name}</p>
                <span className={`statuspill ${toneClass(engagement.status)}`}>
                  {humanizeToken(engagement.status, locale)}
                </span>
              </div>
              <p>{engagement.title}</p>
              <p>{engagement.summary}</p>
              <p className="timestamp">{formatTimestamp(engagement.createdAt, locale)}</p>
              <Link href={`/engagements/${engagement.id}`} className="cardlink">
                {t.actionEngagement}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
