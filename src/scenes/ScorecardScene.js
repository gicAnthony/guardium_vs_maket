// Bottom-line flip cards (one per vendor) + an animated roadmap timeline
// for what Guardium ships next. Both reuse the DOM #detail-panel for
// hover copy, same pattern as ArenaScene's axis labels.
class ScorecardScene extends Phaser.Scene {
  constructor() {
    super("Scorecard");
  }

  create() {
    const C = window.VA_CHROME;
    const content = window.VA_CONTENT;
    this.cameras.main.fadeIn(220, 255, 255, 255);
    window.VA_NAV.setActive("Scorecard");

    C.drawBackdrop(this);

    this.add.text(40, 32, "BOTTOM LINE".toUpperCase(), {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "700",
      color: "#E08E00", letterSpacing: 2,
    });
    this.add.text(40, 52, "Scorecard & Roadmap", {
      fontFamily: "Inter, sans-serif", fontSize: "28px", fontStyle: "800", color: "#0B2545",
    });
    this.add.text(C.GAME_W - 40, 60, "Click a card to flip it →", {
      fontFamily: "Inter, sans-serif", fontSize: "13px", fontStyle: "600", color: "#5B6B7F",
    }).setOrigin(1, 0.5);

    const vendors = content.VENDORS;
    const cardW = 224, cardH = 230, gap = 16;
    const totalW = vendors.length * cardW + (vendors.length - 1) * gap;
    const startX = (C.GAME_W - totalW) / 2 + cardW / 2;
    const cardY = 230;

    vendors.forEach((v, i) => this.buildFlipCard(startX + i * (cardW + gap), cardY, cardW, cardH, v, i));

    // ---- Roadmap timeline ----
    const railY = 462;
    this.add.text(C.GAME_W / 2, 362, "ON THE ROADMAP · NOT YET SHIPPED", {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "700",
      color: "#14406B", letterSpacing: 1.5,
    }).setOrigin(0.5);

    const railX0 = 220, railX1 = C.GAME_W - 220;
    this.add.rectangle(railX0, railY, railX1 - railX0, 3, C.COLORS.navy100).setOrigin(0, 0.5);
    this.progressRail = this.add.graphics();
    this.spark = this.add.circle(railX0, railY, 5, C.COLORS.orange500).setAlpha(0);
    this.sparkGlow = this.add.circle(railX0, railY, 10, C.COLORS.orange500, 0.35).setAlpha(0);

    const roadmap = content.ROADMAP;
    const nodeXs = roadmap.map((_, i) => railX0 + ((railX1 - railX0) * (i + 0.5)) / roadmap.length);

    const revealDuration = 1400;
    this.railState = { progress: 0 };
    this.tweens.add({
      targets: this.railState, progress: 1, duration: revealDuration, delay: 250, ease: "Sine.easeInOut",
    });
    this.railX0 = railX0;
    this.railX1 = railX1;
    this.railY = railY;

    this.sparkState = { t: 0 };
    this.tweens.add({
      targets: this.sparkState, t: 1, duration: 2400, delay: 250 + revealDuration + 200,
      ease: "Sine.easeInOut", repeat: -1, repeatDelay: 500,
    });

    roadmap.forEach((item, i) => {
      this.buildRoadmapNode(nodeXs[i], railY, item, i, (railX1 - railX0) / roadmap.length);
    });

    const govBtn = C.makeButton(this, C.GAME_W / 2, C.GAME_H - 44, 300, 46, "View governance workflow →", { filled: true });
    govBtn.button.on("pointerdown", () => {
      const d = content.DIAGRAMS.governanceFlow;
      window.VA_MODAL.open(d.title, d.source, d.caption);
    });

    this.events.once("shutdown", () => this.hideDetail());
  }

  buildFlipCard(x, y, w, h, vendor, index) {
    const C = window.VA_CHROME;
    const container = this.add.container(x, y);
    container.setScale(0, 1);
    container.setAlpha(0);

    // Front face.
    const frontBg = this.add.rectangle(0, 0, w, h, C.COLORS.paper).setStrokeStyle(1, C.COLORS.navy100);
    const accent = this.add.rectangle(-w / 2, -h / 2, w, 6, vendor.color).setOrigin(0, 0);
    const badge = this.add.circle(0, -34, 26, vendor.color);
    const badgeTxt = this.add.text(0, -34, vendor.name[0], {
      fontFamily: "Inter, sans-serif", fontSize: "20px", fontStyle: "800", color: "#FFFFFF",
    }).setOrigin(0.5);
    const name = this.add.text(0, 14, vendor.name, {
      fontFamily: "Inter, sans-serif", fontSize: "17px", fontStyle: "800", color: "#0B2545",
    }).setOrigin(0.5);
    const sub = this.add.text(0, 36, vendor.sub, {
      fontFamily: "Inter, sans-serif", fontSize: "11.5px", color: "#5B6B7F",
    }).setOrigin(0.5);
    const hint = this.add.text(0, h / 2 - 22, "Tap to flip ↻", {
      fontFamily: "Inter, sans-serif", fontSize: "11.5px", fontStyle: "600", color: "#14406B",
    }).setOrigin(0.5);
    const front = this.add.container(0, 0, [frontBg, accent, badge, badgeTxt, name, sub, hint]);

    // Back face.
    const backBg = this.add.rectangle(0, 0, w, h, C.COLORS.white).setStrokeStyle(1.5, vendor.color);
    const strengthLabel = this.add.text(-w / 2 + 16, -h / 2 + 16, "STRENGTH", {
      fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontStyle: "800", color: "#2E9E6B", letterSpacing: 1,
    });
    const strengthTxt = this.add.text(-w / 2 + 16, -h / 2 + 34, vendor.strength, {
      fontFamily: "Inter, sans-serif", fontSize: "11.5px", color: "#0B2545",
      wordWrap: { width: w - 32 }, lineSpacing: 3,
    });
    const gapLabel = this.add.text(-w / 2 + 16, 14, "GAP", {
      fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontStyle: "800", color: "#D6453D", letterSpacing: 1,
    });
    const gapTxt = this.add.text(-w / 2 + 16, 32, vendor.gap, {
      fontFamily: "Inter, sans-serif", fontSize: "11.5px", color: "#0B2545",
      wordWrap: { width: w - 32 }, lineSpacing: 3,
    });
    const back = this.add.container(0, 0, [backBg, strengthLabel, strengthTxt, gapLabel, gapTxt]);
    back.setVisible(false);

    container.add([front, back]);
    container.setSize(w, h);

    const hitZone = this.add.rectangle(0, 0, w, h, 0xffffff, 0).setInteractive({ useHandCursor: true });
    container.add(hitZone);

    let showingFront = true;
    let flipping = false;
    hitZone.on("pointerdown", () => {
      if (flipping) return;
      flipping = true;
      this.tweens.add({
        targets: container, scaleX: 0, duration: 160, ease: "Sine.easeIn",
        onComplete: () => {
          showingFront = !showingFront;
          front.setVisible(showingFront);
          back.setVisible(!showingFront);
          this.tweens.add({ targets: container, scaleX: 1, duration: 160, ease: "Sine.easeOut", onComplete: () => { flipping = false; } });
        },
      });
    });
    hitZone.on("pointerover", () => { (showingFront ? frontBg : backBg).setStrokeStyle(1.5, vendor.color); });
    hitZone.on("pointerout", () => { frontBg.setStrokeStyle(1, C.COLORS.navy100); backBg.setStrokeStyle(1.5, vendor.color); });

    this.tweens.add({
      targets: container, alpha: 1, scaleX: 1, duration: 360, delay: 90 + index * 70, ease: "Sine.easeOut",
    });

    return container;
  }

  buildRoadmapNode(x, y, item, index, colW) {
    const C = window.VA_CHROME;
    const r = 24;

    const node = this.add.circle(x, y, r, C.COLORS.navy900);
    node.setScale(0);
    const iconGraphics = this.add.graphics().setAlpha(0);
    const ring = this.add.circle(x, y, r + 8, 0xffffff, 0).setStrokeStyle(2, C.COLORS.orange500, 0).setInteractive({ useHandCursor: true });

    const delay = 280 + index * (1400 / 3.2);

    const stageTag = this.add.text(x, y - r - 26, item.stage, {
      fontFamily: "Inter, sans-serif", fontSize: "10.5px", fontStyle: "800", color: "#E08E00", letterSpacing: 1.5,
    }).setOrigin(0.5).setAlpha(0);

    const title = this.add.text(x, y + r + 14, item.title, {
      fontFamily: "Inter, sans-serif", fontSize: "14.5px", fontStyle: "800", color: "#0B2545",
    }).setOrigin(0.5).setAlpha(0);

    const tagline = this.add.text(x, y + r + 36, item.tagline, {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "700", color: "#14406B",
      align: "center", wordWrap: { width: colW - 30 }, lineSpacing: 3,
    }).setOrigin(0.5, 0).setAlpha(0);

    const detail = this.add.text(x, y + r + 36 + tagline.height + 10, item.detail, {
      fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#5B6B7F",
      align: "center", wordWrap: { width: colW - 30 }, lineSpacing: 3,
    }).setOrigin(0.5, 0).setAlpha(0);

    this.tweens.add({
      targets: node, scale: 1, duration: 280, delay, ease: "Back.easeOut",
      onStart: () => { node.setFillStyle(C.COLORS.orange500); },
      onComplete: () => { this.drawRoadmapIcon(iconGraphics, item.icon, x, y); },
    });
    this.tweens.add({ targets: iconGraphics, alpha: 1, duration: 200, delay: delay + 280 });
    this.tweens.add({ targets: stageTag, alpha: 1, y: y - r - 22, duration: 280, delay: delay + 60 });
    [title, tagline, detail].forEach((t, i) => {
      this.tweens.add({ targets: t, alpha: 1, duration: 280, delay: delay + 120 + i * 70 });
    });

    ring.on("pointerover", () => {
      ring.setStrokeStyle(2, C.COLORS.orange500, 1);
      this.tweens.add({ targets: node, scale: 1.08, duration: 140, ease: "Sine.easeOut" });
    });
    ring.on("pointerout", () => {
      ring.setStrokeStyle(2, C.COLORS.orange500, 0);
      this.tweens.add({ targets: node, scale: 1, duration: 140, ease: "Sine.easeOut" });
    });
  }

  // Small white glyphs drawn straight onto the medallion, no bitmap assets.
  drawRoadmapIcon(g, type, cx, cy) {
    g.clear();
    g.lineStyle(2.2, 0xffffff, 1);

    if (type === "key") {
      g.strokeCircle(cx - 9, cy, 5);
      g.beginPath(); g.moveTo(cx - 4, cy); g.lineTo(cx + 11, cy); g.strokePath();
      g.beginPath(); g.moveTo(cx + 5, cy); g.lineTo(cx + 5, cy + 5); g.strokePath();
      g.beginPath(); g.moveTo(cx + 11, cy); g.lineTo(cx + 11, cy + 6); g.strokePath();
    } else if (type === "network") {
      g.strokeCircle(cx, cy, 4);
      [-90, 30, 150].forEach((deg) => {
        const rad = Phaser.Math.DegToRad(deg);
        const x2 = cx + 12 * Math.cos(rad), y2 = cy + 12 * Math.sin(rad);
        g.beginPath();
        g.moveTo(cx + 4 * Math.cos(rad), cy + 4 * Math.sin(rad));
        g.lineTo(x2 - 2.5 * Math.cos(rad), y2 - 2.5 * Math.sin(rad));
        g.strokePath();
        g.strokeCircle(x2, y2, 2.5);
      });
    } else if (type === "radar") {
      g.strokeCircle(cx, cy, 10);
      g.strokeCircle(cx, cy, 5);
      g.fillStyle(0xffffff, 1).fillCircle(cx, cy, 1.8);
      const rad = Phaser.Math.DegToRad(-35);
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + 10 * Math.cos(rad), cy + 10 * Math.sin(rad));
      g.strokePath();
    }
  }

  hideDetail() {
    document.getElementById("detail-panel").classList.remove("visible");
  }

  update() {
    const C = window.VA_CHROME;
    const g = this.progressRail;
    g.clear();
    const w = (this.railX1 - this.railX0) * this.railState.progress;
    if (w > 0) {
      g.fillStyle(C.COLORS.orange500, 1);
      g.fillRect(this.railX0, this.railY - 1.5, w, 3);
    }

    if (this.railState.progress >= 1) {
      const t = this.sparkState.t;
      const x = this.railX0 + (this.railX1 - this.railX0) * t;
      const alpha = Math.sin(Math.PI * t);
      this.spark.setPosition(x, this.railY).setAlpha(alpha);
      this.sparkGlow.setPosition(x, this.railY).setAlpha(alpha * 0.35);
    }
  }
}
