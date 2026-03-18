import type { Locale } from "./locale";

export function getProviderConnectorPacks(providerSlug: string, locale: Locale) {
  const zh: Record<string, string[]> = {
    "lingxi-factory-ai": ["MES / APS", "班次事件流", "PLC / SCADA", "工厂异常看板"],
    "praxis-quality-lab": ["相机 / 边缘盒", "QA 复核台", "SPC / Traceability", "缺陷工单流"],
    "relay-field-systems": ["WMS / TMS", "CMMS", "巡检机器人", "现场工单系统"]
  };

  const en: Record<string, string[]> = {
    "lingxi-factory-ai": ["MES / APS", "Shift event stream", "PLC / SCADA", "Factory exception board"],
    "praxis-quality-lab": ["Camera / edge box", "QA review console", "SPC / traceability", "Defect work-order flow"],
    "relay-field-systems": ["WMS / TMS", "CMMS", "Inspection robots", "Field work-order systems"]
  };

  return (locale === "zh" ? zh : en)[providerSlug] ?? (locale === "zh"
    ? ["Connector pack 规划中"]
    : ["Connector pack planning in progress"]);
}

export function getGovernanceFrames(locale: Locale) {
  return locale === "zh"
    ? [
        "角色和写路径权限边界",
        "交付审核与可追溯记录",
        "客户确认与现场 incident 回路",
        "扩展前的风险闸门"
      ]
    : [
        "Role and write-path boundaries",
        "Delivery review and traceability",
        "Customer confirmation and incident loop",
        "Risk gates before expansion"
      ];
}
