import { PausePopUp } from "../ui/PausePopUp";
import { PopUPEnding } from "../ui/PopUPEnding";
import { SettingPopUp } from "../ui/SettingPopUp";

export class HudScene extends Phaser.Scene {
    private soundState:boolean;
    private checkGameScene: boolean;
    private highScore:number;
    private currentScore:number;
    private popUpEnding:PopUPEnding;
    private pausePopUp:PausePopUp;
    private settingPopUp:SettingPopUp;
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
        this.pausePopUp.setUpButton(() => {
            this.scene.pause('GameScene');
            this.createSecondContainer();
        },() => {
            this.pausePopUp.alpha = 0.8;
            this.pausePopUp.getButton().removeInteractive();
        })
    }

    createEndingContainer() {
        this.popUpEnding = new PopUPEnding(this,this.sys.canvas.width/2,this.sys.canvas.height/2,this.highScore,this.currentScore);
        this.add.existing(this.popUpEnding);
        this.popUpEnding.start();
        this.popUpEnding.setUpButton(() => {
            this.scene.launch('GameScene');
            this.tweens.add({
                targets:this.popUpEnding,
                scale: 0,
                duration: 300,
                ease:'Power1',
                onComplete: () => {
                    this.pausePopUp.alpha = 1;
                    this.pausePopUp.getButton().setInteractive();
                    this.checkGameScene = true;
                    this.popUpEnding.destroy();
                }
            });
        });
        this.pausePopUp.alpha = 0.8;
        this.pausePopUp.getButton().removeInteractive();
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

    createSecondContainer() {
        if(this.settingPopUp!=undefined) {
            this.settingPopUp.visible = true;
            this.settingPopUp.open();
            this.pausePopUp.alpha = 1;
            this.pausePopUp.getButton().setInteractive();
            return;
        }
        this.settingPopUp = new SettingPopUp(this,this.sys.canvas.width/2,this.sys.canvas.height/2);
        this.add.existing(this.settingPopUp);
        this.settingPopUp.start();
        this.settingPopUp.open();
        this.settingPopUp.setUpRestartButton(() => {
            this.scene.resume('GameScene');
            this.tweens.add({
                targets:this.settingPopUp,
                scale: 0,
                duration: 300,
                ease:'Power1',
                onComplete: () => {
                    this.pausePopUp.alpha = 1;
                    this.pausePopUp.getButton().setInteractive();
                    this.settingPopUp.visible = false;
                    // this.settingPopUp.destroy();
                }
            });
        })
        this.settingPopUp.setUpNewGameButton(() => {
            this.scene.launch('GameScene');
            this.tweens.add({
                targets:this.settingPopUp,
                scale: 0,
                duration: 300,
                ease:'Power1',
                onComplete: () => {
                    this.pausePopUp.alpha = 1;
                    this.pausePopUp.getButton().setInteractive();
                    this.settingPopUp.destroy();
                }
            });
        });
        this.settingPopUp.setUpSoundButton(() => {
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
            this.scene.resume('GameScene');
            this.tweens.add({
                targets:this.settingPopUp,
                scale: 0,
                duration: 300,
                ease:'Power1',
                onComplete: () => {
                    this.pausePopUp.alpha = 1;
                    this.pausePopUp.getButton().setInteractive();
                    this.settingPopUp.destroy();
                }
            });
        });
    }
    pauseGame() {
        
    }
}