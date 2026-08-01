(() => {
  function create(options) {
    const {
      WorkflowFeatures,
      escapeHtml,
      freshProject,
      projectWidth,
      projectHeight,
      getState,
      applyRecoveredProject,
      resetEditorHistory,
      resetFrameSelection,
      syncControls,
      renderAll,
      saveLocal,
      saveLocalNow,
      setStatus,
      parseProjectAsync,
      removeImportedPrintLayers,
      serializeProject
    } = options;

    const documentTabs = document.querySelector("#document-tabs");
    const documentNewTabBtn = document.querySelector("#document-new-tab-btn");
    const recentProjectsBtn = document.querySelector("#recent-projects-btn");
    const recentProjectsOverlay = document.querySelector("#recent-projects-overlay");
    const closeRecentProjectsBtn = document.querySelector("#close-recent-projects-btn");
    const recentProjectList = document.querySelector("#recent-project-list");
    const recentProjectsStatus = document.querySelector("#recent-projects-status");
    let projectDocuments = [];
    let activeDocumentId = "";
    let documentSyncPaused = false;

    function projectDocumentName(filePath, fallback = "Untitled Project") {
      const name = String(filePath || "").split(/[\\/]/).pop()?.replace(/\.pxbuild$/i, "");
      return String(name || fallback || "Untitled Project").slice(0, 80);
    }

    function projectSnapshot(project) {
      return JSON.parse(JSON.stringify(project));
    }

    function currentProjectDocument() {
      return projectDocuments.find(documentRecord => documentRecord.id === activeDocumentId) || null;
    }

    function focusDocumentTab(documentId) {
      if (!documentId) return;
      const focus = () => document.getElementById(`document-tab-${documentId}`)?.focus();
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(focus);
      else focus();
    }

    function renderDocumentTabs(focusDocumentId = "") {
      if (!documentTabs) return;
      documentTabs.innerHTML = "";
      projectDocuments.forEach(documentRecord => {
        const active = documentRecord.id === activeDocumentId;
        const item = document.createElement("div");
        item.className = `document-tab${active ? " active" : ""}`;
        item.setAttribute("role", "presentation");
        const main = document.createElement("button");
        main.className = "document-tab-main";
        main.type = "button";
        main.id = `document-tab-${documentRecord.id}`;
        main.setAttribute("role", "tab");
        main.setAttribute("aria-selected", String(active));
        main.tabIndex = active ? 0 : -1;
        main.setAttribute("aria-label", `${documentRecord.name}${documentRecord.dirty ? ", unsaved changes" : ""}`);
        main.innerHTML = `${documentRecord.dirty ? '<span class="document-tab-dirty" aria-hidden="true"></span>' : ""}<span>${escapeHtml(documentRecord.name)}</span>`;
        main.onclick = () => switchProjectDocument(documentRecord.id);
        const close = document.createElement("button");
        close.className = "document-tab-close";
        close.type = "button";
        close.setAttribute("aria-label", `Close ${documentRecord.name}`);
        close.innerHTML = `×<span class="sr-only"> ${escapeHtml(documentRecord.name)}</span>`;
        close.onclick = event => { event.stopPropagation(); closeProjectDocument(documentRecord.id); };
        item.append(main, close);
        documentTabs.appendChild(item);
      });
      if (focusDocumentId) focusDocumentTab(focusDocumentId);
    }

    function syncActiveProjectDocument(markDirty = true) {
      if (documentSyncPaused) return;
      const documentRecord = currentProjectDocument();
      if (!documentRecord) return;
      documentSyncPaused = true;
      try {
        documentRecord.project = projectSnapshot(getState());
        if (markDirty) documentRecord.dirty = true;
        renderDocumentTabs();
      } finally {
        documentSyncPaused = false;
      }
    }

    function markActiveProjectDocumentDirty() {
      if (documentSyncPaused) return;
      const documentRecord = currentProjectDocument();
      if (!documentRecord || documentRecord.dirty) return;
      documentRecord.dirty = true;
      renderDocumentTabs();
    }

    function createProjectDocument(project, name = "Untitled Project", filePath = "", settings = {}) {
      if (projectDocuments.length >= 12) return setStatus("Close a project tab before opening another.");
      if (currentProjectDocument()) syncActiveProjectDocument(false);
      const documentRecord = {
        id: WorkflowFeatures.uid("document"),
        name: projectDocumentName(filePath, name),
        filePath: String(filePath || ""),
        project: projectSnapshot(project),
        dirty: settings.clean !== true
      };
      projectDocuments.push(documentRecord);
      activeDocumentId = documentRecord.id;
      documentSyncPaused = true;
      try {
        applyRecoveredProject(projectSnapshot(documentRecord.project));
        resetEditorHistory();
        resetFrameSelection();
        syncControls();
        renderAll({ persist: false });
      } finally {
        documentSyncPaused = false;
      }
      renderDocumentTabs();
      return documentRecord;
    }

    function switchProjectDocument(documentId) {
      if (documentId === activeDocumentId) return;
      const next = projectDocuments.find(documentRecord => documentRecord.id === documentId);
      if (!next) return;
      syncActiveProjectDocument(false);
      activeDocumentId = next.id;
      documentSyncPaused = true;
      try {
        applyRecoveredProject(projectSnapshot(next.project));
        resetEditorHistory();
        resetFrameSelection();
        syncControls();
        renderAll({ persist: false });
        saveLocalNow();
      } finally {
        documentSyncPaused = false;
      }
      renderDocumentTabs();
      setStatus(`${next.name} selected.`);
    }

    function closeProjectDocument(documentId) {
      const documentRecord = projectDocuments.find(item => item.id === documentId);
      if (!documentRecord) return;
      if (documentRecord.dirty && !window.confirm(`Close ${documentRecord.name} with unsaved changes?`)) return;
      const index = projectDocuments.indexOf(documentRecord);
      const wasActive = documentId === activeDocumentId;
      const closedName = documentRecord.name;
      projectDocuments.splice(index, 1);
      if (!projectDocuments.length) {
        createProjectDocument(freshProject(projectWidth(), projectHeight()), "Untitled Project", "", { clean: true });
        setStatus(`${closedName} closed. Untitled Project selected.`);
        return;
      }
      if (wasActive) {
        const next = projectDocuments[Math.min(index, projectDocuments.length - 1)];
        activeDocumentId = "";
        switchProjectDocument(next.id);
        focusDocumentTab(next.id);
        setStatus(`${closedName} closed. ${next.name} selected.`);
      } else {
        renderDocumentTabs(activeDocumentId);
        setStatus(`${closedName} closed.`);
      }
    }

    function setupProjectDocuments() {
      if (!projectDocuments.length) {
        const state = getState();
        projectDocuments.push({ id: WorkflowFeatures.uid("document"), name: state.name || "Untitled Project", filePath: "", project: projectSnapshot(state), dirty: false });
        activeDocumentId = projectDocuments[0].id;
      }
      window.PixelBugDocuments = { markDirty: markActiveProjectDocumentDirty, syncActive: () => syncActiveProjectDocument(true) };
      renderDocumentTabs();
    }

    async function saveProject() {
      const state = getState();
      const documentRecord = currentProjectDocument();
      const defaultName = documentRecord?.filePath ? documentRecord.filePath.split(/[\\/]/).pop() : `${WorkflowFeatures.safeFilename(documentRecord?.name || state.name || "project")}.pxbuild`;
      const result = await window.pixelBug.saveFile({ title: "Save Pixel Bug Project", defaultPath: defaultName, filters: [{ name: "Pixel Bug Project", extensions: ["pxbuild"] }], data: serializeProject(2) });
      if (result.ok) {
        saveLocal();
        if (documentRecord) {
          documentRecord.filePath = result.filePath || documentRecord.filePath;
          documentRecord.name = projectDocumentName(documentRecord.filePath, documentRecord.name);
          documentRecord.project = projectSnapshot(state);
          documentRecord.dirty = false;
          renderDocumentTabs();
        }
      }
      setStatus(result.ok ? "Project saved." : "Save cancelled.");
    }

    async function openProject() {
      const result = await window.pixelBug.openProject();
      if (!result.ok) return setStatus("Open cancelled.");
      try {
        const parsed = await parseProjectAsync(result.text);
        removeImportedPrintLayers(true);
        createProjectDocument(parsed, projectDocumentName(result.filePath), result.filePath, { clean: true });
        saveLocal();
        const documentRecord = currentProjectDocument();
        if (documentRecord) documentRecord.dirty = false;
        renderDocumentTabs();
        setStatus("Project opened in a new tab.");
      } catch (error) {
        setStatus(`Could not open project: ${error?.message || "invalid project"}.`);
      }
    }

    async function openRecentProjectsModal() {
      if (!recentProjectsOverlay || !recentProjectList || !recentProjectsStatus) return;
      recentProjectsOverlay.hidden = false;
      recentProjectsBtn?.setAttribute("aria-expanded", "true");
      recentProjectList.innerHTML = "";
      recentProjectsStatus.textContent = "Loading recent projects.";
      try {
        const recent = await window.pixelBug.listRecentProjects();
        if (!recent.length) {
          recentProjectList.innerHTML = '<p class="modal-note">No saved projects have been opened recently.</p>';
          recentProjectsStatus.textContent = "No recent projects.";
        } else {
          recent.forEach(item => {
            const row = document.createElement("div");
            row.className = "recent-project-row";
            const copy = document.createElement("div");
            copy.className = "recent-project-copy";
            const strong = document.createElement("strong");
            strong.textContent = item.name;
            const small = document.createElement("small");
            small.textContent = item.filePath;
            copy.append(strong, small);
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Open";
            button.setAttribute("aria-label", `Open recent project ${item.name}`);
            button.onclick = () => openRecentProjectItem(item);
            row.append(copy, button);
            recentProjectList.appendChild(row);
          });
          recentProjectsStatus.textContent = `${recent.length} recent project${recent.length === 1 ? "" : "s"}.`;
        }
      } catch (_error) {
        recentProjectsStatus.textContent = "Recent projects could not be loaded.";
      }
      closeRecentProjectsBtn?.focus();
    }

    function closeRecentProjectsModal() {
      if (!recentProjectsOverlay) return;
      recentProjectsOverlay.hidden = true;
      recentProjectsBtn?.setAttribute("aria-expanded", "false");
      recentProjectsBtn?.focus();
    }

    async function openRecentProjectItem(item) {
      try {
        const result = await window.pixelBug.openRecentProject(item.filePath);
        const parsed = await parseProjectAsync(result.text);
        createProjectDocument(parsed, item.name, result.filePath, { clean: true });
        closeRecentProjectsModal();
        setStatus(`${item.name} opened in a new tab.`);
      } catch (error) {
        if (recentProjectsStatus) recentProjectsStatus.textContent = error?.message || "Recent project could not be opened.";
      }
    }

    function setup() {
      setupProjectDocuments();
      recentProjectsBtn?.addEventListener("click", openRecentProjectsModal);
      closeRecentProjectsBtn?.addEventListener("click", closeRecentProjectsModal);
      recentProjectsOverlay?.addEventListener("click", event => { if (event.target === recentProjectsOverlay) closeRecentProjectsModal(); });
      documentNewTabBtn?.addEventListener("click", () => createProjectDocument(freshProject(projectWidth(), projectHeight()), "Untitled Project"));
      documentTabs?.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        const tabs = [...documentTabs.querySelectorAll('[role="tab"]')];
        const currentIndex = Math.max(0, tabs.indexOf(document.activeElement));
        let nextIndex = currentIndex;
        if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = Math.max(0, tabs.length - 1);
        if (!tabs[nextIndex]) return;
        event.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      });
    }

    return Object.freeze({
      closeProjectDocument,
      closeRecentProjectsModal,
      createProjectDocument,
      currentProjectDocument,
      openProject,
      openRecentProjectsModal,
      saveProject,
      setup,
      switchProjectDocument
    });
  }

  const api = Object.freeze({ create });
  if (typeof globalThis !== "undefined") globalThis.PixelBugDocumentWorkflow = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
