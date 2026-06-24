(function () {
  const C = window.VA_CHROME;

  const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: C.GAME_W,
    height: C.GAME_H,
    backgroundColor: "#ffffff",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, ArenaScene, ScorecardScene, BriefingScene],
  };

  const game = new Phaser.Game(config);

  window.VA_ROUTER = {
    transitioning: false,
    goTo(key, data) {
      if (this.transitioning) return;
      const actives = game.scene.getScenes(true);
      const current = actives[0];
      if (current && current.scene.key === key && !data) return;

      const finish = () => {
        // game.scene.start() on the global manager does not stop other
        // running scenes by itself, so stop everything explicitly: scenes
        // should never stack or render on top of one another.
        actives.forEach((s) => game.scene.stop(s.scene.key));
        game.scene.start(key, data);
        this.transitioning = false;
      };

      this.transitioning = true;
      if (current && current.cameras && current.cameras.main) {
        current.cameras.main.fadeOut(180, 255, 255, 255);
        current.cameras.main.once("camerafadeoutcomplete", finish);
      } else {
        finish();
      }
    },
  };

  window.VA_GAME = game;
})();
