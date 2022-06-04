import { Bullet } from './bullet';
import { IImageConstructor } from '../interfaces/image.interface';

export class Player extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private health: number;
  private lastShoot: number;
  private speed: number;

  // children
  private barrel: Phaser.GameObjects.Image;
  private lifeBar: Phaser.GameObjects.Graphics;

  // game objects
  private bullets: Phaser.GameObjects.Group;

  // input
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private rotateKeyLeft: Phaser.Input.Keyboard.Key;
  private rotateKeyRight: Phaser.Input.Keyboard.Key;
  private shootingKey: Phaser.Input.Keyboard.Key;
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private goUpEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private goBackEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private offSetRotate:number;


  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.initImage();
    this.scene.add.existing(this);
    this.particles = this.scene.add.particles('sparkle');
    this.offSetRotate = 0;
    this.scene.tweens.add({
      targets:this,
      scale: 1.2,
      ease:'Power1',
      duration:1500,
      yoyo:true,
      repeat:-1
    })
  }

  private initImage() {
    // variables
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 100;

    // image
    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.angle = 180;
    this.depth += 1;

    this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);
    this.barrel.angle = 180;
    this.barrel.depth += 1;
    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    });

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.rotateKeyLeft = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.rotateKeyRight = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this.shootingKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // physics
    this.scene.physics.world.enable(this);
  }

  update(): void {
    if (this.active) {
      this.barrel.x = this.x;
      this.barrel.y = this.y;
      this.lifeBar.x = this.x;
      this.lifeBar.y = this.y;
      this.handleInput();
      this.handleShooting();
    } else {
      this.scene.tweens.add({
        targets:this,
        alpha: 0,
        ease:'Power1',
        duration: 1000
      })
      this.destroy();
      this.barrel.destroy();
      this.lifeBar.destroy();
    }
  }

  private handleInput() {
    // move tank forward
    // small corrections with (- MATH.PI / 2) to align tank correctly
    if (this.cursors.up.isDown) {
      this.scene.physics.velocityFromRotation(
        this.rotation - Math.PI / 2,
        this.speed,
        this.body.velocity
      );
      this.goUpEmitter = this.particles.createEmitter({
        x:this.x,
        y:this.y ,
        lifespan: { min: 800, max: 1000 },
        maxParticles: 2,
        quantity:2,
        angle: { min: 260 + this.offSetRotate, max: 300 +this.offSetRotate},
        frequency: 100,
        alpha: {start: 0.5, end: 0},
        scale: { start: 0.1, end: 1 },
        blendMode:'ADD',
        speed:-200,
        follow:this
      })
    } else if (this.cursors.down.isDown) {

      this.scene.physics.velocityFromRotation(
        this.rotation - Math.PI / 2,
        -this.speed,
        this.body.velocity
      );
    } else {
      this.body.setVelocity(0, 0);
    }

    // rotate tank
    if (this.cursors.left.isDown) {
      this.rotation -= 0.02;
      this.offSetRotate -= 1;
    } else if (this.cursors.right.isDown) {
      this.rotation += 0.02;
      this.offSetRotate += 1;
    }

    // rotate barrel
    if (this.rotateKeyLeft.isDown) {
      this.barrel.rotation -= 0.05;
    } else if (this.rotateKeyRight.isDown) {
      this.barrel.rotation += 0.05;
    }
  }

  private handleShooting(): void {
    if (this.shootingKey.isDown && this.scene.time.now > this.lastShoot) {
      let shootSound = this.scene.sound.get('shootSound');
      if(shootSound != undefined) {
        shootSound.resume();
        shootSound.play();
      }
      this.scene.cameras.main.shake(20, 0.005);
      this.scene.tweens.add({
        targets: this,
        props: { alpha: 0.8 },
        delay: 0,
        duration: 5,
        ease: 'Power1',
        easeParams: null,
        hold: 0,
        repeat: 0,
        repeatDelay: 0,
        yoyo: true,
        paused: false
      });

      if (this.bullets.getLength() < 10) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletBlue'
          })
        );

        this.lastShoot = this.scene.time.now + 80;
      }
    }
  }

  private redrawLifebar(): void {
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      -this.width / 2,
      this.height / 2,
      this.width * this.health,
      15
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15);
    this.lifeBar.setDepth(1);
  }

  public updateHealth(): void {
    // this.animatedHit();
    if (this.health > 0) {
      this.health -= 0.05;
      this.redrawLifebar();
    } else {
      this.health = 0;
      this.active = false;

    }
  }

  public animatedHit() {
    this.scene.tweens.add({
      targets:this,
      // angle: 180,
      angle:30,
      ease:'Power1',
      duration: 500,
    });
  }
}
