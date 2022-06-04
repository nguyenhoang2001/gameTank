import { HudScene } from "../scenes/HudScene";

export class PopUPEnding extends Phaser.GameObjects.Container{
    private newGameButton:Phaser.GameObjects.Image;
    public scene:HudScene;

    constructor(scene:Phaser.Scene,x:number,y:number, highScore:number,score:number) {
        super(scene,x,y);
    }

    public getButton(): Phaser.GameObjects.Image {
        return this.newGameButton;
    }

    public setUpButton() {
        this.newGameButton.setInteractive();
        this.newGameButton.on('pointerdown', () => {
            this.scene.tweens.add({
                targets:this.newGameButton,
                scale: 0.5,
                ease:'Power1',
                duration: 200,
                yoyo:true,
                onComplete:() => {
                    this.scene.newGame();
                    this.scene.tweens.add({
                        targets:this,
                        scale: 0,
                        duration: 300,
                        ease:'Power1',
                        onComplete: () => {
                            this.scene.pausePopUp.alpha = 1;
                            this.scene.pausePopUp.getButton().setInteractive();
                            this.scene.checkGameScene = true;
                            this.close();
                        }
                    });
                }
            })
        });
    }

    public start() {
        let zone = this.scene.add.zone(0,0,this.scene.sys.canvas.width, this.scene.sys.canvas.height);
        let containerElements = this.scene.add.image(0,0,'container');
        this.newGameButton = this.scene.add.image(0,0,'containerButton');
        let newGameText = this.scene.add.bitmapText(0,0,'font','New Game',40);
        let highScoreText = this.scene.add.text(0,0,'High Score: '+ this.scene.highScore.toString());
        let scoreText = this.scene.add.text(0,0,'Score: '+ this.scene.currentScore.toString());
        this.newGameButton.scale = 0.6;
        newGameText.scale = 0.5;
        this.add(zone);
        this.add(containerElements);
        this.add(this.newGameButton);
        this.add(newGameText);
        this.add(highScoreText);
        this.add(scoreText);
        Phaser.Display.Align.In.TopCenter(highScoreText,containerElements,0,-50);
        Phaser.Display.Align.To.BottomCenter(scoreText,highScoreText,0,10);
        Phaser.Display.Align.To.BottomCenter(this.newGameButton,scoreText);
        Phaser.Display.Align.In.Center(newGameText,this.newGameButton);
        this.setUpButton();
        this.close();
    }

    public close() {
        this.setVisible(false);
    }

    public open() {
        this.setVisible(true);
        this.scene.tweens.add({
            targets:this,
            scale: 2,
            duration: 800,
            ease:'bounce'
        });
        this.scene.pausePopUp.alpha = 0.8;
        this.scene.pausePopUp.getButton().removeInteractive();
    }
}