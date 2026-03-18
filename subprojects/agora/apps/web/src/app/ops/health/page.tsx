import Link from "next/link";
import { getEngagements, getTaskRequests, getTaskRuns } from "../../../lib/api";
import { localizeAgent, localizeProvider } from "../../../lib/catalog-copy";
import {
  getEngagementHealth,
  summarizePlatformOperations
} from "../../../lib/engagement-intelligence";
import { getLocale } from "../../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../../lib/presenters";

export default async function OpsHealthPage() {
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

  const metrics = summarizePlatformOperations(requests, engagements, runs);
  const blocked = engagements.filter((item) => getEngagementHealth(item) === "blocked");
  const expansion = engagements.filter((item) => getEngagementHealth(item) === "expansion");
  const watch = engagements.filter((item) => getEngagementHealth(item) === "watch");

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{locale === "zh" ? "Ops Health Dashboard" : "Ops Health Dashboard"}</p>
          <h1>
            {locale === "zh"
              ? "把 conversion、execution、delivery risk、expansion 拉到同一面板"
              : "Put conversion, execution, delivery risk, and expansion on one board"}
          </h1>
          <p className="lede">
            {locale === "zh"
              ? "这个页面是 Agora 2.5 的第一版运维健康看板，重点不是更多图表，而是更快看出平台下一步该推进哪里。"
              : "This is the first Agora 2.5 health board. The goal is not more charts, but faster judgment on where the platform should move next."}
          </p>
          <div className="buttonrow">
            <Link href="/ops" className="actionlink actionlink-primary">
              {locale === "zh" ? "返回运营台" : "Back to ops"}
            </Link>
          </div>
        </div>

        <aside className="signalpanel">
          <p className="panelkicker">{locale === "zh" ? "平台健康" : "Platform health"}</p>
          <div className="stats stats-grid">
            <div className="stat">
              <strong>{metrics.waitingForResponse}</strong>
              <span>{locale === "zh" ? "待响应" : "waiting"}</span>
            </div>
            <div className="stat">
              <strong>{metrics.awaitingDecision}</strong>
              <span>{locale === "zh" ? "待决策" : "decision"}</span>
            </div>
            <div className="stat">
              <strong>{metrics.activeRuns}</strong>
              <span>{locale === "zh" ? "活跃 run" : "active runs"}</span>
            </div>
            <div className="stat">
              <strong>{metrics.blockedEngagements}</strong>
              <span>{locale === "zh" ? "阻塞交付" : "blocked"}</span>
            </div>
            <div className="stat">
              <strong>{metrics.expansionSignals}</strong>
              <span>{locale === "zh" ? "扩展信号" : "expansion"}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "风险优先级" : "Risk priority"}</p>
          <h2>
            {locale === "zh"
              ? "先处理被 incident 或客户确认压住的 engagement"
              : "Handle the engagements blocked by incidents or customer confirmation first"}
          </h2>
        </div>
        <div className="timeline">
          {blocked.length === 0 ? (
            <p>{locale === "zh" ? "当前没有阻塞交付。" : "No blocked engagements right now."}</p>
          ) : (
            blocked.map((engagement) => (
              <article key={engagement.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{engagement.provider.name}</p>
                  <span className={`statuspill ${toneClass("blocked")}`}>
                    {humanizeToken("blocked", locale)}
                  </span>
                </div>
                <p>{engagement.title}</p>
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
                <Link href={`/engagements/${engagement.id}`} className="cardlink">
                  {locale === "zh" ? "查看承接" : "Open engagement"}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "扩展队列" : "Expansion queue"}</p>
          <h2>
            {locale === "zh"
              ? "把 pilot 成功后的扩展信号集中出来"
              : "Concentrate the engagements that are already showing pilot-to-scale signals"}
          </h2>
        </div>
        <div className="timeline">
          {expansion.length === 0 ? (
            <p>{locale === "zh" ? "当前还没有扩展队列。" : "No expansion queue yet."}</p>
          ) : (
            expansion.map((engagement) => (
              <article key={engagement.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{engagement.provider.name}</p>
                  <span className={`statuspill ${toneClass("expansion")}`}>
                    {humanizeToken("expansion", locale)}
                  </span>
                </div>
                <p>{engagement.title}</p>
                <p className="tagline">
                  {locale === "zh" ? "更新时间" : "Updated"} / {formatTimestamp(engagement.updatedAt, locale)}
                </p>
                <Link href={`/engagements/${engagement.id}`} className="cardlink">
                  {locale === "zh" ? "查看扩展对象" : "Open expansion candidate"}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "观察队列" : "Watch queue"}</p>
          <h2>
            {locale === "zh"
              ? "这些对象还没坏，但已经值得运营台持续盯住"
              : "These objects are not broken yet, but they are worth sustained attention"}
          </h2>
        </div>
        <div className="timeline">
          {watch.length === 0 ? (
            <p>{locale === "zh" ? "当前没有观察队列。" : "No watch queue right now."}</p>
          ) : (
            watch.map((engagement) => (
              <article key={engagement.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{engagement.provider.name}</p>
                  <span className={`statuspill ${toneClass("watch")}`}>
                    {humanizeToken("watch", locale)}
                  </span>
                </div>
                <p>{engagement.title}</p>
                <p className="tagline">
                  {locale === "zh" ? "开放反馈" : "Unresolved feedback"} / {engagement.unresolvedFeedbackCount}
                </p>
                <Link href={`/engagements/${engagement.id}`} className="cardlink">
                  {locale === "zh" ? "查看对象" : "Open object"}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
