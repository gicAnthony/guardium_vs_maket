// Everything is drawn procedurally (no bitmap assets), so boot is just a
// brief, deliberate beat before handing off to Arena, the landing scene.
// Keeps the loader spinner from flashing for a single frame.
class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    document.getElementById("loader").classList.add("hidden");
    this.time.delayedCall(180, () => this.scene.start("Arena"));
  }
}
