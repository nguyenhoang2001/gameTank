import { HudScene } from "../scenes/HudScene";

export class SettingPopUp extends Phaser.GameObjects.Container {
    private newGameButton:Phaser.GameObjects.Image;
    private restartButton: Phaser.GameObjects.Image;
    private soundButton:Phaser.GameObjects.Image;
    scene: HudScene;

    constructor(scene:HudScene,x:number,y:number) {
        super(scene,x,y);
    }

    public getNewGameButton():Phaser.GameObjects.Image {
        return this.newGameButton;
    }
    public getRestartButton():Phaser.GameObjects.Image {
        return this.restartButton;
    }
    public getSoundButton():Phaser.GameObjects.Image {
        return this.soundButton;
    }

    public setUpRestartButton(onCompleteFunction:Function) {
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown',() => {
            this.scene.tweens.add({
                targets:this.restartButton,
                scale: 0.5,
                ease:'Power1',
                duration: 200,
                yoyo:true,
                onComplete:this.scene.pauseGame()
            })
        });
    }

    public setUpNewGameButton(onCompleteFunction:Function) {
        this.newGameButton.setInteractive();
        this.newGameButton.on('pointerdown', () => {
            this.scene.tweens.add({
                targets:this.newGameButton,
                scale: 0.5,
                ease:'Power1',
                duration: 200,
                yoyo:true,
                onComplete:onCompleteFunction
            })
        });
    }

    public setUpSoundButton(onCompleteFunction:Function) {
        this.soundButton.setInteractive();
        this.soundButton.on('pointerdown',()=> {
            this.scene.tweens.add({
                targets:this.soundButton,
                scale: 0.5,
                ease:'Power1',
                duration: 200,
                yoyo:true,
                onComplete:onCompleteFunction
            })
        })
    }

    public start() {
        let secondZone = this.scene.add.zone(0,0,this.scene.sys.canvas.width, this.scene.sys.canvas.height);
        let containerElements = this.scene.add.image(0,0,'container');
        this.restartButton = this.scene.add.image(0,0,'containerButton');
        let restartText = this.scene.add.bitmapText(0,0,'font','Continue',40);
        this.newGameButton = this.scene.add.image(0,0,'containerButton');
        let newGameText = this.scene.add.bitmapText(0,0,'font','New Game',40);
        this.soundButton = this.scene.add.image(0,0,'containerButton');
        let soundText = this.scene.add.bitmapText(0,0,'font','Sound on/off',30);
        this.restartButton.scale = 0.6;
        restartText.scale = 0.6;
        this.newGameButton.scale = 0.6;
        newGameText.scale = 0.5;
        this.soundButton.scale = 0.6;
        soundText.scale = 0.5;
        this.add(secondZone);
        this.add(containerElements);
        this.add(this.restartButton);
        this.add(restartText);
        this.add(this.newGameButton);
        this.add(newGameText);
        this.add(this.soundButton);
        this.add(soundText);
        Phaser.Display.Align.In.TopCenter(this.restartButton,containerElements,0,0);
        Phaser.Display.Align.In.Center(restartText,this.restartButton);
        Phaser.Display.Align.To.BottomCenter(this.newGameButton,this.restartButton);
        Phaser.Display.Align.In.Center(newGameText,this.newGameButton);
        Phaser.Display.Align.To.BottomCenter(this.soundButton,this.newGameButton);
        Phaser.Display.Align.In.Center(soundText,this.soundButton);
    }

    public open() {
        this.scene.tweens.add({
            targets:this,
            scale: 2,
            duration: 800,
            ease:'bounce'
        });
    }
}