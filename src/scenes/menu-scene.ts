export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
  }

  create(): void {
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 120,
        this.sys.canvas.height / 2,
        'font',
        'PRESS S TO PLAY',
        30
      )
    );

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 120,
        this.sys.canvas.height / 2 - 100,
        'font',
        'TANK',
        100
      )
    );
    this.registry.set('score', 0);
    this.registry.set('gameEnd', false);
  }

  update(): void {
    if (this.startKey.isDown) {
      this.sound.add('backgroundMusic',{volume:0.3,loop:true}).play();

      this.scene.start('HudScene');
      this.scene.start('GameScene');
      this.scene.bringToTop('HudScene');
    }
  }
}
