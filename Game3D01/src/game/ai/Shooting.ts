import Game from "../Game";
import GameHitBox from "../GameHitBox";
import GamePro from "../GamePro";
import GameBG from "../GameBG";
import { GameAI } from "./GameAI";
import HeroBullet from "../player/HeroBullet";
import HeroArrowAI from "./HeroArrowAI";
import SysSkill from "../../main/sys/SysSkill";
import App from "../../core/App";

/**射击器*/
export default class Shooting {
    /**单次出手次数*/
    public scd: number = 0;
    /**下次攻击时间*/
    public st: number = 0;
    /**上次攻击时间*/
    public et: number = 0;
    /**当前时间*/
    public now: number = 0;
    /**攻击前摇时间*/
    public at: number = 0;
    //private static bulletCount:number = 0;

    private pro: GamePro;
    public short_arrow(speed_: number, r_: number, pro: GamePro,attackPower:number,bulletId:number = 20000):HeroBullet {
        let bo:HeroBullet = HeroBullet.getBullet(bulletId);

        for(let i = 0; i < bo.buffAry.length; i++)
        {
            let sys:SysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME,bo.buffAry[i]);
            attackPower = attackPower * sys.damagePercent / 100;
        }

        bo.hurtValue = Math.floor(attackPower);
        // var bo = new HeroBullet();
        bo.sp3d.transform.localPositionY = 0.8;
        bo.setXY2D(pro.pos2.x, pro.pos2.z);
        bo.setSpeed(speed_);
        bo.rotation(r_);
        bo.gamedata.bounce = pro.gamedata.bounce;
        bo.startAi();
        Game.layer3d.addChild(bo.sp3d);
        return bo;
    }

    public attackOk(): boolean {
        this.now = Game.executor.getWorldNow();
        return this.now >= this.st;
    }

    private curAttack:string;
    public starAttack(pro: GamePro, acstr: string): boolean {
        this.pro = pro;
        this.curAttack = acstr
        if (this.attackOk()) {            
            this.st = this.now + Game.hero.playerData.attackSpeed;
            this.scd = 0;
            this.pro.play(acstr);
            if (this.at > 0) {
                Laya.stage.timer.frameLoop(this.at, this, this.ac0);
            } else {
                this.ac0();
            }
            return true;
        }
        return false;
    }

    public cancelAttack(): void {       
        this.st = this.et;
        this.scd = 0;
        Laya.stage.timer.clear(this, this.ac0);
    }

    private ac0(): void {
        //this.pro;
        if (this.pro.normalizedTime >= this.at) {
            if (this.pro.normalizedTime >= 1) {
                Laya.stage.timer.clear(this, this.ac0);
                this.pro.play(GameAI.Idle);
            }
            if (this.scd == 0) {
                this.scd = 1;
                this.pro.event(Game.Event_Short, this.curAttack);
                this.et = this.st;
            }
        }
    }

    private future: GameHitBox = new GameHitBox(2, 2);

    public checkBallistic(n: number, pro: GamePro, ero: GamePro): GamePro {
        var vx: number = GameBG.mw2 * Math.cos(n);
        var vz: number = GameBG.mw2 * Math.sin(n);
        var x0: number = pro.hbox.cx;
        var y0: number = pro.hbox.cy;
        var ebh: GameHitBox;
        for (let i = 0; i < 6000; i++) {
            ebh = null;
            this.future.setVV(x0, y0, vx, vz);

            if (ero.hbox.hit(ero.hbox, this.future)) {
                return ero;
            }

            var hits = Game.map0.Aharr;
            ebh = Game.map0.chechHit_arr(this.future, hits);
            if (ebh) {
                return null;
            }
            x0 += vx;
            y0 += vz;
        }
        return null;
    }
}
