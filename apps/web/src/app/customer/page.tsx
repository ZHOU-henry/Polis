import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getDemandBoard, getEngagements } from "../../lib/api";
import { localizeAgent, localizeProvider } from "../../lib/catalog-copy";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function CustomerPage() {
  const locale = await getLocale();
  const demand = (await getDemandBoard()).map((item) => ({
    ...item,
    agent: localizeAgent(item.agent, locale)
  }));
  const engagements = (await getEngagements()).map((item) => ({
    ...item,
    provider: localizeProvider(item.provider, locale)
  }));

  const t =
    locale === "zh"
      ? {
          eyebrow: "客户侧",
          title: "面向客户的 Agent 需求与交付入口。",
          lede: "客户最关心三件事：能不能发需求、有没有开发者响应、交付有没有真正推进。",
          primary: "发布需求",
          secondary: "查看已承接项目",
          focusEyebrow: "客户工作流",
          focusTitle: "客户视角不该先看到平台结构，而该先看到交付机会",
          demandTitle: "可发布 / 可浏览的需求",
          demandEmpty: "当前没有公开需求。",
          engagementTitle: "已进入正式承接的项目",
          engagementEmpty: "当前还没有正式承接项目。",
          actionDemand: "查看需求",
          actionEngagement: "查看承接"
        }
      : {
          eyebrow: "Customer Side",
          title: "The demand and delivery entry point for customers.",
          lede: "Customers care about three things first: can they publish demand, are builders responding, and is delivery actually advancing?",
          primary: "Open demand board",
          secondary: "See engagements",
          focusEyebrow: "Customer workflow",
          focusTitle: "Customers should see delivery opportunity first, not internal platform structure",
          demandTitle: "Visible demand opportunities",
          demandEmpty: "No public demand items are visible right now.",
          engagementTitle: "Projects already in formal engagement",
          engagementEmpty: "No formal engagements exist yet.",
          actionDemand: "Inspect demand",
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
            <Link href="/demand" className="actionlink actionlink-primary">
              {t.primary}
            </Link>
            <Link href="/engagements" className="actionlink">
              {t.secondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{t.focusEyebrow}</p>
          <h2>{t.focusTitle}</h2>
        </div>
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/control-theater-loop.svg"
            alt="Customer-side demand and delivery surface."
            kicker={locale === "zh" ? "客户主场景" : "Customer hero"}
            title={locale === "zh" ? "从需求到交付的完整入口" : "A complete entry from demand to delivery"}
            caption={
              locale === "zh"
                ? "客户不用理解后台结构，只要能看懂需求、响应和交付进度。"
                : "Customers do not need internal architecture first. They need visible demand, responses, and delivery progress."
            }
          />
          <MediaCard
            src="/media/factory-command-loop.svg"
            alt="Industrial customer scene."
            kicker={locale === "zh" ? "行业场景" : "Industry scene"}
            title={locale === "zh" ? "传统行业客户先看自己的世界" : "Traditional industry buyers need to see their own world first"}
            caption={
              locale === "zh"
                ? "制造、仓储、质检、运维这些真实场景会比抽象 AI 文案更快激发需求。"
                : "Manufacturing, warehousing, inspection, and maintenance scenes trigger demand faster than abstract AI copy."
            }
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "需求" : "Demand"}</p>
          <h2>{t.demandTitle}</h2>
        </div>
        <div className="timeline">
          {demand.length === 0 ? (
            <p>{t.demandEmpty}</p>
          ) : (
            demand.slice(0, 6).map((item) => (
              <article key={item.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{item.title}</p>
                  <span className={`statuspill ${toneClass(item.status)}`}>
                    {humanizeToken(item.status, locale)}
                  </span>
                </div>
                <p>{item.description}</p>
                <p className="tagline">
                  {locale === "zh" ? "推荐 Agent" : "Recommended agent"} / {item.agent.name}
                </p>
                <p className="timestamp">{formatTimestamp(item.createdAt, locale)}</p>
                <Link href={`/requests/${item.id}`} className="cardlink">
                  {t.actionDemand}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "交付" : "Delivery"}</p>
          <h2>{t.engagementTitle}</h2>
        </div>
        <div className="timeline">
          {engagements.length === 0 ? (
            <p>{t.engagementEmpty}</p>
          ) : (
            engagements.slice(0, 6).map((engagement) => (
              <article key={engagement.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{engagement.provider.name}</p>
                  <span className={`statuspill ${toneClass(engagement.status)}`}>
                    {humanizeToken(engagement.status, locale)}
                  </span>
                </div>
                <p>{engagement.title}</p>
                <p>{engagement.summary}</p>
                <Link href={`/engagements/${engagement.id}`} className="cardlink">
                  {t.actionEngagement}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
