// Mermaid diagram modal controller. Mermaid renders SVG/DOM, so it lives
// outside the Phaser canvas in a plain overlay. Re-rendering on each open
// creates fresh DOM nodes, which naturally re-triggers the CSS "animate in
// + marching ants" keyframes defined in theme.css.
window.VA_MODAL = (function () {
  let mermaidReady = false;
  let renderCounter = 0;

  function ensureMermaid() {
    if (mermaidReady) return;
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#E7EDF5",
        primaryTextColor: "#0B2545",
        primaryBorderColor: "#14406B",
        lineColor: "#14406B",
        secondaryColor: "#F5A623",
        tertiaryColor: "#FFFFFF",
        fontFamily: "Inter, -apple-system, Segoe UI, sans-serif",
        fontSize: "18px",
      },
      flowchart: { curve: "basis", nodeSpacing: 60, rankSpacing: 80, padding: 16 },
    });
    mermaidReady = true;
  }

  async function open(title, mermaidSrc, caption) {
    ensureMermaid();
    const overlay = document.getElementById("modal-overlay");
    const titleEl = document.getElementById("modal-title");
    const captionEl = document.getElementById("modal-caption");
    const mermaidEl = document.getElementById("modal-mermaid");

    titleEl.textContent = title;
    captionEl.textContent = caption || "";
    mermaidEl.innerHTML = "Rendering diagram…";
    overlay.classList.add("open");

    try {
      const id = "va-mermaid-" + (renderCounter++);
      const { svg } = await mermaid.render(id, mermaidSrc);
      mermaidEl.innerHTML = svg;

      // Stagger node fade-in so the diagram reads as a sequence, not a
      // static dump: small per-node delay based on DOM order.
      const nodes = mermaidEl.querySelectorAll(".node");
      nodes.forEach((n, i) => {
        n.style.animationDelay = (i * 0.12) + "s";
      });
      const edges = mermaidEl.querySelectorAll(".edgePath path, .edgePaths path, .flowchart-link");
      edges.forEach((e, i) => {
        e.style.animationDelay = (i * 0.12 + 0.2) + "s, " + (i * 0.12 + 0.5) + "s";
      });
    } catch (err) {
      mermaidEl.innerHTML = "<p style='color:#D6453D'>Diagram failed to render.</p>";
      console.error("Mermaid render error:", err);
    }
  }

  function close() {
    document.getElementById("modal-overlay").classList.remove("open");
  }

  document.getElementById("modal-close").addEventListener("click", close);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  return { open, close };
})();
