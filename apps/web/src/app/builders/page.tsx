import Link from "next/link";
import { MediaCard } from "../../components/media-card";
import { getDemandBoard, getProviderCatalog } from "../../lib/api";
import { localizeAgent, localizeProvider } from "../../lib/catalog-copy";
import { getLocale } from "../../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../../lib/presenters";

export default async function BuildersPage() {
  const locale = await getLocale();
  const providers = (await getProviderCatalog()).map((provider) =>
    localizeProvider(provider, locale)
  );
  const demand = (await getDemandBoard()).map((item) => ({
    ...item,
    agent: localizeAgent(item.agent, locale)
  }));

  const t =
    locale === "zh"
      ? {
          eyebrow: "供给侧",
          title: "开发者侧的供给管理与机会入口。",
          lede: "供给侧最关心的是：有哪些需求值得追、我的供给如何展示、平台如何让客户看到我的价值。",
          primary: "查看开发者目录",
          secondary: "查看需求板",
          supplyTitle: "当前供给方",
          demandTitle: "值得响应的需求机会",
          actionProvider: "查看档案",
          actionDemand: "响应需求"
        }
      : {
          eyebrow: "Builder Side",
          title: "The supply-management and opportunity entry point for builders.",
          lede: "Builders care about what demand is worth pursuing, how their supply is presented, and how the platform makes their value legible to customers.",
          primary: "Open builder directory",
          secondary: "Open demand board",
          supplyTitle: "Current builders",
          demandTitle: "Demand opportunities worth pursuing",
          actionProvider: "Open profile",
          actionDemand: "Respond to demand"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.lede}</p>
          <div className="buttonrow">
            <Link href="/providers" className="actionlink actionlink-primary">
              {t.primary}
            </Link>
            <Link href="/demand" className="actionlink">
              {t.secondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="media-stage media-stage-balanced">
          <MediaCard
            src="/media/builder-network-loop.svg"
            alt="Builder-side supply visual."
            kicker={locale === "zh" ? "供给侧" : "Supply side"}
            title={
              locale === "zh"
                ? "开发者需要的不只是展示，而是承接机会"
                : "Builders need opportunity capture, not just profile display"
            }
            caption={
              locale === "zh"
                ? "供给侧界面必须把需求板和供给档案放在一起，形成响应闭环。"
                : "The builder surface needs demand and supply in the same frame so response becomes natural."
            }
          />
          <MediaCard
            src="/media/warehouse-orchestration-loop.svg"
            alt="Builder-side industrial opportunity visual."
            kicker={locale === "zh" ? "行业供给" : "Industry supply"}
            title={
              locale === "zh"
                ? "垂直场景 Builder 才是真正的平台供给"
                : "Vertical-scenario builders are the real supply side"
            }
            caption={
              locale === "zh"
                ? "平台要吸引的是能把行业问题做成 Agent 产品的开发者。"
                : "The platform needs builders who can turn industry problems into real agent products."
            }
          />
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "开发者档案" : "Builder profiles"}</p>
          <h2>{t.supplyTitle}</h2>
        </div>
        <div className="grid">
          {providers.map((provider) => (
            <article key={provider.id} className="card">
              <div className="cardtopline">
                <span className="microeyebrow">builder</span>
                <span className={`statuspill ${toneClass(provider.status)}`}>
                  {humanizeToken(provider.status, locale)}
                </span>
              </div>
              <h3>{provider.name}</h3>
              <p>{provider.summary}</p>
              <Link href={`/providers/${provider.slug}`} className="cardlink">
                {t.actionProvider}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="sectionhead">
          <p className="eyebrow">{locale === "zh" ? "机会板" : "Opportunity board"}</p>
          <h2>{t.demandTitle}</h2>
        </div>
        <div className="timeline">
          {demand.slice(0, 6).map((item) => (
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
          ))}
        </div>
      </section>
    </main>
  );
}
