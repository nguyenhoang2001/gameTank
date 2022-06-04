export class PopUPEnding extends Phaser.GameObjects.Container{
    private highScore:number;
    private score:number;
    private newGameButton:Phaser.GameObjects.Image;

    constructor(scene:Phaser.Scene,x:number,y:number, highScore:number,score:number) {
        super(scene,x,y);
        this.highScore = highScore;
        this.score = score;
    }

    public getButton(): Phaser.GameObjects.Image {
        return this.newGameButton;
    }

    public setUpButton(onCompleteFunction:Function) {
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

    public start() {
        let zone = this.scene.add.zone(0,0,this.scene.sys.canvas.width, this.scene.sys.canvas.height);
        let containerElements = this.scene.add.image(0,0,'container');
        this.newGameButton = this.scene.add.image(0,0,'containerButton');
        let newGameText = this.scene.add.bitmapText(0,0,'font','New Game',40);
        let highScoreText = this.scene.add.text(0,0,'High Score: '+ this.highScore.toString());
        let scoreText = this.scene.add.text(0,0,'Score: '+ this.score.toString());
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
        this.scene.tweens.add({
            targets:this,
            scale: 2,
            duration: 800,
            ease:'bounce'
        });
    }
}