import { PausePopUp } from "../ui/PausePopUp";
import { PopUPEnding } from "../ui/PopUPEnding";
import { SettingPopUp } from "../ui/SettingPopUp";

export class HudScene extends Phaser.Scene {
    private soundState:boolean;
    public checkGameScene: boolean;
    public highScore:number;
    public currentScore:number;
    private popUpEnding:PopUPEnding;
    public pausePopUp:PausePopUp;
    public settingPopUp:SettingPopUp;
    constructor() {
        super('HudScene');
        this.highScore = 0;
    }

    create() {
        this.soundState = false;
        this.currentScore = 0;
        this.checkGameScene = true;
        this.pausePopUp = new PausePopUp(this,this.sys.canvas.width/2,this.sys.canvas.height/2);
        this.add.existing(this.pausePopUp);
        this.pausePopUp.start();
        this.pausePopUp.open();
    }

    createEndingContainer() {
        if(this.popUpEnding != undefined) {
            this.popUpEnding.open();
            return;
        }
        this.popUpEnding = new PopUPEnding(this,this.sys.canvas.width/2,this.sys.canvas.height/2,this.highScore,this.currentScore);
        this.add.existing(this.popUpEnding);
        this.popUpEnding.start();
        this.popUpEnding.open();
    }

    update(): void {
        let gameEnd = this.registry.get('gameEnd');
        if(gameEnd && this.checkGameScene) {
            this.checkGameScene = false;
            let score = this.registry.get('score');
            this.currentScore = score;
            if(this.highScore < this.currentScore)
                this.highScore = this.currentScore;
            this.createEndingContainer();
        }
    }

    public pauseGame() {
        this.scene.pause('GameScene');
    }

    public resumeGame() {
        this.scene.resume('GameScene');
    }

    public newGame() {
        this.scene.launch('GameScene');
    }

    public turnOnOffSound() {
        if(this.soundState) {
            this.soundState = false;
            this.sound.add('shootSound');
            this.sound.add('backgroundMusic',{volume:0.3,loop:true}).play();
        }else {
            this.soundState = true;
            let shootSound = this.sound.get('shootSound');
            shootSound.destroy();
            let backgroundSound = this.sound.get('backgroundMusic');
            backgroundSound.destroy();
        }
    }

    createSettingContainer() {
        if(this.settingPopUp!=undefined) {
            this.settingPopUp.open();
            return;
        }
        this.settingPopUp = new SettingPopUp(this,this.sys.canvas.width/2,this.sys.canvas.height/2);
        this.add.existing(this.settingPopUp);
        this.settingPopUp.start();
        this.settingPopUp.open();
    }
}