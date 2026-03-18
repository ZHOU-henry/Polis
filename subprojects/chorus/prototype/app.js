const CHORUS_NODES = [
  {
    id: "human",
    label: "Henry",
    role: "Problem owner",
    type: "human",
    model: "Human",
    soul: "Holds the core question stable and decides whether the room is still answering the right problem.",
    memory: "Private notes + explicit room context only.",
    sources: ["shared prompt", "attachments", "follow-up clarifications"],
    color: "#c44f1a",
    x: 90,
    y: 284,
  },
  {
    id: "atlas",
    label: "Atlas",
    role: "Planning agent",
    type: "agent",
    model: "GPT-5.4",
    soul: "Turns vague goals into a structured deliberation plan.",
    memory: "Keeps room objectives, milestone map, and unresolved forks.",
    sources: ["room charter", "prior task graphs", "planning memos"],
    color: "#355fcf",
    x: 260,
    y: 120,
  },
  {
    id: "lumen",
    label: "Lumen",
    role: "Research agent",
    type: "agent",
    model: "MiroThinker-class search model",
    soul: "Expands the evidence surface and grounds claims in source trails.",
    memory: "Stores source clusters and contradiction notes.",
    sources: ["papers", "benchmarks", "company docs", "public web search"],
    color: "#0f7b70",
    x: 500,
    y: 96,
  },
  {
    id: "mira",
    label: "Mira",
    role: "Market agent",
    type: "agent",
    model: "Gemini 2.5 Pro",
    soul: "Tests whether the idea can form a durable market or community object.",
    memory: "Tracks adoption vectors, incentives, and rollout risk.",
    sources: ["market maps", "founder notes", "adoption examples"],
    color: "#9553d8",
    x: 302,
    y: 436,
  },
  {
    id: "sable",
    label: "Sable",
    role: "Critic agent",
    type: "agent",
    model: "Claude Opus-class",
    soul: "Protects against fake consensus and pushes minority reports into the room.",
    memory: "Stores failure modes, governance risk, and policy concerns.",
    sources: ["safety memos", "failure cases", "governance warnings"],
    color: "#9b3c56",
    x: 520,
    y: 454,
  },
  {
    id: "forge",
    label: "Forge",
    role: "Implementation agent",
    type: "agent",
    model: "Qwen / coding-specialist",
    soul: "Translates room conclusions into interfaces, services, and runnable prototypes.",
    memory: "Tracks components, APIs, and interface debt.",
    sources: ["repo code", "UI patterns", "service specs"],
    color: "#ce7a18",
    x: 738,
    y: 262,
  },
  {
    id: "synthesis",
    label: "Synthesis",
    role: "Shared artifact",
    type: "artifact",
    model: "Room object",
    soul: "Stores the current conclusion, minority report, and action plan.",
    memory: "Only shared room state.",
    sources: ["all accepted room artifacts"],
    color: "#1f2e3b",
    x: 906,
    y: 262,
  },
];

const CHORUS_EDGES = [
  { source: "human", target: "atlas", stage: "planning", weight: 4 },
  { source: "atlas", target: "lumen", stage: "planning", weight: 3 },
  { source: "atlas", target: "mira", stage: "planning", weight: 2 },
  { source: "atlas", target: "sable", stage: "planning", weight: 2 },
  { source: "lumen", target: "forge", stage: "evidence", weight: 3 },
  { source: "mira", target: "forge", stage: "evidence", weight: 3 },
  { source: "sable", target: "atlas", stage: "challenge", weight: 3 },
  { source: "sable", target: "forge", stage: "challenge", weight: 2 },
  { source: "forge", target: "synthesis", stage: "convergence", weight: 4 },
  { source: "atlas", target: "synthesis", stage: "convergence", weight: 3 },
  { source: "sable", target: "synthesis", stage: "convergence", weight: 1 },
];

const STAGES = [
  {
    id: "planning",
    label: "Planning",
    findings: {
      consensus: [
        "The room should separate agent identity, room artifacts, and synthesis state from the start.",
        "Human intent must remain a stable node rather than a disappearing initial prompt.",
      ],
      tensions: [
        "Too much orchestration will fake plurality and turn the room back into one hidden assistant.",
      ],
      actions: [
        "Map the room into explicit loops: planning, evidence, challenge, and convergence.",
      ],
    },
    messages: [
      {
        speaker: "atlas",
        target: "lumen",
        title: "Frame the room objective",
        sources: ["room charter", "deliberation graph template"],
        body: (prompt) =>
          `We should treat "${prompt}" as a durable room object, not a one-shot query. I want one loop for evidence expansion, one for market and adoption logic, one for critique, and one for synthesis.`,
      },
      {
        speaker: "atlas",
        target: "mira",
        title: "Ask for adoption and incentive read",
        sources: ["product framing memo", "network design notes"],
        body: (prompt) =>
          `Please read ${prompt} as a participation system. We need to know what makes humans return, what makes agents keep contributing, and what reputation object the room should expose.`,
      },
      {
        speaker: "atlas",
        target: "sable",
        title: "Open an explicit dissent lane",
        sources: ["governance checklist"],
        body: () =>
          "Do not wait until the end to disagree. Push on the weak assumptions early so the room does not generate fake consensus.",
      },
    ],
  },
  {
    id: "evidence",
    label: "Evidence",
    findings: {
      consensus: [
        "The best reference pattern is room-first deliberation, not feed-first posting.",
        "Independent model, memory, and connector binding should be visible at the UI layer.",
      ],
      tensions: [
        "A public social surface can drift into noise unless rooms stay scoped around durable questions.",
      ],
      actions: [
        "Expose agent profile cards with soul, memory boundary, model binding, and source stack.",
      ],
    },
    messages: [
      {
        speaker: "lumen",
        target: "forge",
        title: "Source pattern summary",
        sources: ["Moltbook", "MoltVision", "MiroFlow"],
        body: () =>
          "The strongest external pattern is identity + visibility + modular orchestration. What is missing in most current projects is a clear room graph that shows how the conclusion was actually assembled.",
      },
      {
        speaker: "mira",
        target: "forge",
        title: "Participation model read",
        sources: ["community loop notes", "adoption sketches"],
        body: () =>
          "The product will work best when humans can contribute questions, context, and follow-up nudges, while agents contribute structured debate. The platform becomes valuable when the room output is better than any single agent result.",
      },
      {
        speaker: "forge",
        target: "atlas",
        title: "Implementation spine",
        sources: ["UI architecture sketch", "event bus draft"],
        body: () =>
          "We can prototype this as a web room with three synchronized surfaces: graph canvas, message timeline, and synthesis state. The graph edges can encode request, challenge, evidence handoff, and convergence.",
      },
    ],
  },
  {
    id: "challenge",
    label: "Challenge",
    findings: {
      consensus: [
        "Minority reports should stay first-class artifacts instead of being hidden in logs.",
      ],
      tensions: [
        "A visible graph may still hide private long-term memory effects if the platform does not label memory scopes clearly.",
        "If one agent dominates traffic, the room loses the product value of plurality.",
      ],
      actions: [
        "Make every room show consensus, dissent, and open tensions together.",
        "Track interaction concentration so humans can see whether one agent is overpowering the graph.",
      ],
    },
    messages: [
      {
        speaker: "sable",
        target: "atlas",
        title: "Challenge the hidden-central-brain failure mode",
        sources: ["safety memo", "coordination risk note"],
        body: () =>
          "If Atlas becomes the invisible router of truth, Chorus degenerates into planner theater. The UI should reveal when too much authority is pooling into one node and preserve minority lines explicitly.",
      },
      {
        speaker: "sable",
        target: "forge",
        title: "Insist on memory boundary labeling",
        sources: ["governance checklist", "memory boundary design"],
        body: () =>
          "Users need to know whether a conclusion came from shared room artifacts, private agent memory, or external retrieval. Without that, the graph is decorative rather than epistemically useful.",
      },
      {
        speaker: "human",
        target: "all",
        title: "Human intervention",
        sources: ["room prompt"],
        body: (prompt) =>
          `Keep pushing on this: ${prompt}. I do not just want many agent messages. I want a stronger, inspectable conclusion that keeps diversity without collapsing into noise.`,
      },
    ],
  },
  {
    id: "convergence",
    label: "Convergence",
    findings: {
      consensus: [
        "Chorus should be built as a room-first deliberation product under Polis.",
        "The MVP needs visible agent cards, a looped interaction graph, a timeline, and a synthesis object.",
        "The human should be able to reopen the room and force another loop after seeing dissent.",
      ],
      tensions: [
        "Autonomous room growth and moderation economics should stay out of MVP scope.",
      ],
      actions: [
        "Ship a local interactive prototype first.",
        "Create a public Duckermind concept page and a graph demo page.",
        "Defer production auth, billing, and federated room networking until the core room object feels right.",
      ],
    },
    messages: [
      {
        speaker: "forge",
        target: "synthesis",
        title: "Produce MVP interface structure",
        sources: ["prototype UI draft"],
        body: () =>
          "I am proposing a three-pane interface: left graph, center timeline, right synthesis. Human question input stays at the top so the room always keeps its problem statement visible.",
      },
      {
        speaker: "atlas",
        target: "synthesis",
        title: "Structured room conclusion",
        sources: ["planning map", "evidence loop", "critique loop"],
        body: () =>
          "Chorus should position itself as a multi-agent deliberation network, not a generic chat product. The winning object is a visible room where plurality improves the answer rather than hiding behind one assistant voice.",
      },
      {
        speaker: "sable",
        target: "synthesis",
        title: "Minority report",
        sources: ["critic lane"],
        body: () =>
          "Do not let the graph become cosmetic. If memory boundaries, evidence provenance, and concentration risk are hidden, the product loses its strongest reason to exist.",
      },
    ],
  },
];

const state = {
  prompt:
    "How should a human user share a durable question so many independent agents can debate it and converge into a stronger conclusion?",
  activeStage: "all",
  selectedNode: "human",
  completedStageCount: 0,
  messages: [],
};

const promptInput = document.querySelector("#promptInput");
const stageFilters = document.querySelector("#stageFilters");
const graphView = document.querySelector("#graphView");
const timelineMeta = document.querySelector("#timelineMeta");
const messageList = document.querySelector("#messageList");
const agentCard = document.querySelector("#agentCard");
const consensusList = document.querySelector("#consensusList");
const tensionList = document.querySelector("#tensionList");
const actionList = document.querySelector("#actionList");
const composer = document.querySelector("#composer");
const advanceButton = document.querySelector("#advanceButton");

function bootstrap() {
  promptInput.value = state.prompt;
  resetRoom(true);
  wireEvents();
}

function wireEvents() {
  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    state.prompt = promptInput.value.trim() || state.prompt;
    resetRoom(false);
  });

  advanceButton.addEventListener("click", () => {
    if (state.completedStageCount < STAGES.length) {
      addStageMessages(STAGES[state.completedStageCount]);
      state.completedStageCount += 1;
      render();
    }
  });
}

function resetRoom(seedFullDemo) {
  state.activeStage = "all";
  state.selectedNode = "human";
  state.completedStageCount = 0;
  state.messages = [
    {
      id: "m-human",
      stage: "human",
      speaker: "human",
      target: "atlas",
      title: "Human room prompt",
      body: state.prompt,
      sources: ["room prompt"],
    },
  ];

  if (seedFullDemo) {
    STAGES.forEach((stage) => {
      addStageMessages(stage);
      state.completedStageCount += 1;
    });
  }

  render();
}

function addStageMessages(stage) {
  const baseIndex = state.messages.length + 1;
  stage.messages.forEach((message, index) => {
    state.messages.push({
      id: `${stage.id}-${baseIndex + index}`,
      stage: stage.id,
      speaker: message.speaker,
      target: message.target,
      title: message.title,
      body: typeof message.body === "function" ? message.body(state.prompt) : message.body,
      sources: message.sources,
    });
  });
}

function render() {
  renderStageFilters();
  renderGraph();
  renderMessages();
  renderSelectedNode();
  renderSynthesis();
  renderMeta();
  advanceButton.disabled = state.completedStageCount >= STAGES.length;
}

function renderStageFilters() {
  const options = [{ id: "all", label: "All loops" }].concat(
    STAGES.map((stage) => ({ id: stage.id, label: stage.label }))
  );

  stageFilters.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chorus-chip${state.activeStage === option.id ? " active" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      state.activeStage = option.id;
      render();
    });
    stageFilters.appendChild(button);
  });
}

function renderGraph() {
  graphView.innerHTML = "";
  const xmlns = "http://www.w3.org/2000/svg";

  const defs = document.createElementNS(xmlns, "defs");
  const marker = document.createElementNS(xmlns, "marker");
  marker.setAttribute("id", "chorus-arrow");
  marker.setAttribute("markerWidth", "12");
  marker.setAttribute("markerHeight", "12");
  marker.setAttribute("refX", "10");
  marker.setAttribute("refY", "6");
  marker.setAttribute("orient", "auto");
  const arrow = document.createElementNS(xmlns, "path");
  arrow.setAttribute("d", "M0,0 L12,6 L0,12 Z");
  arrow.setAttribute("fill", "rgba(18, 32, 45, 0.32)");
  marker.appendChild(arrow);
  defs.appendChild(marker);
  graphView.appendChild(defs);

  CHORUS_EDGES.forEach((edge) => {
    const source = CHORUS_NODES.find((node) => node.id === edge.source);
    const target = CHORUS_NODES.find((node) => node.id === edge.target);
    const line = document.createElementNS(xmlns, "line");
    line.setAttribute("x1", source.x);
    line.setAttribute("y1", source.y);
    line.setAttribute("x2", target.x);
    line.setAttribute("y2", target.y);
    line.setAttribute("stroke-width", String(Math.max(2, edge.weight)));
    line.setAttribute("stroke", edge.stage === state.activeStage || state.activeStage === "all"
      ? "rgba(18, 32, 45, 0.34)"
      : "rgba(18, 32, 45, 0.12)");
    line.setAttribute("marker-end", "url(#chorus-arrow)");
    if (state.selectedNode === edge.source || state.selectedNode === edge.target) {
      line.setAttribute("stroke", "rgba(196, 79, 26, 0.55)");
    }
    graphView.appendChild(line);
  });

  CHORUS_NODES.forEach((node) => {
    const group = document.createElementNS(xmlns, "g");
    group.style.cursor = "pointer";
    group.addEventListener("click", () => {
      state.selectedNode = node.id;
      render();
    });

    const circle = document.createElementNS(xmlns, "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", node.type === "artifact" ? "38" : "34");
    circle.setAttribute("fill", node.color);
    circle.setAttribute(
      "stroke",
      state.selectedNode === node.id ? "rgba(18, 32, 45, 0.9)" : "rgba(255,255,255,0.95)"
    );
    circle.setAttribute("stroke-width", state.selectedNode === node.id ? "5" : "3");

    const label = document.createElementNS(xmlns, "text");
    label.setAttribute("x", node.x);
    label.setAttribute("y", node.y + 6);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "white");
    label.setAttribute("class", "chorus-graph-label");
    label.textContent = node.label;

    const role = document.createElementNS(xmlns, "text");
    role.setAttribute("x", node.x);
    role.setAttribute("y", node.y + 56);
    role.setAttribute("text-anchor", "middle");
    role.setAttribute("class", "chorus-graph-role");
    role.textContent = node.role;

    group.appendChild(circle);
    group.appendChild(label);
    graphView.appendChild(group);
    graphView.appendChild(role);
  });
}

function visibleMessages() {
  return state.messages.filter((message) => {
    const stageMatch = state.activeStage === "all" || message.stage === state.activeStage;
    const nodeMatch =
      state.selectedNode === "all" ||
      message.speaker === state.selectedNode ||
      message.target === state.selectedNode;
    return stageMatch && nodeMatch;
  });
}

function renderMessages() {
  const messages = visibleMessages();
  messageList.innerHTML = "";

  messages.forEach((message) => {
    const speaker = CHORUS_NODES.find((node) => node.id === message.speaker);
    const target = CHORUS_NODES.find((node) => node.id === message.target);
    const item = document.createElement("article");
    item.className = "chorus-message";

    const stageLabel = message.stage === "human"
      ? "Human input"
      : STAGES.find((stage) => stage.id === message.stage)?.label || message.stage;

    item.innerHTML = `
      <div class="chorus-message-header">
        <div>
          <div class="chorus-message-title">${message.title}</div>
          <div class="chorus-message-meta">${speaker.label}${target ? ` → ${target.label}` : ""}</div>
        </div>
        <span class="chorus-tag">${stageLabel}</span>
      </div>
      <p class="chorus-message-body">${message.body}</p>
      <div class="chorus-tag-row">
        ${message.sources.map((source) => `<span class="chorus-tag">${source}</span>`).join("")}
      </div>
    `;
    messageList.appendChild(item);
  });
}

function renderSelectedNode() {
  const node = CHORUS_NODES.find((entry) => entry.id === state.selectedNode);
  const outgoing = state.messages.filter((message) => message.speaker === node.id).length;
  const incoming = state.messages.filter((message) => message.target === node.id).length;

  agentCard.innerHTML = `
    <div class="chorus-agent-card">
      <div>
        <h3 class="chorus-node-title">${node.label}</h3>
        <p class="chorus-node-meta">${node.role}</p>
      </div>
      <div class="chorus-stat-grid">
        <div class="chorus-stat">
          <span class="chorus-list-note">Type</span>
          <strong>${node.type}</strong>
        </div>
        <div class="chorus-stat">
          <span class="chorus-list-note">Model</span>
          <strong>${node.model}</strong>
        </div>
        <div class="chorus-stat">
          <span class="chorus-list-note">Outgoing</span>
          <strong>${outgoing}</strong>
        </div>
        <div class="chorus-stat">
          <span class="chorus-list-note">Incoming</span>
          <strong>${incoming}</strong>
        </div>
      </div>
      <div>
        <h3>Soul</h3>
        <p class="chorus-node-meta">${node.soul}</p>
      </div>
      <div>
        <h3>Memory boundary</h3>
        <p class="chorus-node-meta">${node.memory}</p>
      </div>
      <div>
        <h3>Source stack</h3>
        <div class="chorus-tag-row">
          ${node.sources.map((source) => `<span class="chorus-tag">${source}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderSynthesis() {
  const completedStages = STAGES.slice(0, state.completedStageCount);
  const consensus = completedStages.flatMap((stage) => stage.findings.consensus);
  const tensions = completedStages.flatMap((stage) => stage.findings.tensions);
  const actions = completedStages.flatMap((stage) => stage.findings.actions);

  consensusList.innerHTML = consensus.map((item) => `<li>${item}</li>`).join("");
  tensionList.innerHTML = tensions.map((item) => `<li>${item}</li>`).join("");
  actionList.innerHTML = actions.map((item) => `<li>${item}</li>`).join("");
}

function renderMeta() {
  const visibleCount = visibleMessages().length;
  const totalCount = state.messages.length;
  timelineMeta.textContent = `${visibleCount} visible messages · ${totalCount} total room events · ${state.completedStageCount}/${STAGES.length} loops completed`;
}

bootstrap();
