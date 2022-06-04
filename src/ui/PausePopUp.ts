import { HudScene } from "../scenes/HudScene";

export class PausePopUp extends Phaser.GameObjects.Container {
    scene: HudScene
    private containerButton: Phaser.GameObjects.Image;
    constructor(scene:HudScene,x:number,y:number) {
        super(scene,x,y);
    }

    public getButton():Phaser.GameObjects.Image {
        return this.containerButton;
    }

    public setUpButton() {
        this.containerButton.setInteractive();
        this.containerButton.on('pointerdown',() => {
            this.scene.tweens.add({
                targets:this.containerButton,
                scale: 0.8,
                ease:'Power1',
                duration: 200,
                yoyo:true,
                onComplete:()=>{
                    this.scene.pauseGame();
                    this.scene.createSettingContainer();
                }
            })
        });
        this.containerButton.on('pointerup',()=>{            
            this.scene.pausePopUp.alpha = 0.8;
            this.scene.pausePopUp.getButton().removeInteractive();
        });
    }
    
    public start() {
        let mainZone = this.scene.add.zone(0,0,this.scene.sys.canvas.width, this.scene.sys.canvas.height);
        let text = this.scene.add.bitmapText(0,0,'font','Pause',50);
        this.containerButton = this.scene.add.image(0,0,'containerButton');
        this.containerButton.setOrigin(0.5);
        this.add(mainZone);
        this.add(this.containerButton);
        this.add(text);
        Phaser.Display.Align.In.TopRight(this.containerButton,mainZone, -10, -20);
        Phaser.Display.Align.In.Center(text,this.containerButton);
        this.scale = 0.4;
        this.close();
        this.setUpButton();
    }

    public close() {
        this.setVisible(false);
    }

    public open() {
        this.setVisible(true);
        this.scene.tweens.add({
            targets:this,
            scale: 1,
            duration: 500,
            ease:'bounce'
        });
    }
}