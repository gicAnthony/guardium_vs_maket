// The comparison hub. Default view is the DOM side-by-side table (owned by
// VA_COMPARE); this scene supplies two canvas-driven alternate views (radar,
// grouped bars) that share the same filter-chip selection. Every vendor
// keeps a fixed slot/axis position so toggling a filter shrinks its shape
// to zero rather than reflowing the whole chart.
class ArenaScene extends Phaser.Scene {
  constructor() {
    super("Arena");
  }

  create() {
    const C = window.VA_CHROME;
    const content = window.VA_CONTENT;
    this.cameras.main.fadeIn(220, 255, 255, 255);
    window.VA_NAV.setActive("Arena");

    C.drawBackdrop(this);

    this.AXES = content.AXES;
    this.VENDORS = content.VENDORS;
    this.guardium = this.VENDORS.find((v) => v.pinned);
    this.competitors = this.VENDORS.filter((v) => !v.pinned);

    // ---- Header ----
    this.add.text(40, 26, "THE ARENA".toUpperCase(), {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "700",
      color: "#E08E00", letterSpacing: 2,
    });
    this.add.text(40, 46, "Capability Comparison", {
      fontFamily: "Inter, sans-serif", fontSize: "26px", fontStyle: "800", color: "#0B2545",
    });
    this.add.text(40, 80, "How gic-iam stacks up against Okta, Ping Identity, Descope, and Keycloak, side by side.", {
      fontFamily: "Inter, sans-serif", fontSize: "13.5px", color: "#5B6B7F",
    });

    const howBtn = C.makeButton(this, C.GAME_W - 130, 50, 220, 42, "How it works →", { filled: false });
    howBtn.button.on("pointerdown", () => {
      const d = content.DIAGRAMS.requestFlow;
      window.VA_MODAL.open(d.title, d.source, d.caption);
    });

    // ---- Radar setup ----
    this.cx = C.GAME_W / 2;
    this.cy = 410;
    this.R = 255;

    this.radarRoot = this.add.container(0, 0);
    this.gridGraphics = this.add.graphics();
    this.drawRadarGrid();
    this.radarRoot.add(this.gridGraphics);

    this.labelZones = [];
    this.AXES.forEach((axis, i) => {
      const ang = this.angleFor(i);
      const lx = this.cx + (this.R + 50) * Math.cos(ang);
      const ly = this.cy + (this.R + 50) * Math.sin(ang);
      const label = this.add.text(lx, ly, axis, {
        fontFamily: "Inter, sans-serif", fontSize: "13px", fontStyle: "700", color: "#14406B",
        align: "center", wordWrap: { width: 130 },
      }).setOrigin(0.5);
      const zone = this.add.circle(lx, ly, 36, 0xffffff, 0).setInteractive({ useHandCursor: true });
      zone.on("pointerover", () => { label.setColor("#E08E00"); this.showAxisDetail(axis, i); });
      zone.on("pointerout", () => { label.setColor("#14406B"); this.hideDetail(); });
      this.labelZones.push(zone);
      this.radarRoot.add([label, zone]);
    });

    this.radarGraphics = this.add.graphics();
    this.radarRoot.add(this.radarGraphics);

    // ---- Bars setup ----
    this.barsRoot = this.add.container(0, 0);
    this.plotX0 = 110; this.plotX1 = C.GAME_W - 90;
    this.plotY0 = 150; this.plotY1 = 610;
    this.barsGridGraphics = this.add.graphics();
    this.drawBarsGrid();
    this.barsRoot.add(this.barsGridGraphics);
    this.barsGraphics = this.add.graphics();
    this.barsRoot.add(this.barsGraphics);

    const catW = (this.plotX1 - this.plotX0) / this.AXES.length;
    this.AXES.forEach((axis, i) => {
      const x = this.plotX0 + catW * (i + 0.5);
      const label = this.add.text(x, this.plotY1 + 18, axis, {
        fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "700", color: "#14406B",
        align: "center", wordWrap: { width: catW - 8 },
      }).setOrigin(0.5, 0);
      this.barsRoot.add(label);
    });

    // ---- Shared legend row (radar + bars) ----
    this.legendRoot = this.add.container(0, 0);
    this.legendItems = {};
    const legendVendors = [this.guardium, ...this.competitors];
    const lw = 200;
    const totalLw = legendVendors.length * lw;
    const lx0 = this.cx - totalLw / 2 + lw / 2;
    legendVendors.forEach((v, i) => {
      const item = this.add.container(lx0 + i * lw, 700);
      const dot = this.add.circle(-58, 0, 6, v.color);
      const txt = this.add.text(-46, 0, v.name, {
        fontFamily: "Inter, sans-serif", fontSize: "13px", fontStyle: "700", color: "#0B2545",
      }).setOrigin(0, 0.5);
      item.add([dot, txt]);
      this.legendRoot.add(item);
      this.legendItems[v.key] = item;
    });

    // ---- Tween state (per vendor, per axis) ----
    this.radarState = {};
    this.barState = {};
    this.VENDORS.forEach((v) => {
      this.radarState[v.key] = {};
      this.barState[v.key] = {};
      this.AXES.forEach((_, i) => {
        this.radarState[v.key]["a" + i] = 0;
        this.barState[v.key]["h" + i] = 0;
      });
    });

    this.unsubscribe = window.VA_COMPARE.onChange(() => this.applySelection(true));
    window.VA_COMPARE.show();
    this.setViewMode(window.VA_COMPARE.getViewMode());
    this.applySelection(false);

    this.events.once("shutdown", () => {
      this.hideDetail();
      window.VA_COMPARE.hide();
      if (this.unsubscribe) this.unsubscribe();
    });
  }

  angleFor(i) {
    return (Math.PI * 2 * i) / this.AXES.length - Math.PI / 2;
  }

  drawRadarGrid() {
    const C = window.VA_CHROME;
    const g = this.gridGraphics;
    g.clear();
    for (let ring = 1; ring <= 5; ring++) {
      const r = (ring / 5) * this.R;
      g.lineStyle(1, C.COLORS.navy100, 1);
      g.beginPath();
      this.AXES.forEach((_, i) => {
        const ang = this.angleFor(i);
        const x = this.cx + r * Math.cos(ang), y = this.cy + r * Math.sin(ang);
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      });
      g.closePath();
      g.strokePath();
    }
    g.lineStyle(1, C.COLORS.navy100, 1);
    this.AXES.forEach((_, i) => {
      const ang = this.angleFor(i);
      g.beginPath();
      g.moveTo(this.cx, this.cy);
      g.lineTo(this.cx + this.R * Math.cos(ang), this.cy + this.R * Math.sin(ang));
      g.strokePath();
    });
  }

  drawBarsGrid() {
    const C = window.VA_CHROME;
    const g = this.barsGridGraphics;
    g.clear();
    g.lineStyle(1, C.COLORS.navy100, 1);
    for (let v = 0; v <= 5; v++) {
      const y = this.plotY1 - (v / 5) * (this.plotY1 - this.plotY0);
      g.beginPath();
      g.moveTo(this.plotX0, y);
      g.lineTo(this.plotX1, y);
      g.strokePath();
      const t = this.add.text(this.plotX0 - 14, y, String(v), {
        fontFamily: "Inter, sans-serif", fontSize: "11px", fontStyle: "600", color: "#5B6B7F",
      }).setOrigin(1, 0.5);
      this.barsRoot.add(t);
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.radarRoot.setVisible(mode === "radar");
    this.barsRoot.setVisible(mode === "bars");
    this.legendRoot.setVisible(mode === "radar" || mode === "bars");
  }

  applySelection(animate) {
    const selected = window.VA_COMPARE.getSelected();
    this.setViewMode(window.VA_COMPARE.getViewMode());
    const duration = animate ? 550 : 1;
    const delayBase = animate ? 0 : 250;

    this.VENDORS.forEach((v, vi) => {
      const included = v.pinned || selected.has(v.key);
      const radarTargets = {};
      const barTargets = {};
      this.AXES.forEach((_, i) => {
        const r = included ? (v.scores[i] / 5) * this.R : 0;
        const h = included ? (v.scores[i] / 5) * (this.plotY1 - this.plotY0) : 0;
        radarTargets["a" + i] = r;
        barTargets["h" + i] = h;
      });
      this.tweens.add({ targets: this.radarState[v.key], ...radarTargets, duration, delay: delayBase + vi * 60, ease: "Cubic.easeOut" });
      this.tweens.add({ targets: this.barState[v.key], ...barTargets, duration, delay: delayBase + vi * 60, ease: "Cubic.easeOut" });

      const item = this.legendItems[v.key];
      this.tweens.add({ targets: item, alpha: included ? 1 : 0.25, duration: 300 });
    });
  }

  showAxisDetail(axis, axisIndex) {
    const content = window.VA_CONTENT;
    const selected = window.VA_COMPARE.getSelected();
    const panel = document.getElementById("detail-panel");
    document.getElementById("detail-title").textContent = axis;

    const lines = [this.guardium.name + ": " + this.guardium.scores[axisIndex] + "/5"];
    this.competitors.forEach((v) => {
      if (selected.has(v.key)) lines.push(v.name + ": " + v.scores[axisIndex] + "/5");
    });
    document.getElementById("detail-body").textContent = lines.join("  ·  ") + ". " + (content.CATEGORY_DETAIL[axis] || "");
    panel.classList.add("visible");
  }

  hideDetail() {
    document.getElementById("detail-panel").classList.remove("visible");
  }

  update() {
    const C = window.VA_CHROME;

    if (this.viewMode === "radar") {
      const g = this.radarGraphics;
      g.clear();
      this.competitors.forEach((v) => this.drawRadarPolygon(g, v, 0.14, 2));
      this.drawRadarPolygon(g, this.guardium, 0.22, 3);
    } else if (this.viewMode === "bars") {
      this.drawBars();
    }
  }

  drawRadarPolygon(graphics, vendor, fillAlpha, lineWidth) {
    const state = this.radarState[vendor.key];
    let hasArea = false;
    const pts = this.AXES.map((_, i) => {
      const r = state["a" + i];
      if (r > 0.5) hasArea = true;
      const ang = this.angleFor(i);
      return { x: this.cx + r * Math.cos(ang), y: this.cy + r * Math.sin(ang) };
    });
    if (!hasArea) return;
    graphics.fillStyle(vendor.color, fillAlpha);
    graphics.lineStyle(lineWidth, vendor.color, 1);
    graphics.beginPath();
    pts.forEach((p, i) => { if (i === 0) graphics.moveTo(p.x, p.y); else graphics.lineTo(p.x, p.y); });
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
    pts.forEach((p) => graphics.fillStyle(vendor.color, 1).fillCircle(p.x, p.y, vendor.pinned ? 4 : 3));
  }

  drawBars() {
    const g = this.barsGraphics;
    g.clear();
    const catW = (this.plotX1 - this.plotX0) / this.AXES.length;
    const slotW = catW / this.VENDORS.length;
    const barW = slotW * 0.72;

    this.AXES.forEach((_, ai) => {
      const catX0 = this.plotX0 + catW * ai;
      this.VENDORS.forEach((v, vi) => {
        const h = this.barState[v.key]["h" + ai];
        if (h < 0.5) return;
        const x = catX0 + slotW * vi + (slotW - barW) / 2;
        const y = this.plotY1 - h;
        g.fillStyle(v.color, v.pinned ? 0.95 : 0.8);
        g.fillRoundedRect(x, y, barW, h, 3);
      });
    });
  }
}
