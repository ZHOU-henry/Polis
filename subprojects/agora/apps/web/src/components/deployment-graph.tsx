import type { EngagementDetail } from "@agora/shared/domain";
import type { Locale } from "../lib/locale";
import { humanizeToken, toneClass } from "../lib/presenters";

type DeploymentGraphProps = {
  engagement: EngagementDetail;
  locale: Locale;
};

export function DeploymentGraph({ engagement, locale }: DeploymentGraphProps) {
  const nodes = [
    {
      label: locale === "zh" ? "需求" : "Demand",
      value: engagement.taskRequest.title,
      status: engagement.taskRequest.status
    },
    {
      label: locale === "zh" ? "承接响应" : "Accepted response",
      value: engagement.demandResponse.headline,
      status: engagement.demandResponse.status
    },
    {
      label: locale === "zh" ? "交付对象" : "Engagement",
      value: engagement.title,
      status: engagement.status
    },
    {
      label: locale === "zh" ? "交付执行" : "Delivery runs",
      value:
        engagement.taskRuns.length > 0
          ? `${engagement.taskRuns.length} ${locale === "zh" ? "条 run" : "runs"}`
          : locale === "zh"
            ? "尚未启动"
            : "Not started",
      status: engagement.taskRuns[0]?.status ?? "pending"
    },
    {
      label: locale === "zh" ? "客户确认" : "Customer confirmation",
      value: engagement.customerConfirmation?.summary ?? (locale === "zh" ? "尚未提交" : "Not submitted"),
      status: engagement.customerConfirmation?.status ?? "pending"
    },
    {
      label: locale === "zh" ? "扩展信号" : "Expansion signal",
      value:
        engagement.customerConfirmation?.status === "expansion_requested"
          ? locale === "zh"
            ? "已进入扩展评估"
            : "Expansion review active"
          : locale === "zh"
            ? "仍处于当前阶段"
            : "Still inside current scope",
      status:
        engagement.customerConfirmation?.status === "expansion_requested"
          ? "expansion"
          : "stable"
    }
  ];

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">
          {locale === "zh" ? "Deployment Graph" : "Deployment Graph"}
        </p>
        <h2>
          {locale === "zh"
            ? "把市场对象、交付对象、执行对象和扩展对象放在一条图里"
            : "Keep market, delivery, execution, and expansion objects on one graph"}
        </h2>
      </div>
      <div className="deployment-graph">
        {nodes.map((node, index) => (
          <article key={node.label} className="deployment-node">
            <div className="timelinehead">
              <p className="tagline">{node.label}</p>
              <span className={`statuspill ${toneClass(node.status)}`}>
                {humanizeToken(node.status, locale)}
              </span>
            </div>
            <p>{node.value}</p>
            {index < nodes.length - 1 ? (
              <div className="deployment-arrow" aria-hidden="true">
                <span />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
