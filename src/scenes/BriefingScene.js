// Plain-language executive summary: where Guardium stands today, where it
// is headed, and why that split matters to management. No jargon, no
// vendor-feature checklists; those live in Arena and Scorecard.
class BriefingScene extends Phaser.Scene {
  constructor() {
    super("Briefing");
  }

  create() {
    const C = window.VA_CHROME;
    const content = window.VA_CONTENT;
    const briefing = content.BRIEFING;
    this.cameras.main.fadeIn(220, 255, 255, 255);
    window.VA_NAV.setActive("Briefing");

    C.drawBackdrop(this);

    this.add.text(40, 26, "MANAGEMENT BRIEFING", {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "700",
      color: "#E08E00", letterSpacing: 2,
    });
    this.add.text(40, 46, "Where We Are, Where We're Going", {
      fontFamily: "Inter, sans-serif", fontSize: "26px", fontStyle: "800", color: "#0B2545",
    });
    this.add.text(40, 82, "Nobody else bundles login, permissions, oversight, and secrets handling together at zero licence cost. The trade-off is outside support and ready-made compliance proof.", {
      fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#5B6B7F",
      wordWrap: { width: 1200 }, lineSpacing: 4,
    });

    const colY = 148;
    const colLeftX = 40, colRightX = 660, colW = 580;

    this.add.rectangle(650, colY, 1, 410, C.COLORS.navy100).setOrigin(0.5, 0);

    this.add.text(colLeftX, colY, "WHERE WE ARE TODAY", {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "800", color: "#14406B", letterSpacing: 1.5,
    });
    this.add.text(colRightX, colY, "WHERE WE WANT TO BE", {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "800", color: "#E08E00", letterSpacing: 1.5,
    });

    this.buildColumn(colLeftX, colY + 30, colW, briefing.whereWeAre.points, C.COLORS.navy700, briefing.whereWeAre.footer, 0);
    this.buildColumn(colRightX, colY + 30, colW, briefing.whereWeWant.points, C.COLORS.orange500, briefing.whereWeWant.footer, 1);

    const roadmapBtn = C.makeButton(this, colRightX + colW - 120, colY + 392, 220, 38, "See the full roadmap →", { filled: false, fontSize: "12.5px" });
    roadmapBtn.setAlpha(0);
    this.tweens.add({ targets: roadmapBtn, alpha: 1, duration: 300, delay: 900 });
    roadmapBtn.button.on("pointerdown", () => window.VA_ROUTER.goTo("Scorecard"));

    // ---- Why it matters ----
    this.add.text(C.GAME_W / 2, 580, "WHY IT MATTERS", {
      fontFamily: "Inter, sans-serif", fontSize: "12px", fontStyle: "800", color: "#0B2545", letterSpacing: 1.5,
    }).setOrigin(0.5);

    const cards = briefing.whyItMatters;
    const cardW = 370, cardH = 110, gap = 25;
    const totalW = cards.length * cardW + (cards.length - 1) * gap;
    const startX = (C.GAME_W - totalW) / 2 + cardW / 2;
    const cardY = 650;

    cards.forEach((c, i) => this.buildWhyCard(startX + i * (cardW + gap), cardY, cardW, cardH, c, i));
  }

  buildColumn(x, startY, w, points, accentColor, footer, colIndex) {
    let cursorY = startY;
    points.forEach((p, i) => {
      const container = this.add.container(0, 0).setAlpha(0);
      const dot = this.add.circle(x + 6, cursorY + 8, 5, accentColor);
      const title = this.add.text(x + 24, cursorY, p.title, {
        fontFamily: "Inter, sans-serif", fontSize: "13.5px", fontStyle: "800", color: "#0B2545",
      });
      const body = this.add.text(x + 24, cursorY + 19, p.body, {
        fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#5B6B7F",
        wordWrap: { width: w - 24 }, lineSpacing: 3,
      });
      container.add([dot, title, body]);
      this.tweens.add({ targets: container, alpha: 1, duration: 320, delay: 120 + (colIndex * 4 + i) * 90, ease: "Sine.easeOut" });
      cursorY += 19 + body.height + 20;
    });

    const footerTxt = this.add.text(x + 24, cursorY + 4, footer, {
      fontFamily: "Inter, sans-serif", fontSize: "11.5px", fontStyle: "600", color: "#14406B",
      wordWrap: { width: w - 24 }, lineSpacing: 3,
    }).setAlpha(0);
    this.tweens.add({ targets: footerTxt, alpha: 1, duration: 300, delay: 900 });
  }

  buildWhyCard(x, y, w, h, item, index) {
    const C = window.VA_CHROME;
    const container = this.add.container(x, y).setAlpha(0);
    const bg = this.add.rectangle(0, 0, w, h, C.COLORS.paper).setStrokeStyle(1, C.COLORS.navy100);
    const accent = this.add.rectangle(-w / 2, -h / 2, 40, 5, C.COLORS.orange500).setOrigin(0, 0);
    const title = this.add.text(-w / 2 + 20, -h / 2 + 18, item.title, {
      fontFamily: "Inter, sans-serif", fontSize: "15px", fontStyle: "800", color: "#0B2545",
    });
    const body = this.add.text(-w / 2 + 20, -h / 2 + 42, item.body, {
      fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#5B6B7F",
      wordWrap: { width: w - 40 }, lineSpacing: 3,
    });
    container.add([bg, accent, title, body]);
    this.tweens.add({ targets: container, alpha: 1, y: y, duration: 360, delay: 700 + index * 110, ease: "Sine.easeOut", onStart: () => { container.y = y + 14; } });
  }
}
