// Owns the Arena/Compare screen's shared state: which competitors are
// filtered in (Guardium is always present, never toggleable) and which
// visualization is active (table / radar / bars). Renders the DOM table
// itself; ArenaScene only needs to know the current selection + view mode
// to redraw its canvas visualizations, via onChange().
window.VA_COMPARE = (function () {
  const content = window.VA_CONTENT;
  const guardium = content.VENDORS.find((v) => v.pinned);
  const competitors = content.VENDORS.filter((v) => !v.pinned);

  let selected = new Set(competitors.map((v) => v.key)); // all shown by default
  let viewMode = "table";
  let listeners = [];

  function emit() {
    const snapshot = { selected: new Set(selected), viewMode };
    listeners.forEach((fn) => fn(snapshot));
  }

  function syncChipStyles() {
    document.querySelectorAll(".vendor-chip").forEach((btn) => {
      const key = btn.dataset.vendor;
      const v = competitors.find((c) => c.key === key);
      const active = selected.has(key);
      btn.classList.toggle("active", active);
      btn.style.borderColor = active ? v.colorHex : "";
    });
  }

  function buildChips() {
    const wrap = document.getElementById("compare-filters");
    wrap.innerHTML = "";
    competitors.forEach((v) => {
      const btn = document.createElement("button");
      btn.className = "vendor-chip";
      btn.dataset.vendor = v.key;
      btn.innerHTML = '<span class="dot" style="background:' + v.colorHex + '"></span>' + v.name;
      btn.addEventListener("click", () => {
        if (selected.has(v.key)) selected.delete(v.key); else selected.add(v.key);
        syncChipStyles();
        renderTable();
        emit();
      });
      wrap.appendChild(btn);
    });
    syncChipStyles();
  }

  function buildViewSwitch() {
    const buttons = document.querySelectorAll("#compare-view-switch button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewMode = btn.dataset.view;
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
        document.getElementById("compare-table-wrap").classList.toggle("visible", viewMode === "table");
        emit();
      });
    });
  }

  function renderTable() {
    const rows = content.TABLE_ROWS;
    const cols = [guardium, ...competitors.filter((v) => selected.has(v.key))];
    const table = document.getElementById("compare-table");

    const thead = "<thead><tr><th>Capability</th>" + cols.map((v) =>
      '<th><span class="th-dot" style="background:' + v.colorHex + '"></span>' + v.name + "</th>"
    ).join("") + "</tr></thead>";

    const tbody = "<tbody>" + rows.map((r) =>
      "<tr><td class=\"row-label\">" + r.label + "</td>" +
      cols.map((v) => "<td class=\"" + (v.pinned ? "is-guardium" : "") + "\">" + r[v.key] + "</td>").join("") +
      "</tr>"
    ).join("") + "</tbody>";

    table.innerHTML = thead + tbody;
  }

  function show() {
    document.body.classList.add("has-toolbar");
    document.getElementById("compare-table-wrap").classList.toggle("visible", viewMode === "table");
    renderTable();
  }

  function hide() {
    document.body.classList.remove("has-toolbar");
    document.getElementById("compare-table-wrap").classList.remove("visible");
  }

  function onChange(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter((f) => f !== fn); };
  }

  buildChips();
  buildViewSwitch();

  return {
    show,
    hide,
    onChange,
    getSelected: () => new Set(selected),
    getViewMode: () => viewMode,
  };
})();
