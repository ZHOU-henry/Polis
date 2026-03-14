import type { Locale } from "./locale";

export type BuilderProofSnapshot = {
  proofTitle: string;
  proofSummary: string;
  verificationLabel: string;
  evidence: Array<{
    title: string;
    detail: string;
  }>;
};

const proofSnapshotsZh: Record<string, BuilderProofSnapshot> = {
  "lingxi-factory-ai": {
    proofTitle: "制造调度 Builder 可信度",
    proofSummary: "强调异常解释、班次交接、产线决策，不把自己伪装成通用模型供应商。",
    verificationLabel: "工业调度 / 已建立交付叙事",
    evidence: [
      {
        title: "交付边界清晰",
        detail: "聚焦制造异常、排产冲击和交接决策，而不是泛化到所有办公任务。"
      },
      {
        title: "客户价值可量化",
        detail: "适合用停线时间、交接效率和异常处置时间来讲 ROI。"
      },
      {
        title: "部署对象具体",
        detail: "更接近产线指挥面、事件流和班组操作建议，而不是聊天窗。"
      }
    ]
  },
  "praxis-quality-lab": {
    proofTitle: "工业质检 Builder 可信度",
    proofSummary: "围绕缺陷分流、追溯、复核和部署后质量稳定性来构造供给可信度。",
    verificationLabel: "工业质检 / 已建立交付叙事",
    evidence: [
      {
        title: "贴近质量闭环",
        detail: "把缺陷 review、误报/漏报、追溯和升级流转放在一条交付链里。"
      },
      {
        title: "适合现场迭代",
        detail: "天然适配 deployment feedback、night-shift glare 这类真实现场问题。"
      },
      {
        title: "扩线逻辑自然",
        detail: "试点成功后可以顺着线体、班次、站点逐步扩开。"
      }
    ]
  },
  "relay-field-systems": {
    proofTitle: "现场系统 Builder 可信度",
    proofSummary: "把仓储、巡检和维护类 agent 讲成持续运营系统，而不是单点 AI 功能。",
    verificationLabel: "现场运营 / 已建立交付叙事",
    evidence: [
      {
        title: "现场动作强",
        detail: "强调任务流、设备动作、工单和一线操作，而不是抽象智能能力。"
      },
      {
        title: "适合持续服务",
        detail: "更容易形成 incident、维护、版本迭代和续约扩展。"
      },
      {
        title: "运营价值明确",
        detail: "适合从吞吐、停机、响应时间和闭环率等指标讲清价值。"
      }
    ]
  }
};

const defaultZh: BuilderProofSnapshot = {
  proofTitle: "Builder 可信度",
  proofSummary: "需要从交付边界、客户结果和持续运营能力来判断，而不是只看 listing 文案。",
  verificationLabel: "基础供给 / 待更多验证",
  evidence: [
    {
      title: "交付边界",
      detail: "先看它是否清楚自己解决哪个行业、哪个工作流、哪个部署对象。"
    },
    {
      title: "运营能力",
      detail: "再看它是否能处理 incident、反馈和版本推进，而不只是写 proposal。"
    },
    {
      title: "扩展潜力",
      detail: "最后看它能否从单点试点走向站点、线体或区域扩展。"
    }
  ]
};

const proofSnapshotsEn: Record<string, BuilderProofSnapshot> = {
  "lingxi-factory-ai": {
    proofTitle: "Manufacturing orchestration builder proof",
    proofSummary:
      "The builder is framed around exception interpretation, shift handover, and line-side decisions instead of pretending to be a generic model vendor.",
    verificationLabel: "Industrial orchestration / delivery narrative established",
    evidence: [
      {
        title: "Clear delivery boundary",
        detail:
          "It focuses on manufacturing exceptions, scheduling impact, and handover decisions instead of drifting into generic office AI."
      },
      {
        title: "Quantifiable buyer value",
        detail:
          "The ROI story can be told through downtime reduction, handover efficiency, and faster exception handling."
      },
      {
        title: "Concrete deployment object",
        detail:
          "The product is legible as a command surface, event flow, and operator decision layer instead of a chat widget."
      }
    ]
  },
  "praxis-quality-lab": {
    proofTitle: "Industrial quality builder proof",
    proofSummary:
      "The builder credibility is anchored in defect triage, traceability, review flow, and post-deployment quality stability.",
    verificationLabel: "Industrial quality / delivery narrative established",
    evidence: [
      {
        title: "Built around quality closure",
        detail:
          "It keeps defect review, false-positive pressure, traceability, and escalation inside one delivery loop."
      },
      {
        title: "Fits real field iteration",
        detail:
          "It naturally fits deployment feedback such as night-shift glare, calibration drift, and misclassification pressure."
      },
      {
        title: "Natural expansion logic",
        detail:
          "Once the pilot works, the rollout can extend line by line, shift by shift, and station by station."
      }
    ]
  },
  "relay-field-systems": {
    proofTitle: "Field systems builder proof",
    proofSummary:
      "The builder presents warehouse, inspection, and maintenance agents as ongoing operating systems instead of one-off AI features.",
    verificationLabel: "Field operations / delivery narrative established",
    evidence: [
      {
        title: "Strong field-action posture",
        detail:
          "It emphasizes missions, equipment actions, work orders, and frontline operator loops rather than abstract intelligence."
      },
      {
        title: "Built for recurring service",
        detail:
          "The product shape naturally supports incidents, maintenance cycles, versioning, and renewal expansion."
      },
      {
        title: "Clear operating value",
        detail:
          "The ROI case can be framed through throughput, downtime, response time, and closure quality."
      }
    ]
  }
};

const defaultEn: BuilderProofSnapshot = {
  proofTitle: "Builder proof posture",
  proofSummary:
    "Trust should come from delivery boundary, buyer outcome, and operating maturity, not from listing copy alone.",
  verificationLabel: "Base supply / more verification needed",
  evidence: [
    {
      title: "Delivery boundary",
      detail:
        "Start by checking whether the builder clearly knows the industry, workflow, and deployment object it serves."
    },
    {
      title: "Operating ability",
      detail:
        "Then check whether it can handle incidents, feedback, and version progression instead of only writing proposals."
    },
    {
      title: "Expansion potential",
      detail:
        "Finally, judge whether the builder can move from a pilot into site, line, or region-level scale-out."
    }
  ]
};

export function getBuilderProofSnapshot(
  providerSlug: string,
  locale: Locale
): BuilderProofSnapshot {
  return locale === "zh"
    ? proofSnapshotsZh[providerSlug] ?? defaultZh
    : proofSnapshotsEn[providerSlug] ?? defaultEn;
}
