// Persistent top navigation. Talks to window.VA_ROUTER (defined in main.js)
// to switch Phaser scenes, and reflects the active scene back into the UI.
window.VA_NAV = (function () {
  const buttons = Array.from(document.querySelectorAll("#topnav [data-nav]"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-nav");
      if (window.VA_ROUTER) window.VA_ROUTER.goTo(key);
    });
  });

  function setActive(key) {
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-nav") === key);
    });
  }

  return { setActive };
})();
