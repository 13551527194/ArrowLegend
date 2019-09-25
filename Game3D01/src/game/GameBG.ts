import Image = Laya.Image;
import GameConfig from "../GameConfig";
import Sprite = Laya.Sprite;
import Game from "./Game";
import GridType from "./bg/GridType";
import BitmapNumber from "../core/display/BitmapNumber";
import App from "../core/App";
import Saw from "../main/scene/battle/saw/Saw";
import NPC_1001 from "../main/scene/battle/npc/NPC_1001";
import NPC_1002 from "../main/scene/battle/npc/NPC_1002";
import NPC_1003 from "../main/scene/battle/npc/NPC_1003";
import GameHitBox from "./GameHitBox";
import Hero from "./player/Hero";
import GameThorn from "./GameThorn";
import GameCube from "../main/scene/battle/GameCube";
import BattleFlagID from "../main/scene/BattleFlagID";
import CoinEffect from "./effect/CoinEffect";
// import GuidePointer from "../main/guide/GuidePointer";
//2d地图板块    
export default class GameBG extends Laya.Sprite {
    /**地图颜色 绿色1 蓝色2 黄色3 */
    static BG_TYPE: string;
    static BG_TYPE_NUM: number;

    static MAP_ROW: number;
    static MAP_COL: number;


    static MAP_ROW2: number;
    static MAP_COL2: number;

    static bgId: number;
    static bgWW: number;
    static bgHH: number;
    static bgHHReal: number;
    static bgCellWidth: number;


    /**地图恒星格子数*/
    static wnum: number = 12;
    /**地图纵向格子数*/
    static hnum: number = 49;
    /**舞台宽度*/
    static width: number = 750;
    //static width:number = 768;
    /**舞台高度*/
    static height: number = 1334;
    //static height:number = 1024;
    /**地形的碰撞方块尺寸*/
    static ww: number = GameBG.width / GameBG.wnum;
    /**1/2 地形的碰撞方块尺寸*/
    static ww2: number = GameBG.ww / 2;
    //主角的碰撞方块尺寸比例
    static fw: number = GameBG.ww * 0.4;
    //主角的碰撞方块尺寸
    static mw: number = GameBG.ww - GameBG.fw;
    //1/2 主角的碰撞方块尺寸
    static mw2: number = GameBG.mw / 2;
    //1/4 主角的碰撞方块尺寸
    static mw4: number = GameBG.mw / 4;
    //正交相机纵向尺寸
    static orthographicVerticalSize: number = GameBG.wnum * GameBG.height / GameBG.width;
    //2D地图
    static gameBG: GameBG;
    //地图居中坐标x
    static cx: number;
    //地图居中坐标y
    static cy: number;
    //主角中心坐标
    static mcx: number;
    //主角中心坐标
    static mcy: number;

    private maskImg: Laya.Image = new Laya.Image();
    private bottomImg: Laya.Image = new Laya.Image();

    private static v3d: Laya.Vector3;

    private doorNumber: BitmapNumber;

    static get3D(xx: number, yy: number): Laya.Vector3 {
        if (!GameBG.v3d) {
            GameBG.v3d = new Laya.Vector3(0, 0, 0);
        }
        GameBG.v3d.x = (xx - 6);
        let rowNum: number = GameBG.bgHH / GameBG.ww / 2;
        let delta: number = GameBG.bgHH % GameBG.ww;
        delta = delta / GameBG.ww;
        GameBG.v3d.z = (yy - rowNum + 0.5) / Game.cameraCN.cos0;
        return GameBG.v3d;
    }

    static arrsp: Sprite[] = [];

    static arr0: number[] = [];

    private bgh: number = 0;

    private mySp: Sprite;
    private sp: Sprite;

    public getBgh(): number {
        return this.bgh;
    }

    public isHit(dx: number, dy: number): boolean {//,xx:number,yy:number
        var dx0 = dx - GameBG.mw2;
        var dy0 = dy - GameBG.mw2;
        var b: boolean = false;
        for (let i = 0; i < GameBG.arrsp.length; i++) {
            var element = GameBG.arrsp[i];
            if (this.isHit_(dx0, dy0, element)) {
                b = true;
            }
        }
        return b;
    }

    private isHit_(dx: number, dy: number, d2: Sprite): boolean {
        return dx < d2.x + GameBG.ww &&
            dx + GameBG.mw > d2.x &&
            dy < d2.y + GameBG.ww &&
            GameBG.mw + dy > d2.y
    }

    private _box: Sprite = new Sprite();
    private _top: Image = new Image();
    private _bossImg: Image = new Image();
    private _bottom: Image = new Image();
    private _topShadow: Image = new Image();
    private _leftShadow: Image = new Image();
    private _door: Image = new Image();
    // private _guidePointer:GuidePointer;

    /**电锯 */
    public saw: Saw = new Saw();

    /**电锯信息 */
    private _sawInfo: any = {};
    private _sawInfoZong: any = {};
    public _npcAni: Laya.View;

    public npcId: number = 0;

    constructor() {
        super();
        GameBG.gameBG = this;
        this.mySp = new Sprite();
        this.mySp.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, 0x00ff00);
        this.doorNumber = BitmapNumber.getFontClip(0.3);
    }

    public setZhuan(box: Laya.MeshSprite3D): any {
        //throw new Error("Method not implemented.");
    }

    public updata(x: number, y: number): void {
        this.mySp.x = x - GameBG.mw2;
        this.mySp.y = y - GameBG.mw2;
    }

    public clear(): void  {
        this._box.removeChildren();
        this.saw.clear();

        this._sawInfo = {};
        this._sawInfoZong = {};

        this.npcId = 0;
        this._npcAni && this._npcAni.removeSelf();
        this._npcAni = null;
    }

    private npcP: Laya.Point = new Laya.Point();

    private startX: number;
    public drawR(hasBoss: boolean = false): void {
        this.npcId = 0;
        var img: Image;
        var ww: number = GameBG.ww;
        var k: number = 0;
        let sp: Sprite;
        let gType: number = 0;
        this.addChild(this._box);
        this.addChild(this.saw);

        let index3: number = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            if (GameBG.MAP_COL % 2 == 0)  {
                index3++;
            }
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                img = new Image();
                img.skin = (index3 % 2 == 0) ? GameBG.BG_TYPE + "/10.png" : GameBG.BG_TYPE + "/11.png";
                this._box.addChild(img);
                img.size(64, 64);
                img.x = i * ww;//- (ww/2);
                img.y = j * ww;
                index3++;
            }
        }

        var k = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                gType = GameBG.arr0[k];
                var shadow: Laya.Image = new Laya.Image();
                if ((GridType.isWall(gType) || (gType >= 1 && gType <= 10)))  {
                    shadow.skin = GameBG.BG_TYPE + '/y' + GameCube.getType(gType) + '.png';
                    shadow.x = i * ww;
                    shadow.y = j * ww;
                    this._box.addChild(shadow);
                }
                else if (GridType.isFence(gType))  {
                    shadow.skin = 'bg/lanying.png';
                    shadow.width = 200;
                    shadow.x = i * ww - 64;
                    shadow.y = j * ww + 50;
                    this._box.addChild(shadow);
                }
                k++;
            }
        }

        k = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            this.bgh += GameBG.ww;
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                gType = GameBG.arr0[k];
                let xx = i * GameBG.ww;//- (ww/2);
                let yy = j * GameBG.ww;
                var thorn: GameThorn;
                var grid: Image = new Image();
                if (GridType.isRiverPoint(gType)) {
                    grid.skin = GameBG.BG_TYPE + '/100.png';
                }
                else if (GridType.isThorn(gType)) {
                    thorn = GameThorn.getOne();
                    thorn.hbox.setXY(xx, yy);
                    thorn.pos(xx,yy);
                    this._box.addChild(thorn);
                }
                else if (GridType.isRiverScale9Grid(gType) || GridType.isRiverScale9Grid2(gType) || GridType.isRiverRow(gType) || GridType.isRiverCol(gType)) {
                    gType = Math.floor(gType / 100) * 100 + gType % 10;
                    grid.skin = GameBG.BG_TYPE + '/' + gType + '.png';
                }
                else if (GridType.isFlower(gType))  {
                    grid.skin = GameBG.BG_TYPE + '/' + gType + '.png';
                }
                else if (GridType.isSawHeng(gType))//横锯子
                {
                    if (this._sawInfo[gType] == null)  {
                        let hengAry: Laya.Point[] = [];
                        this._sawInfo[gType] = hengAry;
                    }
                    let p: Laya.Point = new Laya.Point(xx, yy);
                    this._sawInfo[gType].push(p);
                }
                else if (GridType.isSawZong(gType))//纵锯子
                {
                    if (this._sawInfoZong[gType] == null)  {
                        let hengAry: Laya.Point[] = [];
                        this._sawInfoZong[gType] = hengAry;
                    }
                    let p: Laya.Point = new Laya.Point(xx, yy);
                    this._sawInfoZong[gType].push(p);
                }
                else if (GridType.isNpc(gType))  {
                    this.npcId = gType;
                    // if(this.npcId == 1001)
                    // {
                    //     let NPC = Laya.ClassUtils.getClass("NPC" + this.npcId);
                    //     this._npcAni = new NPC();
                    // }
                    this.npcP.x = xx + GameBG.ww2;
                    this.npcP.y = yy;

                    if (this.npcId == BattleFlagID.ANGLE)  {
                        this.npcId = 1001;
                        if (this.npcDic[this.npcId] == null)  {
                            let NPC = Laya.ClassUtils.getClass("NPC" + this.npcId);
                            this._npcAni = new NPC();
                            this.npcDic[this.npcId] = this._npcAni;
                        }
                        else  {
                            this.npcDic[this.npcId] = this._npcAni;
                        }
                        this.showNpc();
                        console.log("显示npc", this.npcId);
                    }
                }


                if (gType == BattleFlagID.DOOR)  {
                    this._door.pos(xx - GameBG.ww2, yy - GameBG.ww2);
                    this._door.skin = 'bg/door.png';
                }
                else if (gType == BattleFlagID.HERO)  {
                    Hero.bornX = xx;
                    Hero.bornY = yy;
                    console.log("主角出生位置",xx,yy);
                }
                grid.pos(xx,yy);
                this._box.addChild(grid);
                k++;
            }
        }

        this.saw.clear();

        //横
        for (let key in this._sawInfo)  {
            let hengAry: Laya.Point[] = this._sawInfo[key];
            let pos: Laya.Point = hengAry[0];
            let ww: number = hengAry[1].x - hengAry[0].x + GameBG.ww;
            this.saw.addBg(pos.x, pos.y, ww, 1);
        }
        //纵
        for (let key in this._sawInfoZong)  {
            let zongAry: Laya.Point[] = this._sawInfoZong[key];
            let pos: Laya.Point = zongAry[0];
            let hh: number = zongAry[1].y - zongAry[0].y + GameBG.ww;
            this.saw.addBg(pos.x, pos.y, hh, 2);
        }

        this._box.addChild(this._door);

        this.saw.updateSaw();
        this.startX = GameBG.ww2;
        this.x = -this.startX;
        this.y = (Laya.stage.height - GameBG.bgHH) * 0.5;
        GameBG.cx = this.x;
        GameBG.cy = this.y;


        this.addChild(this.maskImg);
        this.addChild(this.bottomImg);
        // sprite.alpha = 0.4;s
        // sprite.x = GameBG.ww;
        // sprite.texture = Laya.loader.getRes("h5/mapbg/topbg.png");
        this.maskImg.skin = "battleBg/" + GameBG.BG_TYPE_NUM + ".png";
        this.maskImg.sizeGrid = "506,421,801,321";
        this.maskImg.width = GameBG.bgWW;
        this.maskImg.height = GameBG.bgHHReal;

        this.bottomImg.width = GameBG.bgWW;
        this.bottomImg.height = 500;
        this.bottomImg.y = this.maskImg.y + this.maskImg.height;
        this.bottomImg.skin = "battleBg/bottom_" + GameBG.BG_TYPE_NUM + ".jpg";

        // sprite.size(GameBG.bgWW - GameBG.ww,GameBG.ww * 10);
    }

    public showGuidePointer(): void {
        // this._box.addChild(this._guidePointer);
    }

    public hideGuidePointer(): void {
        // this._guidePointer && this._guidePointer.removeSelf();
    }

    private showNpc(): void  {
        if (this._npcAni)  {
            Game.topLayer.addChild(this._npcAni);
            this._npcAni.pos(this.npcP.x, this.npcP.y - 800);

            Laya.Tween.to(this._npcAni, { y: this.npcP.y }, 300, Laya.Ease.circIn);
        }
    }

    /**检测出现哪个npc  恶魔和胡子 */
    checkNpc(): void  {
        if (this.npcId <= 0)  {
            return;
        }
        if (!Game.map0.checkNpc())  {
            return;
        }
        Game.scenneM.battle.up(null);
        if (this.npcId == BattleFlagID.OTHER_NPC)  {
            this.npcId = 0;
            let lossRate: number = Game.hero.lossBlood();
            if (lossRate <= 0)  {
                this.npcId = 1002;//恶魔
            }
            else if (lossRate <= 0.1)  {
                this.npcId = 1002;//恶魔
            }
            else  {
                // this.npcId = 1003;//胡子
                this.npcId = 1001;//胡子没做，先用天使
            }
        }
        else if (this.npcId == BattleFlagID.ANGLE)  {
            this.npcId = 1001;//天使
        }

        if (this.npcId > 0)  {
           
        }
    }

    private npcDic: any = {};

    public clearNpc(): void  {
        if (this._npcAni)  {
            Laya.Tween.to(this._npcAni, { scaleX: 0.3 }, 200, null, null, 100);
            Laya.Tween.to(this._npcAni, { y: -300 }, 300, Laya.Ease.circIn, new Laya.Handler(this, this.clearNpcCom), 300);
        }
    }

    private clearNpcCom(): void  {
        this._npcAni && this._npcAni.removeSelf();
        Game.map0.clearNpc();
        this.npcId = 0;
        this._npcAni = null;
        // Game.openDoor();
        if (Game.map0.Eharr.length == 0) {
            CoinEffect.fly();
        }
    }

    public setDoor(state: number): void {
        this._door.visible = state == 1;
        console.log("门是否显示", this._door.visible);
    }

    public updateY(): void {
        var bgy: number = GameBG.cy - Game.hero.pos2.z;
        var u: boolean = false;
        if (bgy <= 0 && bgy >= Laya.stage.height - GameBG.bgHH) {
            //移动2D背景板
            Game.bg.y = bgy;
            //摄像机跟随主角
            Game.camera.transform.localPositionZ = Game.cameraCN.z + Game.hero.z;
            u = true;
        }
        else if (bgy < Laya.stage.height - GameBG.bgHH) {
            //Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Laya.stage.height +  GameBG.bgHH);
            Game.bg.y = Laya.stage.height - GameBG.bgHH;
            Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y) / GameBG.ww / Game.cameraCN.cos0;
        }
        else  {
            //Game.camera.transform.localPositionZ = Game.cameraCN.z +  GameBG.cy;
            Game.bg.y = 0;
            Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y) / GameBG.ww / Game.cameraCN.cos0;
        }

        let ww2 = this.startX;
        var bgx: number = GameBG.cx - Game.hero.pos2.x;
        if (bgx <= -ww2 && bgx >= (Laya.stage.width - GameBG.bgWW) + ww2) {
            Game.camera.transform.localPositionX = Game.hero.x;
            Game.bg.x = bgx;
            u = true;
        }
        else if (bgx > -ww2) {
            Game.bg.x = -ww2;
            Game.camera.transform.localPositionX = (GameBG.cx - Game.bg.x) / GameBG.ww;
        }
        else {
            Game.bg.x = (Laya.stage.width - GameBG.bgWW) + ww2;
            Game.camera.transform.localPositionX = (GameBG.cx - Game.bg.x) / GameBG.ww;
        }

        if (u) {

        }
        Game.updateMap();

    }
}

