// Node editor
(() => {
  const TYPES = {
    eventStart: "Scene Start",
    eventTrigger: "Trigger Enter",
    actionMessage: "Show Message",
    actionDialogue: "Start Dialogue",
    actionCheckpoint: "Set Checkpoint",
    actionSetVariable: "Set Variable",
    actionMoveActor: "Move Actor",
    logicVariable: "Check Variable",
    actionFinish: "Finish Game"
  };
  const EVENT_TYPES = new Set(["eventStart", "eventTrigger"]);
  const NODE_GROUPS = [
    { label: "Events", items: [["eventStart", "Scene Start"], ["eventTrigger", "Trigger Enter"]] },
    { label: "Actions", items: [["actionMessage", "Show Message"], ["actionDialogue", "Start Dialogue"], ["actionCheckpoint", "Set Checkpoint"], ["actionMoveActor", "Move Actor"], ["actionFinish", "Finish Game"]] },
    { label: "Logic", items: [["actionSetVariable", "Set Variable"], ["logicVariable", "Check Variable"]] }
  ];
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
    return {
      selectedId: start,
      runtime: { variables: {}, checkpoint: null },
      nodes: [
        { id: start, type: "eventStart", name: "Scene Start", x: 36, y: 44, next: message, alt: "", data: {} },
        { id: message, type: "actionMessage", name: "Welcome", x: 300, y: 44, next: "", alt: "", data: { message: "Scene started." } }
      ]
    };
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
    node.next = String(node?.next || "").slice(0, 80);
    node.alt = String(node?.alt || "").slice(0, 80);
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
      if (!ids.has(node.next)) node.next = "";
      if (!ids.has(node.alt)) node.alt = "";
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
    return `${TYPES[node.type] || "Node"}: ${node.name || "Untitled"}`;
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

  function nodeDetail(node) {
    if (!node) return "Choose a node to edit its type, routes, and Play Mode action.";
    if (node.type === "eventStart") return "Fires when the top Play Mode tester starts running.";
    if (node.type === "eventTrigger") return node.data.trigger === "any" ? "Fires when the actor touches any bound scene object." : `Fires when the actor touches ${node.data.trigger}.`;
    if (node.type === "actionMessage") return Number(node.data.textLine) >= 0 ? `Shows ${textEventLabel(node.data.textLine)} in the top canvas.` : `Shows: ${snippet(node.data.message, "Message shown.")}`;
    if (node.type === "actionDialogue") return `Starts dialogue at ${textEventLabel(node.data.line)}.`;
    if (node.type === "actionCheckpoint") return "Saves the actor position as a checkpoint.";
    if (node.type === "actionSetVariable") return `Sets ${node.data.variable || "flag"} = ${node.data.value || "true"}.`;
    if (node.type === "logicVariable") return `Routes by whether ${node.data.variable || "flag"} equals ${node.data.equals || "true"}.`;
    if (node.type === "actionMoveActor") return `Moves actor by X ${Number(node.data.dx) || 0}, Y ${Number(node.data.dy) || 0}.`;
    if (node.type === "actionFinish") return "Stops the top tester and shows the finish message.";
    return "Node action.";
  }

  function nodeEffect(node) {
    if (!node) return "No effect";
    if (node.type === "eventStart") return "Starts graph";
    if (node.type === "eventTrigger") return "Touches object";
    if (node.type === "actionMessage") return "Shows text";
    if (node.type === "actionDialogue") return "Starts dialogue";
    if (node.type === "actionCheckpoint") return "Saves reset";
    if (node.type === "actionSetVariable") return "Changes state";
    if (node.type === "logicVariable") return "Branches route";
    if (node.type === "actionMoveActor") return "Moves actor";
    if (node.type === "actionFinish") return "Ends route";
    return "Runs action";
  }

  function routeLabels(ids = [], nodes = graph().nodes) {
    const byId = new Map(nodes.map(node => [node.id, node]));
    return ids.map(id => byId.get(id)).filter(Boolean).map(node => `${TYPES[node.type] || "Node"}: ${node.name || "Untitled"}`);
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
    const setters = new Set(nodes.filter(node => node.type === "actionSetVariable").map(node => String(node.data.variable || "flag")));
    nodes.forEach(node => {
      if (EVENT_TYPES.has(node.type) && !node.next && !node.alt) issues.push({ id: node.id, text: `${node.name} has no action route.` });
      if (!EVENT_TYPES.has(node.type) && !reachable.has(node.id)) issues.push({ id: node.id, text: `${node.name} cannot be reached from an event.` });
      if (!EVENT_TYPES.has(node.type) && !incoming.get(node.id) && roots.length) issues.push({ id: node.id, text: `${node.name} has no incoming link.` });
      if (node.type === "eventTrigger" && node.data.trigger !== "any" && !triggerOptions.has(String(node.data.trigger || ""))) issues.push({ id: node.id, text: `${node.name} references a missing object trigger.` });
      if (node.type === "actionMessage" && Number(node.data.textLine) >= 0 && !textOptions.some(option => Number(option.index) === Number(node.data.textLine))) issues.push({ id: node.id, text: `${node.name} references a missing Text Event.` });
      if (node.type === "actionDialogue" && !textOptions.some(option => Number(option.index) === Number(node.data.line))) issues.push({ id: node.id, text: `${node.name} starts at a missing Text Event.` });
      if (node.type === "logicVariable") {
        if (!node.next) issues.push({ id: node.id, text: `${node.name} is missing its true route.` });
        if (!node.alt) issues.push({ id: node.id, text: `${node.name} is missing its false route.` });
        if (!setters.has(String(node.data.variable || "flag"))) issues.push({ id: node.id, text: `${node.name} checks a variable no node sets.` });
      }
    });
    if (!roots.length) issues.push({ id: "", text: "The graph has no event node." });
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
    if (!node) return "No route selected.";
    const byId = new Map(nodes.map(item => [item.id, item]));
    const next = byId.get(node.next);
    const alt = byId.get(node.alt);
    const parts = [];
    parts.push(next ? `Next → ${TYPES[next.type] || "Node"}: ${next.name}` : "Next is not connected");
    if (node.type === "logicVariable" || node.alt) parts.push(alt ? `Alt → ${TYPES[alt.type] || "Node"}: ${alt.name}` : "Alt is not connected");
    return parts.join(" · ");
  }

  function nodeTargets(node) {
    return [node?.next, node?.alt].filter(Boolean);
  }

  function repairTriggerBindings(data) {
    const options = api?.getNodeTriggerOptions?.() || [];
    const valid = new Set(["any", ...options.map(option => String(option.id || ""))]);
    data.nodes.forEach(node => {
      if (node.type !== "eventTrigger") return;
      const current = String(node.data.trigger || "any");
      if (!valid.has(current)) {
        node.data.trigger = options[0]?.id || "any";
        node.name = node.data.trigger === "any" ? "Any Trigger" : node.data.trigger;
      }
    });
  }

  function ensureEventAction(data, eventNode) {
    if (!eventNode || eventNode.next || eventNode.alt) return false;
    const message = normalizeNode({
      id: makeId("message"),
      type: "actionMessage",
      name: `${eventNode.type === "eventStart" ? "Start" : "Trigger"} Message`,
      x: eventNode.x + 270,
      y: eventNode.y,
      data: { message: eventNode.type === "eventStart" ? "Scene started." : `${eventNode.data.trigger || "Object"} triggered.` }
    }, data.nodes.length);
    eventNode.next = message.id;
    data.nodes.push(message);
    return true;
  }

  function wrangleGraph() {
    const data = graph();
    let changed = false;
    if (!data.nodes.some(node => node.type === "eventStart")) {
      data.nodes.unshift(normalizeNode({ id: makeId("start"), type: "eventStart", name: "Scene Start", x: 44, y: 44, data: {} }, 0));
      changed = true;
    }
    repairTriggerBindings(data);
    data.nodes.filter(node => EVENT_TYPES.has(node.type)).forEach(node => { if (ensureEventAction(data, node)) changed = true; });
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
    let orphanLevel = Math.max(1, ...Array.from(depth.values()), 1) + 1;
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
        item.node.x = 44 + level * 270;
        item.node.y = 44 + rowIndex * 134;
      });
    });
    selectedId = data.selectedId = selectedId || roots[0]?.id || data.nodes[0]?.id || "";
    renderAllContexts();
    api.saveLocal();
    logRuntime(changed ? "Wrangled graph and added missing action routes." : "Wrangled graph layout and repaired routes.");
    api.setStatus(changed ? "Node wrangler added missing playable routes and arranged the map." : "Node wrangler arranged the map and checked bindings.");
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

  function makeSelect(id, labelText, value, nodes) {
    const wrap = document.createElement("label");
    wrap.setAttribute("for", id);
    wrap.textContent = labelText;
    const select = document.createElement("select");
    select.id = id;
    select.dataset.field = labelText.toLowerCase();
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
    return [wrap, select];
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
    if (node.type === "eventTrigger") return `<label for="${prefix}-trigger">Trigger Object</label><select id="${prefix}-trigger" data-field="trigger" aria-label="Trigger object">${triggerOptionsMarkup(node.data.trigger)}</select><p class="control-hint">Choose the placed Play Mode object that should fire this node when the actor touches it.</p>`;
    if (node.type === "actionMessage") return `<label for="${prefix}-text-line">Text Event</label><select id="${prefix}-text-line" data-field="textLine" aria-label="Text event source">${textEventOptionsMarkup(node.data.textLine, true)}</select><label for="${prefix}-message">Custom Text</label><textarea id="${prefix}-message" data-field="message" maxlength="180" aria-label="Custom message text"></textarea><p class="control-hint">Shows a visible Play Mode message. Choose a Text Event to reuse a line, or keep Custom message text.</p>`;
    if (node.type === "actionFinish") return `<label for="${prefix}-message">Finish Message</label><textarea id="${prefix}-message" data-field="message" maxlength="180" aria-label="Finish message"></textarea><p class="control-hint">Shows a final message and stops Play Mode when this node runs.</p>`;
    if (node.type === "actionDialogue") return `<label for="${prefix}-line">Start Text Event</label><select id="${prefix}-line" data-field="line" aria-label="Dialogue start text event">${textEventOptionsMarkup(node.data.line, false)}</select><p class="control-hint">Starts the dialogue box at this reusable Text Event line.</p>`;
    if (node.type === "actionSetVariable") return `<label for="${prefix}-variable">Variable</label><input id="${prefix}-variable" data-field="variable" type="text" value="${escape(node.data.variable)}" aria-label="Variable name" /><label for="${prefix}-value">Value</label><input id="${prefix}-value" data-field="value" type="text" value="${escape(node.data.value)}" aria-label="Variable value" />`;
    if (node.type === "logicVariable") return `<label for="${prefix}-variable">Variable</label><input id="${prefix}-variable" data-field="variable" type="text" value="${escape(node.data.variable)}" aria-label="Variable name" /><label for="${prefix}-equals">Equals</label><input id="${prefix}-equals" data-field="equals" type="text" value="${escape(node.data.equals)}" aria-label="Expected value" />`;
    if (node.type === "actionMoveActor") return `<label for="${prefix}-dx">Move X</label><input id="${prefix}-dx" data-field="dx" type="number" step="1" value="${escape(node.data.dx)}" aria-label="Move actor horizontally" /><label for="${prefix}-dy">Move Y</label><input id="${prefix}-dy" data-field="dy" type="number" step="1" value="${escape(node.data.dy)}" aria-label="Move actor vertically" />`;
    return `<p class="control-hint">This node starts or routes graph logic.</p>`;
  }

  function renderInspector(ctx) {
    if (!ctx?.inspector) return;
    const data = graph();
    const node = selectedNode();
    if (!node) {
      ctx.inspector.innerHTML = `<p class="control-hint">No node selected.</p>`;
      return;
    }
    const prefix = `node-editor-${ctx.key}`;
    const selectedObject = api?.getSelectedNodeTriggerOption?.();
    const objectText = selectedObject ? `Selected object: ${escape(selectedObject.label)}` : "Select a scene object to attach trigger nodes.";
    const issueText = issuesByNode(data).get(node.id) || [];
    ctx.inspector.innerHTML = `<p class="control-hint node-editor-object-hint">${objectText}</p><div class="node-editor-inspector-head"><div><strong>${escape(nodeEffect(node))}</strong><span>${escape(nodeDetail(node))}</span></div><button type="button" class="node-editor-test-from" aria-label="Test from selected node in Play Mode">Test From Node</button></div>${issueText.length ? `<div class="node-editor-warning-box" role="status"><strong>Node Warning</strong><span>${escape(issueText.join(" "))}</span></div>` : ""}<div class="play-grid"><label for="${prefix}-type">Type</label><select id="${prefix}-type" data-field="type" aria-label="Node type"></select><label for="${prefix}-name">Name</label><input id="${prefix}-name" data-field="name" type="text" maxlength="48" value="${escape(node.name)}" aria-label="Node name" /></div><div class="play-grid node-editor-link-fields"></div><div id="${prefix}-fields" class="node-editor-fields">${fieldMarkup(node, prefix)}</div>`;
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
    makeSelect(`${prefix}-next`, "Next", node.next, data.nodes).forEach(item => linkFields.appendChild(item));
    makeSelect(`${prefix}-alt`, "Alt", node.alt, data.nodes).forEach(item => linkFields.appendChild(item));
    const message = ctx.inspector.querySelector(`[data-field="message"]`);
    if (message) message.value = node.data.message || "";
    const textLine = ctx.inspector.querySelector(`[data-field="textLine"]`);
    if (textLine) textLine.value = String(Number.isFinite(Number(node.data.textLine)) ? Number(node.data.textLine) : -1);
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
    node.next = ctx.inspector.querySelector(`[data-field="next"]`)?.value || "";
    node.alt = ctx.inspector.querySelector(`[data-field="alt"]`)?.value || "";
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
    return port === "alt" ? "Alt" : "Next";
  }

  function startConnection(event, id, port) {
    event.preventDefault();
    event.stopPropagation();
    const ctx = contextFromElement(event.currentTarget);
    const source = graph().nodes.find(node => node.id === id);
    if (!source || !ctx) return;
    connection = { source, port, ctx, x: event.clientX, y: event.clientY };
    select(id, true);
    ctx.board.classList.add("connecting", "node-editor-board-live");
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
      const hit = graph().nodes.find(node => p.x >= node.x && p.x <= node.x + 188 && p.y >= node.y && p.y <= node.y + 112);
      targetId = hit?.id || "";
    }
    if (targetId && targetId !== connection.source.id) {
      connection.source[connection.port] = targetId;
      selectedId = connection.source.id;
      graph().selectedId = selectedId;
      api.saveLocal();
      api.setStatus(`${portTitle(connection.port)} connection created.`);
    }
    connection.ctx.board.classList.remove("connecting", "node-editor-board-live");
    clearBoardMotion(connection.ctx);
    document.removeEventListener("pointermove", moveConnection, true);
    document.removeEventListener("pointerup", endConnection, true);
    connection = null;
    renderAllContexts();
  }

  function drawLine(ctx, x1, y1, x2, y2, faded = false, active = false, running = false) {
    const line = document.createElement("div");
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.className = `node-editor-link-line ${faded ? "alt" : ""} ${active ? "active-route" : ""} ${running ? "route-running" : ""}`;
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
      [[node.next, false], [node.alt, true]].forEach(([targetId, faded]) => {
        const target = byId.get(targetId);
        if (!target) return;
        drawLine(ctx, node.x + 188, node.y + 46, target.x, target.y + 46, faded, node.id === selectedId || target.id === selectedId, isLinkActive(node.id, target.id));
      });
    });
    if (connection?.ctx === ctx) {
      const p = boardPoint(ctx, connection.x, connection.y);
      const line = document.createElement("div");
      const x1 = connection.source.x + 188;
      const y1 = connection.source.y + (connection.port === "alt" ? 66 : 42);
      const length = Math.hypot(p.x - x1, p.y - y1);
      const angle = Math.atan2(p.y - y1, p.x - x1) * 180 / Math.PI;
      line.className = "node-editor-link-preview";
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
    const actionItems = runtimeState.actions.length ? runtimeState.actions.map(item => `<li>${escape(item)}</li>`).join("") : `<li>No node actions have run yet.</li>`;
    const logItems = runtimeLog.length ? runtimeLog.map(item => `<li>${escape(item)}</li>`).join("") : `<li>Press Run in the top tester, touch a bound object, or use Test From Node here.</li>`;
    const variableEntries = Object.entries(data.runtime?.variables || {}).slice(0, 5);
    const variableText = variableEntries.length ? variableEntries.map(([key, value]) => `${key}=${value}`).join(" · ") : "No variables set";
    ctx.runtime.innerHTML = `<div class="node-editor-section-head"><strong>Node Activity</strong><span>${escape(playTesterStateLabel())}</span></div><div class="node-editor-activity-grid" aria-live="polite"><div><strong>Current Node</strong><span>${escape(runtimeState.currentLabel || "None")}</span></div><div><strong>Last Triggered</strong><span>${escape(runtimeState.lastTrigger || "None")}</span></div><div><strong>Next Nodes</strong><span>${escape(nextLabels.length ? nextLabels.join(" · ") : "No queued route")}</span></div><div><strong>Variables</strong><span>${escape(variableText)}</span></div></div><div class="node-editor-log-columns"><div><strong>Actions Run</strong><ul>${actionItems}</ul></div><div><strong>Tester Log</strong><ul>${logItems}</ul></div></div><p class="sr-only">This activity panel updates when Play Mode fires node events, runs node actions, changes variables, or queues the next route.</p>`;
  }

  function renderCheck(ctx) {
    if (!ctx?.check) return;
    const issues = computeGraphIssues();
    const rows = issues.slice(0, 8).map((issue, index) => `<li>${issue.id ? `<button type="button" data-node-issue="${escape(issue.id)}">Open</button>` : ""}<span>${escape(issue.text)}</span></li>`).join("");
    ctx.check.innerHTML = `<div class="node-editor-section-head"><strong>Node Warnings</strong><span>${issues.length ? `${issues.length} found` : "Clear"}</span></div>${issues.length ? `<ul>${rows}</ul>` : `<p class="node-editor-bind-note">No broken node warnings found. Every visible warning is tied to reachability, missing routes, missing objects, or missing Text Events.</p>`}<p class="sr-only">Broken node warnings identify nodes that may not affect the game while players test or export it.</p>`;
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

  function renderGuide(ctx) {
    if (!ctx?.guide) return;
    const data = graph();
    const node = selectedNode();
    const selectedObject = api?.getSelectedNodeTriggerOption?.();
    const objectCopy = selectedObject ? `${selectedObject.label || selectedObject.id}` : "No scene object selected yet";
    const objectHint = selectedObject ? "Bind it, then press Run above and walk into it." : "Select an object on the canvas or in Scene Objects.";
    const nodeCopy = node ? `${TYPES[node.type] || "Node"}: ${node.name || "Untitled"}` : "No node selected";
    const nodes = data.nodes || [];
    const triggerCount = nodes.filter(item => item.type === "eventTrigger").length;
    const messageCount = nodes.filter(item => item.type === "actionMessage" || item.type === "actionDialogue").length;
    const issueCount = computeGraphIssues(data).length;
    ctx.guide.innerHTML = `<div class="node-editor-tester-bridge" aria-label="How nodes connect to the Play Mode tester"><div><strong>1. Run the top tester</strong><span>Scene Start nodes fire as soon as the Play Mode Run button starts.</span></div><div><strong>2. Touch bound objects</strong><span>Trigger Enter nodes fire when the actor overlaps their selected object.</span></div><div><strong>3. Watch the canvas</strong><span>Messages, dialogue, actor moves, checkpoints, and finish actions show in the top preview.</span></div></div><div class="node-editor-status-strip" aria-live="polite"><div><strong>Selected object</strong><span>${escape(objectCopy)}</span><small>${escape(objectHint)}</small></div><div><strong>Selected node</strong><span>${escape(nodeCopy)}</span><small>${escape(nodeDetail(node))}</small></div><div><strong>Node check</strong><span>${nodes.length} nodes · ${triggerCount} triggers · ${messageCount} text actions · ${issueCount} warnings</span><small>${escape(routeSummary(node, nodes))}</small></div></div>`;
  }

  function renderBindings(ctx) {
    if (!ctx?.bindings) return;
    const options = api?.getNodeTriggerOptions?.() || [];
    if (!options.length) {
      ctx.bindings.innerHTML = `<div class="node-editor-section-head"><strong>Object Bindings</strong><span>Step 1</span></div><p class="node-editor-bind-note">Place an object in Play Mode first. Then this section will give you one-click Trigger Enter nodes for the tester.</p><ol class="node-editor-mini-steps"><li>Choose a frame in Place Frame Art.</li><li>Click Place Object.</li><li>Use Make Node here or in Scene Objects.</li></ol><p class="sr-only">No Play Mode objects are available for node binding.</p>`;
      return;
    }
    ctx.bindings.innerHTML = `<div class="node-editor-section-head"><strong>Object Bindings</strong><span>Scene object → Trigger Enter</span></div><p class="node-editor-bind-note">Each row mirrors a Play Mode object. Bound rows fire while the top tester is running and the actor touches that object.</p>`;
    options.forEach(option => {
      const count = nodeCountForTrigger(option.id);
      const row = document.createElement("div");
      row.className = `node-editor-binding-row ${count ? "bound" : ""}`;
      const labelWrap = document.createElement("span");
      labelWrap.innerHTML = `<span>${escape(option.label || option.id)}</span><small>${count ? `${count} bound trigger node${count === 1 ? "" : "s"} · touch in tester to fire` : "Not wired yet · make a Trigger Enter node"}</small>`;
      const action = document.createElement("button");
      action.type = "button";
      action.textContent = count ? "Open Trigger" : "Make Trigger";
      action.setAttribute("aria-label", `${count ? "Open" : "Create"} node trigger for ${option.label || option.id}`);
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
    graph().nodes.forEach(node => {
      const issueText = nodeIssues.get(node.id) || [];
      const item = document.createElement("div");
      item.className = `node-editor-node ${node.id === selectedId ? "active" : ""} ${EVENT_TYPES.has(node.type) ? "event" : ""} ${isActive(node.id) ? "running" : ""} ${node.id === highlightedId ? "just-created" : ""} ${node.id === settlingId ? "settling" : ""} ${node.type === "eventTrigger" && node.data.trigger && node.data.trigger !== "any" ? "bound" : ""} ${issueText.length ? "warning" : ""}`;
      item.style.left = `${Math.round(node.x)}px`;
      item.style.top = `${Math.round(node.y)}px`;
      item.dataset.nodeId = node.id;
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `${label(node)} node. Effect: ${nodeEffect(node)}. ${issueText.length ? `Warning: ${issueText.join(" ")}` : "No warnings."} Drag to move. Use Next or Alt to connect.`);
      item.setAttribute("aria-pressed", String(node.id === selectedId));
      const body = document.createElement("div");
      body.className = "node-editor-node-body";
      const title = document.createElement("strong");
      title.textContent = node.name;
      const type = document.createElement("span");
      type.textContent = TYPES[node.type] || "Node";
      const effect = document.createElement("span");
      effect.className = "node-editor-node-effect";
      effect.textContent = nodeEffect(node);
      const routes = document.createElement("span");
      routes.textContent = nodeDetail(node);
      const flow = document.createElement("span");
      flow.className = "node-editor-node-route";
      flow.textContent = issueText.length ? issueText[0] : routeSummary(node);
      body.append(title, type, effect, routes, flow);
      const ports = document.createElement("div");
      ports.className = "node-editor-ports";
      ["next", "alt"].forEach(port => {
        const portButton = document.createElement("button");
        portButton.type = "button";
        portButton.className = `node-editor-port ${port}`;
        portButton.innerHTML = `${portTitle(port)}<span class="sr-only"> connection from ${escape(node.name)}</span>`;
        portButton.setAttribute("aria-label", `Create ${portTitle(port)} connection from ${node.name}`);
        portButton.addEventListener("pointerdown", event => startConnection(event, node.id, port));
        ports.appendChild(portButton);
      });
      item.append(body, ports);
      item.addEventListener("click", event => {
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
    const node = normalizeNode({ id: makeId(type), type, name: TYPES[type], x: (anchor?.x ?? 40) + 260, y: (anchor?.y ?? 40) + 34, data: {} }, data.nodes.length);
    data.nodes.push(node);
    if (anchor && !anchor.next && !EVENT_TYPES.has(node.type)) anchor.next = node.id;
    selectedId = node.id;
    data.selectedId = node.id;
    renderAllContexts();
    api.saveLocal();
    api.setStatus(`${TYPES[type]} node added.`);
  }

  function makeAddMenu(ctx) {
    const menu = document.createElement("details");
    menu.className = "node-add-menu";
    const summary = document.createElement("summary");
    summary.textContent = "Add Node";
    summary.setAttribute("aria-label", "Add node");
    const panel = document.createElement("div");
    panel.className = "node-add-panel";
    panel.setAttribute("role", "menu");
    NODE_GROUPS.forEach(group => {
      const groupWrap = document.createElement("div");
      groupWrap.className = "node-add-group";
      const heading = document.createElement("strong");
      heading.textContent = group.label;
      groupWrap.appendChild(heading);
      group.items.forEach(([type, name]) => {
        const item = document.createElement("button");
        item.type = "button";
        item.textContent = name;
        item.setAttribute("role", "menuitem");
        item.setAttribute("aria-label", `Add ${name} node`);
        item.addEventListener("click", () => {
          menu.open = false;
          addNode(type);
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
    if (!option?.id) { api.setStatus("Select or place a Play Mode object before creating a node trigger."); return false; }
    api?.selectNodeTriggerObject?.(option.index);
    const data = graph();
    let event = data.nodes.find(node => node.type === "eventTrigger" && String(node.data.trigger || "") === String(option.id));
    if (!event) {
      const baseX = 56 + Math.min(data.nodes.length, 6) * 28;
      event = normalizeNode({ id: makeId("trigger"), type: "eventTrigger", name: option.id, x: baseX, y: 180 + Math.min(data.nodes.length, 6) * 22, data: { trigger: option.id } }, data.nodes.length);
      const action = normalizeNode({ id: makeId("message"), type: "actionMessage", name: `${option.id} Message`, x: event.x + 270, y: event.y, data: { message: `${option.id} triggered.` } }, data.nodes.length + 1);
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
    api.setStatus(`Node trigger attached to ${option.label || option.id}.`);
    showNode(event.id);
    return true;
  }

  function attachSelectedObject() {
    const node = selectedNode();
    const option = api?.getSelectedNodeTriggerOption?.();
    if (!option?.id) { api.setStatus("Select a Play Mode object first."); return; }
    if (!node || node.type !== "eventTrigger") { createTriggerForObject(option); return; }
    node.data.trigger = option.id;
    node.name = option.id;
    renderAllContexts();
    api.saveLocal();
    logRuntime(`Attached ${option.label || option.id}.`);
    api.setStatus(`Selected trigger node attached to ${option.label || option.id}.`);
    showNode(node.id);
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
      const nextId = node.next || node.alt || "";
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
    api.setStatus("Node deleted.");
  }

  function resetGraph() {
    const data = defaultGraph();
    api.getState().playMode.nodeEditor = data;
    selectedId = data.selectedId;
    lastEntered = new Set();
    renderAllContexts();
    api.saveLocal();
    api.setStatus("Node graph reset.");
  }

  function clearConnection() {
    const node = selectedNode();
    if (!node) return;
    node.next = "";
    node.alt = "";
    renderAllContexts();
    api.saveLocal();
    api.setStatus("Node connections cleared.");
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
    if (moved) api.setStatus("Node moved.");
  }

  function makeActions(ctx) {
    if (!ctx?.actions || ctx.actions.dataset.ready) return;
    ctx.actions.dataset.ready = "true";
    const buildControls = [
      makeAddMenu(ctx),
      button("Bind Object", "create or attach a Trigger Enter node for the selected Play Mode object", attachSelectedObject)
    ];
    const testControls = [
      button("Test Node", "test from the selected node in the top Play Mode canvas", runSelectedNode),
      button("Test Start", "fire the Scene Start event without starting the full tester", runSceneStart)
    ];
    const mapControls = [
      button("Wrangle", "repair bindings, add missing playable routes, and arrange the node map", wrangleGraph),
      button("Clear Links", "clear selected node connections", clearConnection)
    ];
    const extraControls = [
      button("Delete Node", "delete selected node", deleteNode),
      button("Reset Graph", "reset node graph", resetGraph)
    ];
    if (ctx.key === "inline") extraControls.unshift(button("Large View", "open large node editor", openOverlay));
    const more = document.createElement("details");
    more.className = "node-editor-action-more";
    const summary = document.createElement("summary");
    summary.textContent = "More";
    summary.setAttribute("aria-label", "Show more node editor tools");
    const panel = document.createElement("div");
    panel.className = "node-editor-action-more-panel";
    panel.append(...extraControls);
    more.append(summary, panel);
    ctx.actions.setAttribute("aria-label", "Node editor toolbar grouped by build, test, map, and more tools");
    ctx.actions.append(
      actionGroup("Build", buildControls),
      actionGroup("Test", testControls),
      actionGroup("Map", mapControls),
      more
    );
  }

  function renderContext(ctx) {
    if (!ctx) return;
    makeActions(ctx);
    renderGuide(ctx);
    renderRuntime(ctx);
    renderCheck(ctx);
    renderBindings(ctx);
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
      card.innerHTML = `<h3><span class="drag-handle" aria-hidden="true">↕</span> Play Mode Logic</h3><p class="control-hint" id="node-editor-help">Build the logic that powers the tester at the top. Start with Scene Start or bind a scene object, then connect actions to see them happen on the Play Mode canvas.</p><p class="node-editor-beta-note" id="node-editor-beta-note">Still in beta; expect a few rough edges.</p><div class="node-editor-guide"></div><div class="button-row action-row play-actions node-editor-actions"></div><div class="node-editor-bindings" aria-label="Play Mode object bindings"></div><div class="node-editor-runtime" aria-live="polite"></div><div class="node-editor-check" aria-live="polite"></div><div class="node-editor-workspace"><div class="node-editor-board" role="application" tabindex="0" aria-label="Visual Play Mode node graph" aria-describedby="node-editor-help node-editor-beta-note"><div class="node-editor-nodes"></div></div><div class="node-editor-inspector" aria-label="Selected node inspector"></div></div>`;
      const sceneObjectsCard = grid.querySelector('[data-dock-id="play-scene-objects"]');
      if (sceneObjectsCard) sceneObjectsCard.after(card);
      else grid.appendChild(card);
    }
    return {
      key: "inline",
      root: card,
      board: card.querySelector(".node-editor-board"),
      nodeLayer: card.querySelector(".node-editor-nodes"),
      inspector: card.querySelector(".node-editor-inspector"),
      actions: card.querySelector(".node-editor-actions"),
      guide: card.querySelector(".node-editor-guide"),
      runtime: card.querySelector(".node-editor-runtime"),
      check: card.querySelector(".node-editor-check"),
      bindings: card.querySelector(".node-editor-bindings")
    };
  }

  function buildOverlay() {
    let overlay = document.getElementById("node-editor-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "node-editor-overlay";
      overlay.className = "modal-overlay";
      overlay.hidden = true;
      overlay.innerHTML = `<div class="modal-card node-editor-large" role="dialog" aria-modal="true" aria-labelledby="node-editor-large-title"><div class="modal-head"><h2 id="node-editor-large-title">Play Mode Logic</h2><button type="button" class="node-editor-close" aria-label="Close large node editor">Close<span class="sr-only"> large node editor</span></button></div><p class="control-hint" id="node-editor-large-help">Large graph view for the Play Mode tester. Run above fires Scene Start; touching bound objects fires Trigger Enter; actions show on the top canvas.</p><p class="node-editor-beta-note" id="node-editor-large-beta-note">Still in beta; expect a few rough edges.</p><div class="node-editor-guide"></div><div class="button-row action-row play-actions node-editor-actions"></div><div class="node-editor-bindings" aria-label="Large Play Mode object bindings"></div><div class="node-editor-runtime" aria-live="polite"></div><div class="node-editor-check" aria-live="polite"></div><div class="node-editor-workspace"><div class="node-editor-board node-editor-large-board" role="application" tabindex="0" aria-label="Large visual Play Mode node graph" aria-describedby="node-editor-large-help node-editor-large-beta-note"><div class="node-editor-nodes"></div></div><div class="node-editor-inspector" aria-label="Large selected node inspector"></div></div></div>`;
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
      guide: overlay.querySelector(".node-editor-guide"),
      runtime: overlay.querySelector(".node-editor-runtime"),
      check: overlay.querySelector(".node-editor-check"),
      bindings: overlay.querySelector(".node-editor-bindings")
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

  function executeNode(id, payload = {}, seen = new Set()) {
    const data = graph();
    const node = data.nodes.find(item => item.id === id);
    if (!node || seen.has(id) || seen.size > 40) return;
    seen.add(id);
    pulseNode(id);
    logRuntime(`Ran ${TYPES[node.type] || "Node"}: ${node.name || id}.`);
    let nextId = node.next;
    const actions = [...(runtimeState.actions || [])];
    function addAction(copy) {
      actions.unshift(copy);
      actions.splice(6);
    }
    if (node.type === "actionMessage") {
      const textEventMessage = Number(node.data.textLine) >= 0 ? api.getTextEventMessage?.(Number(node.data.textLine)) : "";
      api.showPlayMessage?.(textEventMessage || node.data.message || node.name || "Message");
      addAction(`Showed text from ${node.name}.`);
    }
    if (node.type === "actionFinish") {
      api.finishPlayMode?.(node.data.message || "Finished.");
      addAction(`Finished route at ${node.name}.`);
      nextId = "";
    }
    if (node.type === "actionDialogue") {
      api.startPlayDialogue?.(Math.max(0, Number(node.data.line) || 0));
      addAction(`Started dialogue at ${textEventLabel(node.data.line)}.`);
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
    if (node.type === "logicVariable") {
      const matched = String(data.runtime.variables[node.data.variable] ?? "") === String(node.data.equals);
      nextId = matched ? node.next : node.alt;
      addAction(`Checked ${node.data.variable}: ${matched ? "true" : "false"}.`);
    }
    const nextIds = nextId ? [nextId] : [];
    setRuntimeState({ currentId: node.id, currentLabel: label(node), actions, nextIds });
    if (nextId) {
      pulseLink(node.id, nextId);
      window.setTimeout(() => executeNode(nextId, payload, seen), 0);
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
    if (nodes.length) logRuntime(`${type === "triggerEnter" ? "Trigger" : "Event"} fired${payload?.name ? `: ${payload.name}` : ""}.`);
    if (nodes.length) setRuntimeState({ lastTrigger: type === "triggerEnter" ? `Trigger Enter: ${payload?.name || "any"}` : "Scene Start" });
    nodes.forEach(node => {
      const nextId = node.next || node.alt || "";
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
    const actorTouch = expandRect(runtime.actor, 8);
    (runtime.props || []).forEach(prop => {
      if (!rectsOverlap(actorTouch, prop.rect)) return;
      const triggerId = prop.prop?.nodeTriggerId || `prop-${prop.index + 1}`;
      const ids = [triggerId, `prop-${prop.index + 1}`, `prop-${prop.index}`, "any"];
      ids.forEach(id => entered.add(id));
      if (!lastEntered.has(triggerId)) runEvent("triggerEnter", { id: triggerId, name: triggerId, ids, prop });
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
      x: (anchor?.x ?? 56) + 270,
      y: (anchor?.y ?? 88) + 24,
      data: kind === "dialogue" ? { line: index } : { textLine: index, message: option.text || "Message shown." }
    }, data.nodes.length);
    data.nodes.push(node);
    if (anchor && !anchor.next && !EVENT_TYPES.has(node.type)) anchor.next = node.id;
    selectedId = node.id;
    data.selectedId = node.id;
    renderAllContexts();
    api.saveLocal();
    api.setStatus(`${kind === "dialogue" ? "Dialogue" : "Message"} node created from Text Events.`);
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
    api.setStatus("Text Event attached to selected node.");
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
    data.runtime.variables = data.runtime.variables && typeof data.runtime.variables === "object" ? data.runtime.variables : {};
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
