import Link from "next/link";
import { BuilderStudio } from "../../../components/builder-studio";
import { getProviderCatalog } from "../../../lib/api";
import { localizeProvider } from "../../../lib/catalog-copy";
import { getLocale } from "../../../lib/locale";

export default async function BuilderStudioPage() {
  const locale = await getLocale();
  const providers = (await getProviderCatalog()).map((provider) =>
    localizeProvider(provider, locale)
  );

  const t =
    locale === "zh"
      ? {
          eyebrow: "Builder Studio",
          title: "在平台内创建供给，而不是只在外部维护供给。",
          lede: "这是供给侧走向自助化管理的第一步：先能创建开发者档案和 Agent listing，再继续做编辑、审核与发布流程。",
          back: "返回供给侧主页"
        }
      : {
          eyebrow: "Builder Studio",
          title: "Create supply inside the platform instead of managing it elsewhere.",
          lede: "This is the first step toward self-serve supply management: create builder profiles and agent listings here, then expand into richer editing, review, and publishing flows.",
          back: "Back to builder side"
        };

  return (
    <main className="page">
      <section className="hero hero-grid">
        <div className="hero-copy hero-copy-tight">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.lede}</p>
          <div className="buttonrow">
            <Link href="/builders" className="actionlink">
              {t.back}
            </Link>
          </div>
        </div>
      </section>

      <BuilderStudio initialProviders={providers} locale={locale} />
    </main>
  );
}
