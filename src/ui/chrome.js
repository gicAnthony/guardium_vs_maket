// Shared visual "chrome" for every scene: palette, canvas size, backdrop
// motif, and a reusable button factory. Keeps scene files focused on their
// own visualization logic.
window.VA_CHROME = (function () {
  const COLORS = {
    white: 0xffffff,
    paper: 0xf5f7fa,
    navy900: 0x0b2545,
    navy800: 0x122c52,
    navy700: 0x14406b,
    navy100: 0xe7edf5,
    orange500: 0xf5a623,
    orange600: 0xe08e00,
    inkMuted: 0x5b6b7f,
    success: 0x2e9e6b,
    danger: 0xd6453d,
  };

  const GAME_W = 1280;
  const GAME_H = 760;

  function drawBackdrop(scene) {
    scene.add.rectangle(0, 0, GAME_W, GAME_H, COLORS.white).setOrigin(0, 0);

    const lines = scene.add.graphics();
    lines.setDepth(-10);
    for (let i = 0; i < 7; i++) {
      lines.lineStyle(1, COLORS.navy100, 0.55);
      const y = 60 + i * 105;
      lines.beginPath();
      lines.moveTo(0, y);
      for (let x = 0; x <= GAME_W; x += 40) {
        lines.lineTo(x, y + Math.sin(x / 95 + i) * 9);
      }
      lines.strokePath();
    }
    return lines;
  }

  function makeButton(scene, x, y, width, height, label, opts) {
    opts = opts || {};
    const filled = opts.filled !== false;
    const container = scene.add.container(x, y);

    const fillColor = opts.fillColor !== undefined ? opts.fillColor : COLORS.orange500;
    const hoverColor = opts.hoverColor !== undefined ? opts.hoverColor : COLORS.orange600;

    const bg = scene.add.rectangle(0, 0, width, height, filled ? fillColor : COLORS.white, 1)
      .setStrokeStyle(filled ? 0 : 1.5, opts.strokeColor !== undefined ? opts.strokeColor : COLORS.navy700)
      .setOrigin(0.5);
    if (height > 30) bg.setStrokeStyle(filled ? 0 : 1.5, opts.strokeColor !== undefined ? opts.strokeColor : COLORS.navy700);

    const txt = scene.add.text(0, 0, label, {
      fontFamily: "Inter, sans-serif",
      fontSize: opts.fontSize || "15px",
      fontStyle: "700",
      color: filled ? (opts.textColor || "#0B2545") : (opts.textColorOutline || "#14406B"),
    }).setOrigin(0.5);

    container.add([bg, txt]);
    container.setSize(width, height);
    bg.setInteractive({ useHandCursor: true });

    bg.on("pointerover", () => bg.setFillStyle(filled ? hoverColor : COLORS.navy100));
    bg.on("pointerout", () => bg.setFillStyle(filled ? fillColor : COLORS.white));

    container.setLabel = (text) => txt.setText(text);
    container.button = bg;
    container.label = txt;
    return container;
  }

  return { COLORS, GAME_W, GAME_H, drawBackdrop, makeButton };
})();
