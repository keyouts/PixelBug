// Node editor
(() => {
  const TYPES = {
    eventStart: "When Game Starts",
    eventTrigger: "When Player Touches",
    actionMessage: "Show Text",
    actionDialogue: "Start Dialogue",
    actionCheckpoint: "Save Checkpoint",
    actionSetVariable: "Remember Value",
    actionChangeNumber: "Change Number",
    actionMoveActor: "Move Player",
    logicVariable: "If Value Matches",
    logicCompareNumber: "Compare Number",
    actionFinish: "Finish Game"
  };
  const CONCEPTS = {
    eventStart: { key: "event", label: "Start", statement: "WHEN the game starts", explanation: "Runs once when the game starts." },
    eventTrigger: { key: "event", label: "Touch", statement: "WHEN the player touches an object", explanation: "Runs when the player touches the chosen object." },
    actionMessage: { key: "output", label: "Text", statement: "SHOW text", explanation: "Shows a message to the player." },
    actionDialogue: { key: "output", label: "Dialogue", statement: "START dialogue", explanation: "Starts the chosen dialogue lines." },
    actionCheckpoint: { key: "state", label: "Checkpoint", statement: "SAVE the player position", explanation: "Saves where the player is standing. Reset returns here." },
    actionSetVariable: { key: "state", label: "Saved Value", statement: "SET a name = a value", explanation: "Saves a named value, such as key = found." },
    actionChangeNumber: { key: "state", label: "Number", statement: "ADD an amount to a number", explanation: "Adds to or subtracts from a saved number." },
    actionMoveActor: { key: "action", label: "Move", statement: "MOVE the player by (x, y)", explanation: "Moves the player by the amount you enter." },
    logicVariable: { key: "decision", label: "Check", statement: "IF a saved value matches", explanation: "Then runs when the value matches. Else runs when it does not." },
    logicCompareNumber: { key: "decision", label: "Number Check", statement: "IF a number passes the check", explanation: "Then runs when the number passes the check. Else runs when it does not." },
    actionFinish: { key: "outcome", label: "Finish", statement: "END the game", explanation: "Stops the game and shows the final message." }
  };
  const EVENT_TYPES = new Set(["eventStart", "eventTrigger"]);
  const DECISION_TYPES = new Set(["logicVariable", "logicCompareNumber"]);

  function supportsNext(type) {
    return type !== "actionFinish";
  }

  function supportsAlt(type) {
    return DECISION_TYPES.has(type);
  }
  const NODE_GROUPS = [
    { label: "Start Rules", hint: "What starts the rule?", items: [
      { type: "eventStart", name: "When Game Starts", detail: "Runs once when you press Run." },
      { type: "eventTrigger", name: "When Player Touches", detail: "Runs when the player touches a chosen object." }
    ] },
    { label: "Things the Game Does", hint: "What should happen?", items: [
      { type: "actionMessage", name: "Show Text", detail: "Show a short message in the game." },
      { type: "actionDialogue", name: "Start Dialogue", detail: "Start a saved set of dialogue lines." },
      { type: "actionMoveActor", name: "Move Player", detail: "Move the player left, right, up, or down." }
    ] },
    { label: "Saved Values", hint: "What should the game remember?", items: [
      { type: "actionSetVariable", name: "Remember Value", detail: "Save a value such as key = found." },
      { type: "actionChangeNumber", name: "Change Number", detail: "Add to or subtract from a saved number." },
      { type: "actionCheckpoint", name: "Save Checkpoint", detail: "Choose where Reset returns the player." }
    ] },
    { label: "Checks", hint: "Should Then or Else run?", items: [
      { type: "logicVariable", name: "If Value Matches", detail: "Then runs when it matches. Else runs when it does not." },
      { type: "logicCompareNumber", name: "Compare Number", detail: "Check a number with =, ≠, <, ≤, >, or ≥." }
    ] },
    { label: "Finish", hint: "How should the game end?", items: [
      { type: "actionFinish", name: "Finish Game", detail: "Stop the game and show a final message." }
    ] }
  ];
  const LESSONS = [
    { id: "sequence", title: "1. First Sequence", concept: "Order", detail: "Start the game, show text, then save a checkpoint." },
    { id: "touch-win", title: "2. Touch to Win", concept: "Touch", detail: "Touch an object, show a message, and finish the game." },
    { id: "switch-door", title: "3. Switch and Door", concept: "Saved Values", detail: "Save whether a door is open, then check it." },
    { id: "count-three", title: "4. Count to Three", concept: "Counting", detail: "Add one for each touch and check when the total reaches 3." }
  ];
  const NODE_WIDTH = 224;
  const NODE_HEIGHT = 128;
  const NODE_GAP_X = 316;
  const NODE_GAP_Y = 154;
  const MESSAGE_STEP_DELAY = 1100;
  let api = null;
  let selectedId = "";
  let drag = null;
  let connection = null;
  let overlayOpen = false;
  let inlineContext = null;
  let overlayContext = null;
  let lastEntered = new Set();
  let activeIds = new Map();
  let activeLinks = new Map();
  let runtimeLog = [];
  let runtimeState = { currentId: "", currentLabel: "None", lastTrigger: "None", actions: [], nextIds: [], testRoot: "" };
  let highlightedId = "";
  let settlingId = "";

  function makeId(prefix = "node") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function text(value, fallback = "") {
    return String(value ?? fallback).replace(/\s+/g, " ").trim();
  }

  function number(value, fallback, min, max) {
    const next = Number(value);
    return Number.isFinite(next) ? Math.max(min, Math.min(next, max)) : fallback;
  }

  function escape(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function logRuntime(message) {
    const stamped = `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })} ${String(message || "")}`;
    runtimeLog.unshift(stamped);
    runtimeLog = runtimeLog.slice(0, 8);
    renderRuntime(inlineContext);
    if (overlayOpen) renderRuntime(overlayContext);
  }

  function pulseNode(id) {
    activeIds.set(String(id || ""), performance.now() + 900);
    renderNodes(inlineContext);
    if (overlayOpen) renderNodes(overlayContext);
    window.setTimeout(() => { renderNodes(inlineContext); if (overlayOpen) renderNodes(overlayContext); }, 950);
  }

  function isActive(id) {
    const until = activeIds.get(String(id || ""));
    if (!until) return false;
    if (performance.now() > until) { activeIds.delete(String(id || "")); return false; }
    return true;
  }

  function linkKey(sourceId, targetId) {
    return `${String(sourceId || "")}→${String(targetId || "")}`;
  }

  function pulseLink(sourceId, targetId) {
    if (!sourceId || !targetId) return;
    activeLinks.set(linkKey(sourceId, targetId), performance.now() + 950);
    drawLinks(inlineContext);
    if (overlayOpen) drawLinks(overlayContext);
    window.setTimeout(() => { drawLinks(inlineContext); if (overlayOpen) drawLinks(overlayContext); }, 980);
  }

  function isLinkActive(sourceId, targetId) {
    const key = linkKey(sourceId, targetId);
    const until = activeLinks.get(key);
    if (!until) return false;
    if (performance.now() > until) { activeLinks.delete(key); return false; }
    return true;
  }

  function setRuntimeState(next = {}) {
    runtimeState = { ...runtimeState, ...next };
    renderRuntime(inlineContext);
    if (overlayOpen) renderRuntime(overlayContext);
  }

  function resetRuntimeState() {
    runtimeState = { currentId: "", currentLabel: "None", lastTrigger: "None", actions: [], nextIds: [], testRoot: "" };
  }


  function defaultGraph() {
    const start = makeId("start");
    const message = makeId("message");
    const checkpoint = makeId("checkpoint");
    return {
      selectedId: start,
      runtime: { variables: {}, checkpoint: null },
      nodes: [
        { id: start, type: "eventStart", name: "Game Begins", x: 40, y: 44, next: message, alt: "", data: {} },
        { id: message, type: "actionMessage", name: "Welcome Player", x: 356, y: 44, next: checkpoint, alt: "", data: { message: "Welcome! This sequence runs from left to right." } },
        { id: checkpoint, type: "actionCheckpoint", name: "Starting Checkpoint", x: 672, y: 44, next: "", alt: "", data: {} }
      ]
    };
  }

  function defaultDataForType(type) {
    if (type === "actionChangeNumber") return { variable: "score", amount: 1 };
    if (type === "logicCompareNumber") return { variable: "score", operator: ">=", compare: 3 };
    return {};
  }

  function normalizeData(data = {}) {
    return {
      trigger: text(data.trigger || "any").slice(0, 32) || "any",
      message: String(data.message || "Message shown.").slice(0, 180),
      textLine: Number.isFinite(Number(data.textLine)) ? Math.max(-1, Number(data.textLine)) : -1,
      line: Math.max(0, Number(data.line) || 0),
      variable: text(data.variable || "flag").slice(0, 32) || "flag",
      value: text(data.value || "true").slice(0, 48) || "true",
      equals: text(data.equals || "true").slice(0, 48) || "true",
      amount: number(data.amount, 1, -1000, 1000),
      operator: ["=", "!=", "<", "<=", ">", ">="].includes(String(data.operator)) ? String(data.operator) : ">=",
      compare: number(data.compare, 1, -1000000, 1000000),
      dx: number(data.dx, 24, -1000, 1000),
      dy: number(data.dy, 0, -1000, 1000)
    };
  }

  function normalizeNode(node, index) {
    const type = TYPES[node?.type] ? node.type : "actionMessage";
    node.id = String(node?.id || makeId()).slice(0, 80);
    node.type = type;
    node.name = text(node?.name, TYPES[type]).slice(0, 48) || TYPES[type];
    node.x = number(node?.x, 40 + index * 42, 0, 2200);
    node.y = number(node?.y, 44 + index * 28, 0, 1400);
    node.next = supportsNext(type) ? String(node?.next || "").slice(0, 80) : "";
    node.alt = supportsAlt(type) ? String(node?.alt || "").slice(0, 80) : "";
    node.data = normalizeData(node?.data || {});
    return node;
  }

  function graph() {
    const state = api.getState();
    if (!state.playMode || typeof state.playMode !== "object") state.playMode = {};
    if (!state.playMode.nodeEditor || typeof state.playMode.nodeEditor !== "object") state.playMode.nodeEditor = defaultGraph();
    const data = state.playMode.nodeEditor;
    if (!Array.isArray(data.nodes) || !data.nodes.length) data.nodes = defaultGraph().nodes;
    data.nodes = data.nodes.slice(0, 100);
    data.nodes.forEach(normalizeNode);
    data.runtime = data.runtime && typeof data.runtime === "object" ? data.runtime : {};
    data.runtime.variables = data.runtime.variables && typeof data.runtime.variables === "object" ? data.runtime.variables : {};
    const ids = new Set(data.nodes.map(node => node.id));
    data.nodes.forEach(node => {
      if (!ids.has(node.next) || node.next === node.id) node.next = "";
      if (!ids.has(node.alt) || node.alt === node.id) node.alt = "";
    });
    if (!ids.has(data.selectedId)) data.selectedId = data.nodes[0]?.id || "";
    selectedId = selectedId && ids.has(selectedId) ? selectedId : data.selectedId;
    return data;
  }

  function selectedNode() {
    const data = graph();
    return data.nodes.find(node => node.id === selectedId) || data.nodes[0] || null;
  }

  function label(node) {
    return `${TYPES[node.type] || "Rule"}: ${node.name || "Untitled"}`;
  }

  function snippet(value, fallback = "") {
    const copy = text(value, fallback);
    return copy.length > 56 ? `${copy.slice(0, 53)}...` : copy;
  }

  function textEventLabel(index, fallback = "Text Event") {
    const options = api?.getTextEventOptions?.() || [];
    const match = options.find(option => Number(option.index) === Number(index));
    return match?.label || `${fallback} ${Number(index) + 1}`;
  }

  function conceptFor(node) {
    return CONCEPTS[node?.type] || { key: "action", label: "Rule", statement: "RUN a rule", explanation: "Runs when another rule connects to it." };
  }

  function nodeStatement(node) {
    if (!node) return "Choose a rule";
    if (node.type === "eventStart") return "WHEN game starts";
    if (node.type === "eventTrigger") return `WHEN player touches ${node.data.trigger === "any" ? "an object" : node.data.trigger}`;
    if (node.type === "actionMessage") return Number(node.data.textLine) >= 0 ? `SHOW ${textEventLabel(node.data.textLine)}` : `SHOW “${snippet(node.data.message, "Message shown.") }”`;
    if (node.type === "actionDialogue") return `START ${textEventLabel(node.data.line)}`;
    if (node.type === "actionCheckpoint") return "SAVE player position";
    if (node.type === "actionSetVariable") return `SET ${node.data.variable || "flag"} = ${node.data.value || "true"}`;
    if (node.type === "actionChangeNumber") return `ADD ${Number(node.data.amount) || 0} TO ${node.data.variable || "score"}`;
    if (node.type === "logicVariable") return `IF ${node.data.variable || "flag"} = ${node.data.equals || "true"}`;
    if (node.type === "logicCompareNumber") return `IF ${node.data.variable || "score"} ${node.data.operator || ">="} ${Number(node.data.compare) || 0}`;
    if (node.type === "actionMoveActor") return `MOVE player by (${Number(node.data.dx) || 0}, ${Number(node.data.dy) || 0})`;
    if (node.type === "actionFinish") return "END game";
    return conceptFor(node).statement;
  }

  function nodeDetail(node) {
    if (!node) return "Choose a rule to see what it does.";
    if (node.type === "eventStart") return "Runs once when the game starts.";
    if (node.type === "eventTrigger") return node.data.trigger === "any" ? "Runs when the player touches any object." : `Runs when the player touches ${node.data.trigger}.`;
    if (node.type === "actionMessage") return Number(node.data.textLine) >= 0 ? `Shows ${textEventLabel(node.data.textLine)} to the player.` : `Shows: ${snippet(node.data.message, "Message shown.")}`;
    if (node.type === "actionDialogue") return `Starts the dialogue at ${textEventLabel(node.data.line)} and follows its saved path.`;
    if (node.type === "actionCheckpoint") return "Saves the player position so Reset can return here.";
    if (node.type === "actionSetVariable") return `Saves ${node.data.variable || "flag"} as ${node.data.value || "true"}.`;
    if (node.type === "actionChangeNumber") return `Adds ${Number(node.data.amount) || 0} to ${node.data.variable || "score"}.`;
    if (node.type === "logicVariable") return `Then runs when ${node.data.variable || "flag"} equals ${node.data.equals || "true"}. Otherwise Else runs.`;
    if (node.type === "logicCompareNumber") return `Then runs when ${node.data.variable || "score"} ${node.data.operator || ">="} ${Number(node.data.compare) || 0}. Otherwise Else runs.`;
    if (node.type === "actionMoveActor") return `Moves the player by X ${Number(node.data.dx) || 0} and Y ${Number(node.data.dy) || 0}.`;
    if (node.type === "actionFinish") return "Stops the game and shows the finish message.";
    return "Runs when another rule connects to it.";
  }

  function nodeEffect(node) {
    return conceptFor(node).label;
  }

  function routeLabels(ids = [], nodes = graph().nodes) {
    const byId = new Map(nodes.map(node => [node.id, node]));
    return ids.map(id => byId.get(id)).filter(Boolean).map(node => `${TYPES[node.type] || "Rule"}: ${node.name || "Untitled"}`);
  }

  function computeGraphIssues(data = graph()) {
    const nodes = data.nodes || [];
    const byId = new Map(nodes.map(node => [node.id, node]));
    const incoming = new Map(nodes.map(node => [node.id, 0]));
    nodes.forEach(node => nodeTargets(node).forEach(targetId => incoming.set(targetId, (incoming.get(targetId) || 0) + 1)));
    const roots = nodes.filter(node => EVENT_TYPES.has(node.type));
    const reachable = new Set();
    const queue = roots.map(node => node.id);
    while (queue.length) {
      const id = queue.shift();
      if (reachable.has(id)) continue;
      reachable.add(id);
      const node = byId.get(id);
      nodeTargets(node).forEach(targetId => { if (!reachable.has(targetId)) queue.push(targetId); });
    }
    const issues = [];
    const triggerOptions = new Set(["any", ...(api?.getNodeTriggerOptions?.() || []).map(option => String(option.id || ""))]);
    const textOptions = api?.getTextEventOptions?.() || [];
    const setters = new Set(nodes.filter(node => node.type === "actionSetVariable" || node.type === "actionChangeNumber").map(node => String(node.data.variable || "flag")));
    nodes.forEach(node => {
      if (EVENT_TYPES.has(node.type) && !node.next) issues.push({ id: node.id, text: `${node.name} does not connect to another rule.` });
      if (!EVENT_TYPES.has(node.type) && !reachable.has(node.id)) issues.push({ id: node.id, text: `${node.name} is not connected to a start rule.` });
      if (!EVENT_TYPES.has(node.type) && !incoming.get(node.id) && roots.length) issues.push({ id: node.id, text: `${node.name} is not connected from another rule.` });
      if (node.type === "eventTrigger" && node.data.trigger !== "any" && !triggerOptions.has(String(node.data.trigger || ""))) issues.push({ id: node.id, text: `${node.name} uses an object that is no longer in the scene.` });
      if (node.type === "actionMessage" && Number(node.data.textLine) >= 0 && !textOptions.some(option => Number(option.index) === Number(node.data.textLine))) issues.push({ id: node.id, text: `${node.name} uses saved text that no longer exists.` });
      if (node.type === "actionDialogue" && !textOptions.some(option => Number(option.index) === Number(node.data.line))) issues.push({ id: node.id, text: `${node.name} starts with dialogue that no longer exists.` });
      if (DECISION_TYPES.has(node.type)) {
        if (!node.next) issues.push({ id: node.id, text: `${node.name} does not have a Then connection.` });
        if (!node.alt) issues.push({ id: node.id, text: `${node.name} does not have an Else connection.` });
        if (!setters.has(String(node.data.variable || "flag"))) issues.push({ id: node.id, text: `${node.name} checks ${node.data.variable || "flag"}, but no rule saves or changes it.` });
      }
    });
    if (!roots.length) issues.push({ id: "", text: "Add a start rule so the game knows where to begin." });
    return issues;
  }

  function issuesByNode(data = graph()) {
    const map = new Map();
    computeGraphIssues(data).forEach(issue => {
      const list = map.get(issue.id) || [];
      list.push(issue.text);
      map.set(issue.id, list);
    });
    return map;
  }

  function routeSummary(node, nodes = graph().nodes) {
    if (!node) return "No rule selected.";
    const byId = new Map(nodes.map(item => [item.id, item]));
    const next = byId.get(node.next);
    const alt = byId.get(node.alt);
    const parts = [];
    if (!supportsNext(node.type)) return "Stops here.";
    parts.push(next ? `Then → ${TYPES[next.type] || "Rule"}: ${next.name}` : "Then is not connected");
    if (supportsAlt(node.type)) parts.push(alt ? `Else → ${TYPES[alt.type] || "Rule"}: ${alt.name}` : "Else is not connected");
    return parts.join(" · ");
  }

  function nodeTargets(node) {
    const targets = [];
    if (supportsNext(node?.type) && node?.next) targets.push(node.next);
    if (supportsAlt(node?.type) && node?.alt) targets.push(node.alt);
    return targets;
  }

  function wrangleGraph() {
    const data = graph();
    const roots = data.nodes.filter(node => EVENT_TYPES.has(node.type));
    const byId = new Map(data.nodes.map(node => [node.id, node]));
    const depth = new Map();
    const queue = roots.map((node, order) => ({ id: node.id, level: 0, order }));
    while (queue.length) {
      const item = queue.shift();
      const currentLevel = depth.get(item.id);
      if (currentLevel !== undefined && currentLevel <= item.level) continue;
      depth.set(item.id, item.level);
      const node = byId.get(item.id);
      nodeTargets(node).forEach((targetId, targetOrder) => queue.push({ id: targetId, level: item.level + 1, order: item.order + targetOrder }));
    }
    const orphanLevel = roots.length ? Math.max(1, ...Array.from(depth.values()), 1) + 1 : 0;
    data.nodes.forEach(node => { if (!depth.has(node.id)) depth.set(node.id, orphanLevel); });
    const rows = new Map();
    data.nodes.forEach((node, index) => {
      const level = depth.get(node.id) || 0;
      const row = rows.get(level) || [];
      row.push({ node, index });
      rows.set(level, row);
    });
    Array.from(rows.keys()).sort((a, b) => a - b).forEach(level => {
      rows.get(level).sort((a, b) => {
        if (a.node.type === "eventStart" && b.node.type !== "eventStart") return -1;
        if (b.node.type === "eventStart" && a.node.type !== "eventStart") return 1;
        if (a.node.type === "eventTrigger" && b.node.type !== "eventTrigger") return -1;
        if (b.node.type === "eventTrigger" && a.node.type !== "eventTrigger") return 1;
        return a.index - b.index;
      }).forEach((item, rowIndex) => {
        item.node.x = 44 + level * NODE_GAP_X;
        item.node.y = 44 + rowIndex * NODE_GAP_Y;
      });
    });
    selectedId = data.selectedId = selectedId || roots[0]?.id || data.nodes[0]?.id || "";
    renderAllContexts();
    api.saveLocal();
    logRuntime("Arranged the rule map without changing any rules or connections.");
    api.setStatus("Rule map arranged.");
  }

  function playTesterStateLabel() {
    const runtime = api?.getPlayRuntime?.();
    return runtime?.running ? "Tester running" : "Tester stopped";
  }

  function button(textValue, labelValue, handler) {
    const node = document.createElement("button");
    node.type = "button";
    node.innerHTML = `${textValue}<span class="sr-only">, ${labelValue}</span>`;
    node.setAttribute("aria-label", labelValue);
    node.addEventListener("click", handler);
    return node;
  }

  function actionGroup(title, controls) {
    const group = document.createElement("div");
    group.className = "node-editor-action-group";
    const heading = document.createElement("strong");
    heading.textContent = title;
    const row = document.createElement("div");
    row.className = "node-editor-action-buttons";
    row.append(...controls);
    group.append(heading, row);
    return group;
  }

  function makeSelect(id, labelText, value, nodes, fieldName) {
    const wrap = document.createElement("label");
    wrap.className = "node-editor-field";
    wrap.setAttribute("for", id);
    const heading = document.createElement("span");
    heading.textContent = labelText;
    const select = document.createElement("select");
    select.id = id;
    select.dataset.field = fieldName || labelText.toLowerCase();
    select.setAttribute("aria-label", labelText);
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "None";
    select.appendChild(none);
    nodes.forEach(node => {
      const option = document.createElement("option");
      option.value = node.id;
      option.textContent = label(node);
      select.appendChild(option);
    });
    select.value = value || "";
    wrap.append(heading, select);
    return wrap;
  }

  function triggerOptionsMarkup(current) {
    const options = [{ id: "any", label: "Any object" }, ...(api?.getNodeTriggerOptions?.() || [])];
    return options.map(option => `<option value="${escape(option.id)}"${String(current) === String(option.id) ? " selected" : ""}>${escape(option.label || option.id)}</option>`).join("");
  }

  function textEventOptionsMarkup(current, includeCustom = false) {
    const options = api?.getTextEventOptions?.() || [];
    const custom = includeCustom ? `<option value="-1"${Number(current) < 0 ? " selected" : ""}>Custom message text</option>` : "";
    return custom + options.map(option => `<option value="${option.index}"${Number(current) === Number(option.index) ? " selected" : ""}>${escape(option.label || `Line ${Number(option.index) + 1}`)}</option>`).join("");
  }

  function fieldMarkup(node, prefix) {
    if (node.type === "eventTrigger") return `<label class="node-editor-field" for="${prefix}-trigger"><span>Object to Touch</span><select id="${prefix}-trigger" data-field="trigger" aria-label="Object that starts this rule">${triggerOptionsMarkup(node.data.trigger)}</select></label><p class="control-hint">This rule starts when the player touches the chosen object.</p>`;
    if (node.type === "actionMessage") return `<label class="node-editor-field" for="${prefix}-text-line"><span>Saved Text</span><select id="${prefix}-text-line" data-field="textLine" aria-label="Saved text">${textEventOptionsMarkup(node.data.textLine, true)}</select></label><label class="node-editor-field" for="${prefix}-message"><span>Custom Text</span><textarea id="${prefix}-message" data-field="message" maxlength="180" aria-label="Custom message text"></textarea></label><p class="control-hint">Choose saved text or enter a custom message.</p>`;
    if (node.type === "actionFinish") return `<label class="node-editor-field" for="${prefix}-message"><span>Final Message</span><textarea id="${prefix}-message" data-field="message" maxlength="180" aria-label="Final game message"></textarea></label><p class="control-hint">Stops the game and shows this message.</p>`;
    if (node.type === "actionDialogue") return `<label class="node-editor-field" for="${prefix}-line"><span>First Dialogue Line</span><select id="${prefix}-line" data-field="line" aria-label="First dialogue line">${textEventOptionsMarkup(node.data.line, false)}</select></label><p class="control-hint">Dialogue starts here and follows the saved line links.</p>`;
    if (node.type === "actionSetVariable") return `<label class="node-editor-field" for="${prefix}-variable"><span>Value Name</span><input id="${prefix}-variable" data-field="variable" type="text" value="${escape(node.data.variable)}" aria-label="Saved value name" /></label><label class="node-editor-field" for="${prefix}-value"><span>Save As</span><input id="${prefix}-value" data-field="value" type="text" value="${escape(node.data.value)}" aria-label="Value to save" /></label><p class="control-hint">Give the value a name, such as doorOpen, then choose what to save.</p>`;
    if (node.type === "actionChangeNumber") return `<label class="node-editor-field" for="${prefix}-variable"><span>Number Name</span><input id="${prefix}-variable" data-field="variable" type="text" value="${escape(node.data.variable)}" aria-label="Saved number name" /></label><label class="node-editor-field" for="${prefix}-amount"><span>Amount to Add</span><input id="${prefix}-amount" data-field="amount" type="number" step="1" value="${escape(node.data.amount)}" aria-label="Amount added to the saved number" /></label><p class="control-hint">Use a positive number to count up or a negative number to count down.</p>`;
    if (node.type === "logicVariable") return `<label class="node-editor-field" for="${prefix}-variable"><span>Value Name</span><input id="${prefix}-variable" data-field="variable" type="text" value="${escape(node.data.variable)}" aria-label="Saved value name" /></label><label class="node-editor-field" for="${prefix}-equals"><span>Must Equal</span><input id="${prefix}-equals" data-field="equals" type="text" value="${escape(node.data.equals)}" aria-label="Value that makes Then run" /></label><p class="control-hint">Then runs when the values match. Else runs when they do not.</p>`;
    if (node.type === "logicCompareNumber") return `<label class="node-editor-field" for="${prefix}-variable"><span>Number Name</span><input id="${prefix}-variable" data-field="variable" type="text" value="${escape(node.data.variable)}" aria-label="Saved number name" /></label><label class="node-editor-field" for="${prefix}-operator"><span>Check</span><select id="${prefix}-operator" data-field="operator" aria-label="Number check"><option value="=">Equals</option><option value="!=">Does not equal</option><option value="<">Less than</option><option value="<=">Less than or equal</option><option value=">">Greater than</option><option value=">=">Greater than or equal</option></select></label><label class="node-editor-field" for="${prefix}-compare"><span>Check Against</span><input id="${prefix}-compare" data-field="compare" type="number" step="1" value="${escape(node.data.compare)}" aria-label="Number to check against" /></label><p class="control-hint">Then runs when the check passes. Else runs when it does not.</p>`;
    if (node.type === "actionMoveActor") return `<label class="node-editor-field" for="${prefix}-dx"><span>Move Left or Right</span><input id="${prefix}-dx" data-field="dx" type="number" step="1" value="${escape(node.data.dx)}" aria-label="Horizontal player movement" /></label><label class="node-editor-field" for="${prefix}-dy"><span>Move Up or Down</span><input id="${prefix}-dy" data-field="dy" type="number" step="1" value="${escape(node.data.dy)}" aria-label="Vertical player movement" /></label><p class="control-hint">Positive and negative numbers move the player in opposite directions.</p>`;
    return `<p class="control-hint">${escape(conceptFor(node).explanation)}</p>`;
  }

  function renderInspector(ctx) {
    if (!ctx?.inspector) return;
    const data = graph();
    const node = selectedNode();
    if (!node) {
      ctx.inspector.innerHTML = `<p class="control-hint">Choose a rule on the map to edit it.</p>`;
      return;
    }
    const prefix = `node-editor-${ctx.key}`;
    const selectedObject = api?.getSelectedNodeTriggerOption?.();
    const objectText = selectedObject ? `Selected scene object: ${escape(selectedObject.label)}` : "No scene object selected. Select one before making a touch rule.";
    const objectMarkup = node.type === "eventTrigger" ? `<p class="control-hint node-editor-object-hint">${objectText}</p>` : "";
    const linkMarkup = supportsNext(node.type) ? `<fieldset class="node-editor-fieldset"><legend>What Runs Next</legend><div class="node-editor-link-fields"></div></fieldset>` : "";
    const issueText = issuesByNode(data).get(node.id) || [];
    const concept = conceptFor(node);
    ctx.inspector.innerHTML = `<div class="node-editor-inspector-title"><div><span class="node-editor-concept-badge concept-${escape(concept.key)}">${escape(concept.label)}</span><strong>Edit This Rule</strong></div><button type="button" class="node-editor-test-from" aria-label="Test the selected rule in the game preview">Test Rule</button></div><div class="node-editor-rule-reading"><span>What this rule does</span><code>${escape(nodeStatement(node))}</code><p>${escape(concept.explanation)}</p></div>${objectMarkup}${issueText.length ? `<div class="node-editor-warning-box" role="status"><strong>Check This Rule</strong><span>${escape(issueText.join(" "))}</span></div>` : ""}<fieldset class="node-editor-fieldset"><legend>Name and Type</legend><div class="node-editor-core-fields"><label class="node-editor-field" for="${prefix}-type"><span>Rule Type</span><select id="${prefix}-type" data-field="type" aria-label="Rule type"></select></label><label class="node-editor-field" for="${prefix}-name"><span>Rule Name</span><input id="${prefix}-name" data-field="name" type="text" maxlength="48" value="${escape(node.name)}" aria-label="Rule name" /></label></div></fieldset>${linkMarkup}<fieldset class="node-editor-fieldset"><legend>Settings</legend><div id="${prefix}-fields" class="node-editor-fields">${fieldMarkup(node, prefix)}</div></fieldset>`;
    ctx.inspector.querySelector(".node-editor-test-from")?.addEventListener("click", runSelectedNode);
    const typeSelect = ctx.inspector.querySelector(`[data-field="type"]`);
    Object.entries(TYPES).forEach(([value, typeLabel]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = typeLabel;
      typeSelect.appendChild(option);
    });
    typeSelect.value = node.type;
    const linkFields = ctx.inspector.querySelector(".node-editor-link-fields");
    if (linkFields) {
      const routeTargets = data.nodes.filter(item => item.id !== node.id);
      linkFields.append(makeSelect(`${prefix}-next`, "Then", node.next, routeTargets, "next"));
      if (supportsAlt(node.type)) linkFields.append(makeSelect(`${prefix}-alt`, "Else", node.alt, routeTargets, "alt"));
    }
    const message = ctx.inspector.querySelector(`[data-field="message"]`);
    if (message) message.value = node.data.message || "";
    const textLine = ctx.inspector.querySelector(`[data-field="textLine"]`);
    if (textLine) textLine.value = String(Number.isFinite(Number(node.data.textLine)) ? Number(node.data.textLine) : -1);
    const operator = ctx.inspector.querySelector(`[data-field="operator"]`);
    if (operator) operator.value = node.data.operator || ">=";
    ctx.inspector.querySelectorAll("input, select, textarea").forEach(input => {
      input.addEventListener("input", () => applyInspector(ctx, node));
      input.addEventListener("change", () => applyInspector(ctx, node));
    });
  }

  function applyInspector(ctx, node) {
    const type = ctx.inspector.querySelector(`[data-field="type"]`)?.value || node.type;
    const oldType = node.type;
    node.type = TYPES[type] ? type : node.type;
    node.name = text(ctx.inspector.querySelector(`[data-field="name"]`)?.value, TYPES[node.type]).slice(0, 48) || TYPES[node.type];
    const nextField = ctx.inspector.querySelector(`[data-field="next"]`);
    const altField = ctx.inspector.querySelector(`[data-field="alt"]`);
    node.next = supportsNext(node.type) ? (nextField ? nextField.value : node.next || "") : "";
    node.alt = supportsAlt(node.type) ? (altField ? altField.value : node.alt || "") : "";
    node.data.trigger = text(ctx.inspector.querySelector(`[data-field="trigger"]`)?.value, node.data.trigger).slice(0, 32) || "any";
    const message = ctx.inspector.querySelector(`[data-field="message"]`);
    if (message) node.data.message = String(message.value || "").slice(0, 180);
    const textLine = ctx.inspector.querySelector(`[data-field="textLine"]`);
    if (textLine) node.data.textLine = Math.max(-1, Number(textLine.value));
    const line = ctx.inspector.querySelector(`[data-field="line"]`);
    if (line) node.data.line = Math.max(0, Number(line.value) || 0);
    node.data.variable = text(ctx.inspector.querySelector(`[data-field="variable"]`)?.value, node.data.variable).slice(0, 32) || "flag";
    node.data.value = text(ctx.inspector.querySelector(`[data-field="value"]`)?.value, node.data.value).slice(0, 48) || "true";
    node.data.equals = text(ctx.inspector.querySelector(`[data-field="equals"]`)?.value, node.data.equals).slice(0, 48) || "true";
    node.data.amount = number(ctx.inspector.querySelector(`[data-field="amount"]`)?.value, node.data.amount, -1000, 1000);
    const operator = ctx.inspector.querySelector(`[data-field="operator"]`)?.value;
    if (["=", "!=", "<", "<=", ">", ">="].includes(operator)) node.data.operator = operator;
    node.data.compare = number(ctx.inspector.querySelector(`[data-field="compare"]`)?.value, node.data.compare, -1000000, 1000000);
    node.data.dx = number(ctx.inspector.querySelector(`[data-field="dx"]`)?.value, node.data.dx, -1000, 1000);
    node.data.dy = number(ctx.inspector.querySelector(`[data-field="dy"]`)?.value, node.data.dy, -1000, 1000);
    if (oldType !== node.type) {
      renderAllContexts(false);
    } else {
      renderNodes(inlineContext);
      if (overlayOpen) renderNodes(overlayContext);
    }
    api.saveLocal();
  }

  function contextFromElement(element) {
    return element?.closest(".node-editor-large") ? overlayContext : inlineContext;
  }

  function select(id, quiet = false) {
    const data = graph();
    if (!data.nodes.some(node => node.id === id)) return;
    selectedId = id;
    data.selectedId = id;
    if (!quiet) renderAllContexts();
    api.saveLocal();
  }

  function portTitle(port) {
    return port === "alt" ? "Else" : "Then";
  }

  function startConnection(event, id, port) {
    event.preventDefault();
    event.stopPropagation();
    const ctx = contextFromElement(event.currentTarget);
    const source = graph().nodes.find(node => node.id === id);
    if (!source || !ctx) return;
    const sourceElement = event.currentTarget.closest(".node-editor-node");
    connection = { source, port, ctx, sourceElement, x: event.clientX, y: event.clientY };
    select(id, true);
    sourceElement?.classList.add("connection-source", `connection-${port}`);
    ctx.board.classList.add("connecting", "node-editor-board-live");
    ctx.board.setAttribute("aria-label", `Connecting ${portTitle(port)} from ${source.name}. Drag to another rule.`);
    setBoardMotion(ctx, 8, 0);
    document.addEventListener("pointermove", moveConnection, true);
    document.addEventListener("pointerup", endConnection, true);
    drawLinks(ctx);
  }

  function moveConnection(event) {
    if (!connection) return;
    connection.x = event.clientX;
    connection.y = event.clientY;
    const p = boardPoint(connection.ctx, event.clientX, event.clientY);
    setBoardMotion(connection.ctx, p.x - connection.source.x, p.y - connection.source.y);
    drawLinks(connection.ctx);
  }

  function endConnection(event) {
    if (!connection) return;
    const targetElement = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".node-editor-node");
    let targetId = targetElement?.dataset?.nodeId || "";
    if (!targetId) {
      const p = boardPoint(connection.ctx, event.clientX, event.clientY);
      const hit = graph().nodes.find(node => p.x >= node.x && p.x <= node.x + NODE_WIDTH && p.y >= node.y && p.y <= node.y + NODE_HEIGHT);
      targetId = hit?.id || "";
    }
    if (targetId && targetId !== connection.source.id) {
      connection.source[connection.port] = targetId;
      selectedId = connection.source.id;
      graph().selectedId = selectedId;
      api.saveLocal();
      api.setStatus(`${portTitle(connection.port)} connection created.`);
    } else {
      api.setStatus("Connection not changed. Drag a Connect button onto another rule.");
    }
    connection.sourceElement?.classList.remove("connection-source", "connection-next", "connection-alt");
    connection.ctx.board.classList.remove("connecting", "node-editor-board-live");
    connection.ctx.board.setAttribute("aria-label", connection.ctx.key === "large" ? "Large visual game rule map" : "Visual game rule map");
    clearBoardMotion(connection.ctx);
    document.removeEventListener("pointermove", moveConnection, true);
    document.removeEventListener("pointerup", endConnection, true);
    connection = null;
    renderAllContexts();
  }

  function drawLine(ctx, x1, y1, x2, y2, route = "next", active = false, running = false) {
    const line = document.createElement("div");
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.className = `node-editor-link-line route-${route} ${active ? "active-route" : ""} ${running ? "route-running" : ""}`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.setAttribute("aria-hidden", "true");
    ctx.board.appendChild(line);
  }

  function boardPoint(ctx, clientX, clientY) {
    const rect = ctx.board.getBoundingClientRect();
    return { x: clientX - rect.left + ctx.board.scrollLeft, y: clientY - rect.top + ctx.board.scrollTop };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setBoardMotion(ctx, dx = 0, dy = 0) {
    if (!ctx?.board) return;
    ctx.board.style.setProperty("--node-map-x", `${clamp(dx / 8, -18, 18)}px`);
    ctx.board.style.setProperty("--node-map-y", `${clamp(dy / 8, -18, 18)}px`);
  }

  function clearBoardMotion(ctx) {
    if (!ctx?.board) return;
    ctx.board.style.removeProperty("--node-map-x");
    ctx.board.style.removeProperty("--node-map-y");
  }

  function drawLinks(ctx) {
    if (!ctx?.board) return;
    ctx.board.querySelectorAll(".node-editor-link-line, .node-editor-link-preview").forEach(item => item.remove());
    const byId = new Map(graph().nodes.map(node => [node.id, node]));
    byId.forEach(node => {
      [[node.next, "next"], [node.alt, "alt"]].forEach(([targetId, route]) => {
        const target = byId.get(targetId);
        if (!target) return;
        const sourceY = node.y + (route === "alt" ? 66 : 42);
        drawLine(ctx, node.x + NODE_WIDTH, sourceY, target.x, target.y + 46, route, node.id === selectedId || target.id === selectedId, isLinkActive(node.id, target.id));
      });
    });
    if (connection?.ctx === ctx) {
      const p = boardPoint(ctx, connection.x, connection.y);
      const line = document.createElement("div");
      const x1 = connection.source.x + NODE_WIDTH;
      const y1 = connection.source.y + (connection.port === "alt" ? 66 : 42);
      const length = Math.hypot(p.x - x1, p.y - y1);
      const angle = Math.atan2(p.y - y1, p.x - x1) * 180 / Math.PI;
      line.className = `node-editor-link-preview route-${connection.port}`;
      line.style.left = `${x1}px`;
      line.style.top = `${y1}px`;
      line.style.width = `${length}px`;
      line.style.transform = `rotate(${angle}deg)`;
      line.setAttribute("aria-hidden", "true");
      ctx.board.appendChild(line);
    }
  }

  function renderRuntime(ctx) {
    if (!ctx?.runtime) return;
    const data = graph();
    const nextLabels = routeLabels(runtimeState.nextIds || [], data.nodes);
    const actionItems = runtimeState.actions.length ? runtimeState.actions.map(item => `<li>${escape(item)}</li>`).join("") : `<li>No rules have run yet.</li>`;
    const logItems = runtimeLog.length ? runtimeLog.map(item => `<li>${escape(item)}</li>`).join("") : `<li>Press Run, touch an object with a rule, or use Test Rule here.</li>`;
    const variableEntries = Object.entries(data.runtime?.variables || {}).slice(0, 5);
    const variableText = variableEntries.length ? variableEntries.map(([key, value]) => `${key}=${value}`).join(" · ") : "Nothing saved yet";
    ctx.runtime.innerHTML = `<div class="node-editor-section-head"><strong>Test Results</strong><span>${escape(playTesterStateLabel())}</span></div><div class="node-editor-activity-grid" aria-live="polite"><div><strong>Current Rule</strong><span>${escape(runtimeState.currentLabel || "None")}</span></div><div><strong>Started By</strong><span>${escape(runtimeState.lastTrigger || "None")}</span></div><div><strong>Up Next</strong><span>${escape(nextLabels.length ? nextLabels.join(" · ") : "Nothing queued")}</span></div><div><strong>Saved Values</strong><span>${escape(variableText)}</span></div></div><div class="node-editor-log-columns"><div><strong>Rules Run</strong><ul>${actionItems}</ul></div><div><strong>Test Log</strong><ul>${logItems}</ul></div></div><p class="sr-only">This panel updates when a rule starts, another rule runs, a saved value changes, or the next rule is chosen.</p>`;
  }

  function renderCheck(ctx) {
    if (!ctx?.check) return;
    const issues = computeGraphIssues();
    const rows = issues.slice(0, 8).map((issue, index) => `<li>${issue.id ? `<button type="button" data-node-issue="${escape(issue.id)}">Open</button>` : ""}<span>${escape(issue.text)}</span></li>`).join("");
    ctx.check.innerHTML = `<div class="node-editor-section-head"><strong>Rule Check</strong><span>${issues.length ? `${issues.length} found` : "All good"}</span></div>${issues.length ? `<ul>${rows}</ul>` : `<p class="node-editor-bind-note">No problems found. Each start rule connects to something the game can run.</p>`}<p class="sr-only">Rule check warnings point out rules that may not run in the tester or exported game.</p>`;
    ctx.check.querySelectorAll("[data-node-issue]").forEach(button => {
      button.addEventListener("click", () => {
        selectedId = button.dataset.nodeIssue || selectedId;
        graph().selectedId = selectedId;
        renderAllContexts();
        scrollNodeIntoView(ctx, selectedId);
      });
    });
  }

  function nodeCountForTrigger(triggerId) {
    const id = String(triggerId || "");
    return graph().nodes.filter(node => node.type === "eventTrigger" && String(node.data.trigger || "") === id).length;
  }

  function lessonNode(type, name, x, y, data = {}) {
    return normalizeNode({ id: makeId(type), type, name, x, y, next: "", alt: "", data }, 0);
  }

  function buildLesson(id) {
    const options = api?.getNodeTriggerOptions?.() || [];
    if (id === "sequence") {
      const start = lessonNode("eventStart", "Game Begins", 44, 54);
      const message = lessonNode("actionMessage", "Explain the Goal", 360, 54, { message: "This is a sequence: each rule runs in order from left to right." });
      const checkpoint = lessonNode("actionCheckpoint", "Remember Start", 676, 54);
      start.next = message.id;
      message.next = checkpoint.id;
      return { nodes: [start, message, checkpoint], selectedId: start.id, message: "First Sequence loaded. Press Test Start to watch the order." };
    }
    if (id === "touch-win") {
      const triggerId = options[0]?.id || "any";
      const start = lessonNode("eventStart", "Give the Goal", 44, 54);
      const intro = lessonNode("actionMessage", "Goal Message", 360, 54, { message: "Touch the goal object to win." });
      const trigger = lessonNode("eventTrigger", "Goal Touched", 44, 250, { trigger: triggerId });
      const success = lessonNode("actionMessage", "Celebrate", 360, 250, { message: "You reached the goal!" });
      const finish = lessonNode("actionFinish", "Win", 676, 250, { message: "You win!" });
      start.next = intro.id;
      trigger.next = success.id;
      success.next = finish.id;
      return { nodes: [start, intro, trigger, success, finish], selectedId: trigger.id, message: options.length ? `Touch to Win loaded and bound to ${options[0].label || triggerId}.` : "Touch to Win loaded. Place an object, then bind the touch event." };
    }
    if (id === "count-three") {
      const triggerId = options[0]?.id || "any";
      const start = lessonNode("eventStart", "Reset Counter", 44, 54);
      const reset = lessonNode("actionSetVariable", "Score Starts at Zero", 360, 54, { variable: "score", value: "0" });
      const intro = lessonNode("actionMessage", "Counting Goal", 676, 54, { message: "Touch the counter object three times. Leave it and come back between touches." });
      const trigger = lessonNode("eventTrigger", "Count a Touch", 44, 300, { trigger: triggerId });
      const add = lessonNode("actionChangeNumber", "Add One", 360, 300, { variable: "score", amount: 1 });
      const compare = lessonNode("logicCompareNumber", "Reached Three?", 676, 300, { variable: "score", operator: ">=", compare: 3 });
      const finish = lessonNode("actionFinish", "Counting Complete", 992, 240, { message: "Three touches! You win." });
      const keepGoing = lessonNode("actionMessage", "Keep Counting", 992, 370, { message: "Not three yet. Touch it again." });
      start.next = reset.id;
      reset.next = intro.id;
      trigger.next = add.id;
      add.next = compare.id;
      compare.next = finish.id;
      compare.alt = keepGoing.id;
      return { nodes: [start, reset, intro, trigger, add, compare, finish, keepGoing], selectedId: compare.id, message: options.length ? `Count to Three loaded and bound to ${options[0].label || triggerId}.` : "Count to Three loaded. Place an object, then bind the touch event." };
    }
    if (id === "switch-door") {
      if (options.length < 2) return { error: "Place at least two scene objects first: one switch and one door." };
      const switchObject = options[0];
      const doorObject = options[1];
      const start = lessonNode("eventStart", "Reset Door", 44, 54);
      const closeDoor = lessonNode("actionSetVariable", "Door Starts Closed", 360, 54, { variable: "doorOpen", value: "no" });
      const switchTrigger = lessonNode("eventTrigger", "Touch Switch", 44, 250, { trigger: switchObject.id });
      const openDoor = lessonNode("actionSetVariable", "Open Door", 360, 250, { variable: "doorOpen", value: "yes" });
      const openMessage = lessonNode("actionMessage", "Switch Message", 676, 250, { message: "The door is open." });
      const doorTrigger = lessonNode("eventTrigger", "Touch Door", 44, 470, { trigger: doorObject.id });
      const checkDoor = lessonNode("logicVariable", "Is Door Open?", 360, 470, { variable: "doorOpen", equals: "yes" });
      const finish = lessonNode("actionFinish", "Leave Room", 676, 410, { message: "The door was open. You escaped!" });
      const locked = lessonNode("actionMessage", "Locked Message", 676, 540, { message: "The door is locked. Find the switch." });
      start.next = closeDoor.id;
      switchTrigger.next = openDoor.id;
      openDoor.next = openMessage.id;
      doorTrigger.next = checkDoor.id;
      checkDoor.next = finish.id;
      checkDoor.alt = locked.id;
      return { nodes: [start, closeDoor, switchTrigger, openDoor, openMessage, doorTrigger, checkDoor, finish, locked], selectedId: checkDoor.id, message: `Switch and Door loaded using ${switchObject.label || switchObject.id} and ${doorObject.label || doorObject.id}.` };
    }
    return { error: "That guided build is not available." };
  }

  function applyLesson(id) {
    const lesson = buildLesson(id);
    if (lesson.error) {
      api.setStatus(lesson.error);
      return;
    }
    const data = { selectedId: lesson.selectedId, runtime: { variables: {}, checkpoint: null }, nodes: lesson.nodes };
    api.getState().playMode.nodeEditor = data;
    selectedId = data.selectedId;
    lastEntered = new Set();
    runtimeLog = [];
    activeIds = new Map();
    activeLinks = new Map();
    resetRuntimeState();
    renderAllContexts();
    api.saveLocal();
    logRuntime(lesson.message);
    api.setStatus(lesson.message);
  }

  function renderLessons(ctx) {
    if (!ctx?.lessons) return;
    ctx.lessons.innerHTML = `<div class="node-editor-section-head"><strong>Examples</strong><span>Load and try one</span></div><p class="node-editor-bind-note">Each example replaces the current rule map. You can test it, change it, and include it in the exported game.</p>`;
    const grid = document.createElement("div");
    grid.className = "node-editor-lesson-grid";
    LESSONS.forEach(lesson => {
      const buttonNode = document.createElement("button");
      buttonNode.type = "button";
      buttonNode.className = "node-editor-lesson";
      buttonNode.innerHTML = `<span>${escape(lesson.concept)}</span><strong>${escape(lesson.title)}</strong><small>${escape(lesson.detail)}</small>`;
      buttonNode.setAttribute("aria-label", `Load example ${lesson.title}. This replaces the current rule map.`);
      buttonNode.addEventListener("click", () => applyLesson(lesson.id));
      grid.appendChild(buttonNode);
    });
    ctx.lessons.appendChild(grid);
  }

  function renderBindings(ctx) {
    if (!ctx?.bindings) return;
    const options = api?.getNodeTriggerOptions?.() || [];
    if (!options.length) {
      ctx.bindings.innerHTML = `<div class="node-editor-section-head"><strong>Touch Rules</strong><span>First add an object</span></div><p class="node-editor-bind-note">Place an object in Play Mode, then make a rule that starts when the player touches it.</p><ol class="node-editor-mini-steps"><li>Choose a frame in Place Frame Art.</li><li>Click Place Object.</li><li>Use Make Rule here or in Scene Objects.</li></ol><p class="sr-only">No scene objects are available for touch rules.</p>`;
      return;
    }
    ctx.bindings.innerHTML = `<div class="node-editor-section-head"><strong>Touch Rules</strong><span>Objects in the scene</span></div><p class="node-editor-bind-note">Make or open the rule that runs when the player touches each object.</p>`;
    options.forEach(option => {
      const count = nodeCountForTrigger(option.id);
      const row = document.createElement("div");
      row.className = `node-editor-binding-row ${count ? "bound" : ""}`;
      const labelWrap = document.createElement("span");
      labelWrap.innerHTML = `<span>${escape(option.label || option.id)}</span><small>${count ? `${count} touch rule${count === 1 ? "" : "s"} · used in testing and export` : "Not connected yet · make a touch rule"}</small>`;
      const action = document.createElement("button");
      action.type = "button";
      action.textContent = count ? "Open Rule" : "Make Rule";
      action.setAttribute("aria-label", `${count ? "Open" : "Create"} touch rule for ${option.label || option.id}`);
      action.addEventListener("click", () => createTriggerForObject(option));
      row.append(labelWrap, action);
      ctx.bindings.appendChild(row);
    });
  }

  function renderNodes(ctx) {
    if (!ctx?.nodeLayer) return;
    ctx.nodeLayer.innerHTML = "";
    const data = graph();
    const nodeIssues = issuesByNode(data);
    data.nodes.forEach(node => {
      const issueText = nodeIssues.get(node.id) || [];
      const concept = conceptFor(node);
      const item = document.createElement("div");
      item.className = `node-editor-node concept-${concept.key} ${node.id === selectedId ? "active" : ""} ${EVENT_TYPES.has(node.type) ? "event" : ""} ${isActive(node.id) ? "running" : ""} ${node.id === highlightedId ? "just-created" : ""} ${node.id === settlingId ? "settling" : ""} ${node.type === "eventTrigger" && node.data.trigger && node.data.trigger !== "any" ? "bound" : ""} ${issueText.length ? "warning" : ""}`;
      item.style.left = `${Math.round(node.x)}px`;
      item.style.top = `${Math.round(node.y)}px`;
      item.dataset.nodeId = node.id;
      item.dataset.concept = concept.key;
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      const connectionCopy = !supportsNext(node.type) ? "This rule ends the path." : supportsAlt(node.type) ? "Connect Then and Else to other rules." : "Connect Then to another rule.";
      item.setAttribute("aria-label", `${node.name}. ${concept.label} rule. ${nodeStatement(node)}. ${issueText.length ? `Warning: ${issueText.join(" ")}` : "No warnings."} Drag to move. ${connectionCopy}`);
      item.setAttribute("aria-pressed", String(node.id === selectedId));
      const body = document.createElement("div");
      body.className = "node-editor-node-body";
      const title = document.createElement("strong");
      title.textContent = node.name;
      const meta = document.createElement("div");
      meta.className = "node-editor-node-meta";
      const conceptBadge = document.createElement("span");
      conceptBadge.className = `node-editor-concept-badge concept-${concept.key}`;
      conceptBadge.textContent = concept.label;
      const type = document.createElement("span");
      type.className = "node-editor-type-label";
      type.textContent = TYPES[node.type] || "Rule";
      meta.append(conceptBadge, type);
      const statement = document.createElement("code");
      statement.className = "node-editor-node-statement";
      statement.textContent = nodeStatement(node);
      const flow = document.createElement("span");
      flow.className = "node-editor-node-route";
      flow.textContent = issueText.length ? issueText[0] : routeSummary(node);
      body.append(title, meta, statement, flow);
      const ports = document.createElement("div");
      ports.className = "node-editor-ports";
      const availablePorts = [];
      if (supportsNext(node.type)) availablePorts.push("next");
      if (supportsAlt(node.type)) availablePorts.push("alt");
      availablePorts.forEach(port => {
        const portButton = document.createElement("button");
        portButton.type = "button";
        portButton.className = `node-editor-port ${port}`;
        portButton.innerHTML = `<span>Connect</span><strong>${portTitle(port)}</strong><span aria-hidden="true">→</span><span class="sr-only"> from ${escape(node.name)} to another rule</span>`;
        portButton.setAttribute("aria-label", `Connect ${portTitle(port)} from ${node.name} to another rule`);
        portButton.addEventListener("pointerdown", event => startConnection(event, node.id, port));
        ports.appendChild(portButton);
      });
      item.append(body);
      if (availablePorts.length) item.append(ports);
      item.addEventListener("click", () => {
        if (drag?.moved) return;
        select(node.id);
      });
      item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(node.id); }
      });
      item.addEventListener("pointerdown", startDrag);
      ctx.nodeLayer.appendChild(item);
    });
    requestAnimationFrame(() => drawLinks(ctx));
  }

  function addNode(type) {
    if (!TYPES[type]) return;
    const data = graph();
    const anchor = selectedNode();
    const node = normalizeNode({ id: makeId(type), type, name: TYPES[type], x: (anchor?.x ?? 40) + NODE_GAP_X, y: (anchor?.y ?? 40) + 34, data: defaultDataForType(type) }, data.nodes.length);
    data.nodes.push(node);
    if (anchor && supportsNext(anchor.type) && !anchor.next && !EVENT_TYPES.has(node.type)) anchor.next = node.id;
    selectedId = node.id;
    data.selectedId = node.id;
    renderAllContexts();
    api.saveLocal();
    api.setStatus(`${TYPES[type]} rule added.`);
  }

  function makeAddMenu(ctx) {
    const menu = document.createElement("details");
    menu.className = "node-add-menu";
    const summary = document.createElement("summary");
    summary.textContent = "Add Rule";
    summary.setAttribute("aria-label", "Add a game rule");
    const panel = document.createElement("div");
    panel.className = "node-add-panel";
    panel.setAttribute("role", "menu");
    NODE_GROUPS.forEach(group => {
      const groupWrap = document.createElement("div");
      groupWrap.className = "node-add-group";
      const heading = document.createElement("strong");
      heading.textContent = group.label;
      const hint = document.createElement("span");
      hint.textContent = group.hint;
      groupWrap.append(heading, hint);
      group.items.forEach(itemData => {
        const item = document.createElement("button");
        item.type = "button";
        item.innerHTML = `<strong>${escape(itemData.name)}</strong><small>${escape(itemData.detail)}</small>`;
        item.setAttribute("role", "menuitem");
        item.setAttribute("aria-label", `Add ${itemData.name} rule. ${itemData.detail}`);
        item.addEventListener("click", () => {
          menu.open = false;
          addNode(itemData.type);
          ctx?.board?.focus?.();
        });
        groupWrap.appendChild(item);
      });
      panel.appendChild(groupWrap);
    });
    menu.append(summary, panel);
    return menu;
  }

  function cssEscape(value) {
    return String(value || "").replace(/"/g, "");
  }

  function scrollNodeIntoView(ctx, id) {
    const item = ctx?.nodeLayer?.querySelector?.(`[data-node-id="${cssEscape(id)}"]`);
    if (!item) return;
    item.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }

  function showNode(id) {
    highlightedId = String(id || "");
    window.setTimeout(() => { if (highlightedId === String(id || "")) { highlightedId = ""; renderAllContexts(false); } }, 1600);
    openOverlay();
    renderAllContexts(false);
    scrollNodeIntoView(overlayContext, id);
    scrollNodeIntoView(inlineContext, id);
  }

  function createTriggerForObject(option = api?.getSelectedNodeTriggerOption?.()) {
    if (!option?.id) { api.setStatus("Select or place a Play Mode object before making a touch rule."); return false; }
    api?.selectNodeTriggerObject?.(option.index);
    const data = graph();
    let event = data.nodes.find(node => node.type === "eventTrigger" && String(node.data.trigger || "") === String(option.id));
    if (!event) {
      const baseX = 56 + Math.min(data.nodes.length, 6) * 28;
      event = normalizeNode({ id: makeId("trigger"), type: "eventTrigger", name: option.id, x: baseX, y: 180 + Math.min(data.nodes.length, 6) * 22, data: { trigger: option.id } }, data.nodes.length);
      const action = normalizeNode({ id: makeId("message"), type: "actionMessage", name: `${option.id} Message`, x: event.x + NODE_GAP_X, y: event.y, data: { message: `${option.id} triggered.` } }, data.nodes.length + 1);
      event.next = action.id;
      data.nodes.push(event, action);
    } else {
      event.data.trigger = option.id;
    }
    selectedId = event.id;
    data.selectedId = event.id;
    renderAllContexts();
    api.saveLocal();
    logRuntime(`Bound ${option.label || option.id}.`);
    api.setStatus(`Touch rule connected to ${option.label || option.id}.`);
    showNode(event.id);
    return true;
  }

  function runSelectedNode() {
    const node = selectedNode();
    if (!node) return;
    activeIds = new Map();
    activeLinks = new Map();
    resetRuntimeState();
    setRuntimeState({ testRoot: label(node), lastTrigger: `Manual test: ${node.name || TYPES[node.type]}` });
    if (EVENT_TYPES.has(node.type)) {
      pulseNode(node.id);
      logRuntime(`Tested from ${node.name}.`);
      const nextId = node.next || "";
      setRuntimeState({ currentId: node.id, currentLabel: label(node), nextIds: nextId ? [nextId] : [] });
      pulseLink(node.id, nextId);
      executeNode(nextId, {}, new Set([node.id]));
    } else {
      logRuntime(`Tested from ${node.name}.`);
      executeNode(node.id, {}, new Set());
    }
    renderAllContexts(false);
  }

  function runSceneStart() {
    resetRuntime();
    setRuntimeState({ lastTrigger: "Manual Scene Start", testRoot: "Scene Start" });
    logRuntime("Manual Scene Start test.");
    runEvent("sceneStart", {});
    renderAllContexts(false);
  }

  function deleteNode() {
    const data = graph();
    if (data.nodes.length <= 1) return;
    const node = selectedNode();
    data.nodes = data.nodes.filter(item => item.id !== node.id);
    data.nodes.forEach(item => {
      if (item.next === node.id) item.next = "";
      if (item.alt === node.id) item.alt = "";
    });
    selectedId = data.nodes[0]?.id || "";
    data.selectedId = selectedId;
    renderAllContexts();
    api.saveLocal();
    api.setStatus("Rule deleted.");
  }

  function resetGraph() {
    const data = defaultGraph();
    api.getState().playMode.nodeEditor = data;
    selectedId = data.selectedId;
    lastEntered = new Set();
    renderAllContexts();
    api.saveLocal();
    api.setStatus("Rule map reset.");
  }

  function clearConnection() {
    const node = selectedNode();
    if (!node) return;
    node.next = "";
    node.alt = "";
    renderAllContexts();
    api.saveLocal();
    api.setStatus("Rule connections cleared.");
  }

  function startDrag(event) {
    if (event.target.closest(".node-editor-port")) return;
    const node = graph().nodes.find(item => item.id === event.currentTarget.dataset.nodeId);
    if (!node) return;
    event.preventDefault();
    const ctx = contextFromElement(event.currentTarget);
    selectedId = node.id;
    graph().selectedId = node.id;
    drag = { node, ctx, element: event.currentTarget, startX: event.clientX, startY: event.clientY, nodeX: node.x, nodeY: node.y, moved: false };
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch (err) {}
    event.currentTarget.classList.add("dragging");
    ctx?.board?.classList.add("node-editor-board-live", "dragging-node");
    setBoardMotion(ctx, 0, 0);
    document.addEventListener("pointermove", moveDrag, true);
    document.addEventListener("pointerup", endDrag, true);
    renderInspector(ctx);
  }

  function moveDrag(event) {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true;
    drag.node.x = number(drag.nodeX + dx, drag.nodeX, 0, 2200);
    drag.node.y = number(drag.nodeY + dy, drag.nodeY, 0, 1400);
    drag.element.style.left = `${Math.round(drag.node.x)}px`;
    drag.element.style.top = `${Math.round(drag.node.y)}px`;
    drag.element.style.setProperty("--node-tilt", `${clamp(dx / 22, -7, 7)}deg`);
    drag.element.style.setProperty("--node-lift-x", `${clamp(dx / 40 - 6, -9, -2)}px`);
    drag.element.style.setProperty("--node-lift-y", `${clamp(dy / 40 - 6, -9, -2)}px`);
    setBoardMotion(drag.ctx, dx, dy);
    drawLinks(drag.ctx);
  }

  function endDrag() {
    if (!drag) return;
    const element = drag.element;
    const ctx = drag.ctx;
    const nodeId = drag.node.id;
    element.classList.remove("dragging");
    element.style.removeProperty("--node-tilt");
    element.style.removeProperty("--node-lift-x");
    element.style.removeProperty("--node-lift-y");
    ctx?.board?.classList.remove("node-editor-board-live", "dragging-node");
    clearBoardMotion(ctx);
    document.removeEventListener("pointermove", moveDrag, true);
    document.removeEventListener("pointerup", endDrag, true);
    const moved = drag.moved;
    settlingId = moved ? nodeId : "";
    drag = null;
    renderAllContexts();
    if (moved) window.setTimeout(() => { if (settlingId === nodeId) { settlingId = ""; renderAllContexts(false); } }, 420);
    api.saveLocal();
    if (moved) api.setStatus("Rule moved.");
  }

  function renderMapTools(ctx) {
    if (!ctx?.mapTools) return;
    ctx.mapTools.innerHTML = "";
    const addMenu = makeAddMenu(ctx);
    addMenu.classList.add("node-add-menu-map");
    const remove = button("Delete Rule", "delete the selected game rule", deleteNode);
    remove.classList.add("node-editor-delete-rule");
    const unavailable = graph().nodes.length <= 1 || !selectedNode();
    remove.disabled = unavailable;
    if (unavailable) remove.setAttribute("aria-describedby", `${ctx.key}-delete-rule-help`);
    const help = document.createElement("span");
    help.id = `${ctx.key}-delete-rule-help`;
    help.className = "sr-only";
    help.textContent = unavailable ? "At least one rule must remain on the map." : "Deletes the selected rule and removes connections to it.";
    ctx.mapTools.append(addMenu, remove, help);
  }

  function makeActions(ctx) {
    if (!ctx?.actions || ctx.actions.dataset.ready) return;
    ctx.actions.dataset.ready = "true";
    const testControls = [
      button("Test Rule", "test from the selected rule in the game preview", runSelectedNode),
      button("Test Beginning", "run every When Game Starts rule without starting movement", runSceneStart)
    ];
    const mapControls = [
      button("Auto Arrange", "arrange the rule map without changing its rules or connections", wrangleGraph),
      button("Clear Connections", "clear the Then and Else connections from the selected rule", clearConnection)
    ];
    const more = document.createElement("details");
    more.className = "node-editor-action-more";
    const summary = document.createElement("summary");
    summary.textContent = "More";
    summary.setAttribute("aria-label", "Show more rule tools");
    const panel = document.createElement("div");
    panel.className = "node-editor-action-more-panel";
    panel.append(button("Reset Lessons", "reset the rule map to the first sequence lesson", resetGraph));
    more.append(summary, panel);
    ctx.actions.setAttribute("aria-label", "Rule testing and map tools");
    ctx.actions.append(
      actionGroup("Try It", testControls),
      actionGroup("Organize", mapControls),
      more
    );
  }

  function renderContext(ctx) {
    if (!ctx) return;
    makeActions(ctx);
    renderMapTools(ctx);
    renderLessons(ctx);
    renderBindings(ctx);
    renderRuntime(ctx);
    renderCheck(ctx);
    renderNodes(ctx);
    renderInspector(ctx);
  }

  function renderAllContexts(save = true) {
    renderContext(inlineContext);
    if (overlayOpen) renderContext(overlayContext);
    if (save) api?.saveLocal?.();
  }

  function buildInline() {
    const grid = document.querySelector(".play-section-grid");
    if (!grid) return null;
    let card = document.getElementById("node-editor-card");
    if (!card) {
      card = document.createElement("div");
      card.id = "node-editor-card";
      card.className = "play-card node-editor-card";
      card.dataset.dockId = "play-node-editor";
      card.innerHTML = `<div class="node-editor-card-head"><h3><span class="drag-handle" aria-hidden="true">↕</span> Game Rules</h3><button type="button" class="node-editor-large-open" aria-describedby="node-editor-large-open-help">Large View</button><span class="sr-only" id="node-editor-large-open-help">Open the game rule map in a larger window.</span></div><p class="control-hint" id="node-editor-help">Connect rules to decide what happens in your game.</p><div class="node-editor-lessons" aria-label="Game rule examples"></div><div class="button-row action-row play-actions node-editor-actions"></div><div class="node-editor-bindings" aria-label="Scene object touch rules"></div><div class="node-editor-workspace"><div class="node-editor-map-column"><div class="node-editor-map-head"><div class="node-editor-map-copy"><strong>Rule Map</strong><span id="node-editor-connect-help">Drag a Connect button to the rule that should run next. Then and Else can also be chosen under Edit This Rule.</span></div><div class="node-editor-map-controls"><div class="node-editor-map-tools" aria-label="Add and delete rules"></div><div class="node-editor-route-key" aria-label="Connection colors"><span class="route-next">Then</span><span class="route-alt">Else</span></div></div></div><div class="node-editor-board" role="application" tabindex="0" aria-label="Visual game rule map" aria-describedby="node-editor-help node-editor-connect-help"><div class="node-editor-nodes"></div></div></div><div class="node-editor-inspector" aria-label="Selected game rule editor"></div></div><div class="node-editor-runtime" aria-live="polite"></div><div class="node-editor-check" aria-live="polite"></div>`;
      const quickStartCard = grid.querySelector('[data-dock-id="play-quick-start"]');
      if (quickStartCard) quickStartCard.after(card);
      else grid.prepend(card);
    }
    const largeButton = card.querySelector(".node-editor-large-open");
    if (largeButton && !largeButton.dataset.ready) {
      largeButton.dataset.ready = "true";
      largeButton.addEventListener("click", openOverlay);
    }
    return {
      key: "inline",
      root: card,
      board: card.querySelector(".node-editor-board"),
      nodeLayer: card.querySelector(".node-editor-nodes"),
      inspector: card.querySelector(".node-editor-inspector"),
      actions: card.querySelector(".node-editor-actions"),
      runtime: card.querySelector(".node-editor-runtime"),
      check: card.querySelector(".node-editor-check"),
      bindings: card.querySelector(".node-editor-bindings"),
      lessons: card.querySelector(".node-editor-lessons"),
      mapTools: card.querySelector(".node-editor-map-tools")
    };
  }

  function buildOverlay() {
    let overlay = document.getElementById("node-editor-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "node-editor-overlay";
      overlay.className = "modal-overlay";
      overlay.hidden = true;
      overlay.innerHTML = `<div class="modal-card node-editor-large" role="dialog" aria-modal="true" aria-labelledby="node-editor-large-title" aria-describedby="node-editor-large-help"><div class="modal-head"><div><span class="play-mode-eyebrow">Play Mode</span><h2 id="node-editor-large-title">Game Rules</h2></div><button type="button" class="node-editor-close" aria-label="Close large rule editor">Close<span class="sr-only"> rule editor</span></button></div><p class="control-hint" id="node-editor-large-help">Connect rules to decide what happens in your game.</p><div class="node-editor-lessons" aria-label="Game rule examples"></div><div class="button-row action-row play-actions node-editor-actions"></div><div class="node-editor-bindings" aria-label="Scene object touch rules"></div><div class="node-editor-workspace"><div class="node-editor-map-column"><div class="node-editor-map-head"><div class="node-editor-map-copy"><strong>Rule Map</strong><span id="node-editor-large-connect-help">Drag a Connect button to the rule that should run next. Then and Else can also be chosen under Edit This Rule.</span></div><div class="node-editor-map-controls"><div class="node-editor-map-tools" aria-label="Add and delete rules"></div><div class="node-editor-route-key" aria-label="Connection colors"><span class="route-next">Then</span><span class="route-alt">Else</span></div></div></div><div class="node-editor-board node-editor-large-board" role="application" tabindex="0" aria-label="Large visual game rule map" aria-describedby="node-editor-large-help node-editor-large-connect-help"><div class="node-editor-nodes"></div></div></div><div class="node-editor-inspector" aria-label="Large selected game rule editor"></div></div><div class="node-editor-runtime" aria-live="polite"></div><div class="node-editor-check" aria-live="polite"></div></div>`;
      document.body.appendChild(overlay);
      overlay.querySelector(".node-editor-close")?.addEventListener("click", closeOverlay);
      overlay.addEventListener("click", event => { if (event.target === overlay) closeOverlay(); });
    }
    return {
      key: "large",
      root: overlay,
      board: overlay.querySelector(".node-editor-board"),
      nodeLayer: overlay.querySelector(".node-editor-nodes"),
      inspector: overlay.querySelector(".node-editor-inspector"),
      actions: overlay.querySelector(".node-editor-actions"),
      runtime: overlay.querySelector(".node-editor-runtime"),
      check: overlay.querySelector(".node-editor-check"),
      bindings: overlay.querySelector(".node-editor-bindings"),
      lessons: overlay.querySelector(".node-editor-lessons"),
      mapTools: overlay.querySelector(".node-editor-map-tools")
    };
  }

  function openOverlay() {
    overlayContext = buildOverlay();
    overlayOpen = true;
    overlayContext.root.hidden = false;
    renderContext(overlayContext);
    overlayContext.board?.focus?.();
  }

  function closeOverlay() {
    if (!overlayContext?.root) return;
    overlayOpen = false;
    overlayContext.root.hidden = true;
    renderContext(inlineContext);
  }

  function compareNumbers(left, operator, right) {
    if (operator === "=") return left === right;
    if (operator === "!=") return left !== right;
    if (operator === "<") return left < right;
    if (operator === "<=") return left <= right;
    if (operator === ">") return left > right;
    return left >= right;
  }

  function executeNode(id, payload = {}, seen = new Set()) {
    const data = graph();
    const node = data.nodes.find(item => item.id === id);
    if (!node || seen.has(id) || seen.size > 40) return;
    seen.add(id);
    pulseNode(id);
    logRuntime(`Ran ${TYPES[node.type] || "Node"}: ${node.name || id}.`);
    let nextId = node.next;
    let nextDelay = 0;
    const actions = [...(runtimeState.actions || [])];
    function addAction(copy) {
      actions.unshift(copy);
      actions.splice(6);
    }
    if (node.type === "actionMessage") {
      const textEventMessage = Number(node.data.textLine) >= 0 ? api.getTextEventMessage?.(Number(node.data.textLine)) : "";
      api.showPlayMessage?.(textEventMessage || node.data.message || node.name || "Message");
      addAction(`Showed text from ${node.name}.`);
      if (nextId) nextDelay = MESSAGE_STEP_DELAY;
    }
    if (node.type === "actionFinish") {
      api.finishPlayMode?.(node.data.message || "Finished.");
      addAction(`Finished the game at ${node.name}.`);
      nextId = "";
    }
    if (node.type === "actionDialogue") {
      const dialogueNext = nextId;
      nextId = "";
      api.startPlayDialogue?.(Math.max(0, Number(node.data.line) || 0), () => {
        if (!dialogueNext) return;
        pulseLink(node.id, dialogueNext);
        executeNode(dialogueNext, payload, seen);
      });
      addAction(`Started dialogue at ${textEventLabel(node.data.line)}.`);
      setRuntimeState({ currentId: node.id, currentLabel: label(node), actions, nextIds: dialogueNext ? [dialogueNext] : [] });
      return;
    }
    if (node.type === "actionCheckpoint") {
      api.setPlayCheckpoint?.();
      addAction(`Saved checkpoint at ${node.name}.`);
    }
    if (node.type === "actionMoveActor") {
      api.movePlayActor?.(Number(node.data.dx) || 0, Number(node.data.dy) || 0);
      addAction(`Moved actor by ${Number(node.data.dx) || 0}, ${Number(node.data.dy) || 0}.`);
    }
    if (node.type === "actionSetVariable") {
      data.runtime.variables[node.data.variable] = String(node.data.value ?? "true");
      addAction(`Set ${node.data.variable} to ${node.data.value}.`);
    }
    if (node.type === "actionChangeNumber") {
      const current = Number(data.runtime.variables[node.data.variable]) || 0;
      const changed = current + (Number(node.data.amount) || 0);
      data.runtime.variables[node.data.variable] = String(changed);
      addAction(`Changed ${node.data.variable} from ${current} to ${changed}.`);
    }
    if (node.type === "logicVariable") {
      const matched = String(data.runtime.variables[node.data.variable] ?? "") === String(node.data.equals);
      nextId = matched ? node.next : node.alt;
      addAction(`Checked ${node.data.variable}: ${matched ? "true" : "false"}.`);
    }
    if (node.type === "logicCompareNumber") {
      const current = Number(data.runtime.variables[node.data.variable]) || 0;
      const matched = compareNumbers(current, node.data.operator, Number(node.data.compare) || 0);
      nextId = matched ? node.next : node.alt;
      addAction(`Compared ${current} ${node.data.operator || ">="} ${Number(node.data.compare) || 0}: ${matched ? "true" : "false"}.`);
    }
    const nextIds = nextId ? [nextId] : [];
    setRuntimeState({ currentId: node.id, currentLabel: label(node), actions, nextIds });
    if (nextId) {
      pulseLink(node.id, nextId);
      window.setTimeout(() => executeNode(nextId, payload, seen), nextDelay);
    }
  }

  function runEvent(type, payload = {}) {
    const nodes = graph().nodes.filter(node => {
      if (type === "sceneStart") return node.type === "eventStart";
      if (type === "triggerEnter") {
        const choices = new Set(["any", payload.name, payload.id, ...(Array.isArray(payload.ids) ? payload.ids : [])].map(item => String(item || "")));
        return node.type === "eventTrigger" && choices.has(String(node.data.trigger || "any"));
      }
      return false;
    });
    if (nodes.length) logRuntime(type === "triggerEnter" ? `Player touched ${payload?.name || "an object"}.` : "Game start rules began.");
    if (nodes.length) setRuntimeState({ lastTrigger: type === "triggerEnter" ? `Player touched ${payload?.name || "an object"}` : "Game started" });
    nodes.forEach(node => {
      const nextId = node.next || "";
      pulseNode(node.id);
      pulseLink(node.id, nextId);
      setRuntimeState({ currentId: node.id, currentLabel: label(node), nextIds: nextId ? [nextId] : [] });
      executeNode(nextId, payload, new Set([node.id]));
    });
  }

  function rectsOverlap(a, b) {
    return a && b && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function expandRect(rect, pad = 6) {
    return rect ? { x: rect.x - pad, y: rect.y - pad, w: rect.w + pad * 2, h: rect.h + pad * 2 } : rect;
  }

  function syncPlayMode() {
    const runtime = api?.getPlayRuntime?.();
    if (!runtime?.running) return;
    const entered = new Set();
    const fired = new Set();
    const actorTouch = expandRect(runtime.actor, 8);
    (runtime.props || []).forEach(prop => {
      if (!rectsOverlap(actorTouch, prop.rect)) return;
      const triggerId = prop.prop?.nodeTriggerId || `prop-${prop.index + 1}`;
      const ids = [triggerId, `prop-${prop.index + 1}`, `prop-${prop.index}`, "any"];
      ids.forEach(id => entered.add(id));
      if (!lastEntered.has(triggerId) && !fired.has(triggerId)) {
        fired.add(triggerId);
        runEvent("triggerEnter", { id: triggerId, name: triggerId, ids, prop });
      }
    });
    lastEntered = entered;
  }

  function createTextEventNode(option = {}) {
    const data = graph();
    const index = Math.max(0, Number(option.index) || 0);
    const kind = option.kind === "dialogue" ? "dialogue" : "message";
    const type = kind === "dialogue" ? "actionDialogue" : "actionMessage";
    const anchor = selectedNode();
    const node = normalizeNode({
      id: makeId(kind === "dialogue" ? "dialogue" : "message"),
      type,
      name: kind === "dialogue" ? `Start ${option.speaker || "Dialogue"}` : `Message ${Number(index) + 1}`,
      x: (anchor?.x ?? 56) + NODE_GAP_X,
      y: (anchor?.y ?? 88) + 24,
      data: kind === "dialogue" ? { line: index } : { textLine: index, message: option.text || "Message shown." }
    }, data.nodes.length);
    data.nodes.push(node);
    if (anchor && supportsNext(anchor.type) && !anchor.next && !EVENT_TYPES.has(node.type)) anchor.next = node.id;
    selectedId = node.id;
    data.selectedId = node.id;
    renderAllContexts();
    api.saveLocal();
    api.setStatus(`${kind === "dialogue" ? "Dialogue" : "Message"} rule created from Text Events.`);
    showNode(node.id);
    return true;
  }

  function attachTextEventToSelectedNode(option = {}) {
    const node = selectedNode();
    if (!node) return createTextEventNode({ ...option, kind: "message" });
    const index = Math.max(0, Number(option.index) || 0);
    if (node.type === "actionDialogue") {
      node.data.line = index;
    } else if (node.type === "actionMessage") {
      node.data.textLine = index;
      node.data.message = String(option.text || node.data.message || "Message shown.").slice(0, 180);
    } else {
      return createTextEventNode({ ...option, kind: "message" });
    }
    renderAllContexts();
    api.saveLocal();
    api.setStatus("Text Event added to the selected rule.");
    showNode(node.id);
    return true;
  }

  function resetRuntime() {
    lastEntered = new Set();
    runtimeLog = [];
    activeIds = new Map();
    activeLinks = new Map();
    resetRuntimeState();
    const data = graph();
    data.runtime = data.runtime && typeof data.runtime === "object" ? data.runtime : {};
    data.runtime.variables = {};
    data.runtime.checkpoint = null;
    renderAllContexts(false);
  }

  function render() {
    if (!api) return;
    inlineContext = buildInline();
    if (overlayOpen) overlayContext = buildOverlay();
    graph();
    renderAllContexts(false);
  }

  function mount(nextApi) {
    api = nextApi;
    try { render(); }
    catch (err) { console.error(err); }
  }

  window.PixelBugNodeEditor = { mount, render, runEvent, syncPlayMode, resetRuntime, createTriggerForObject, createTextEventNode, attachTextEventToSelectedNode, openOverlay };
  if (window.PixelBugAppApi) mount(window.PixelBugAppApi);
})();
