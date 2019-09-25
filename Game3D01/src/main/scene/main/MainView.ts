import WorldView from "./world/WorldView";
import AchievementsView from "./achievements/AchievementsView";
import SettingView from "./setting/SettingView";
import TalentView from "./talent/TalentView";
import GameConfig from "../../../GameConfig";
import GameBG from "../../../game/GameBG";
import RoleView from "./role/RoleView";
export default class MainView extends Laya.Box {

    private content: Laya.Box;
    private views: Laya.View[] = [];
    private skins:string[] = [null,"juese","tianfu","chengjiu","shezhi"];
    private VIEW_CLAS = [WorldView,RoleView,TalentView,AchievementsView,SettingView];
    constructor() {
        super();
        // this.height = GameBG.height;

        this.initUI();
    }

    private initUI(): void {
        this.content = new Laya.Box();
        this.addChild(this.content);
        this.content.height = Laya.stage.height - 122;
        //这个容器在左上角00点 下面卡住底
        // this.views = [new WorldView(),new RoleView(),new TalentView(), new AchievementsView(),  new SettingView()];
    }

    private curIndex: number;
    public set selectIndex(index: number)  {
        let view: Laya.View = this.views[index];
        if(!view)
        {
            let skinName:string = this.skins[index];
            if(skinName)
            {
                Laya.loader.load("res/atlas/"+skinName+".atlas",new Laya.Handler(this,()=>{
                    let CLA = this.VIEW_CLAS[index];
                    this.views[index] = new CLA();
                    this.setView(index);
                }));
            }
            else
            {
                let CLA = this.VIEW_CLAS[index];
                this.views[index] = new CLA();
                this.setView(index);
            }
        }
        else
        {
            this.setView(index);
        }
    }

    private setView(index: number):void
    {
        let view: Laya.View = this.views[index];
        Laya.Tween.clearTween(this.content);
        if(this.curIndex == 1)
        {
            (this.views[this.curIndex] as RoleView).hideLayer(index > this.curIndex);
        }

        this.content.addChild(view);
        view.bottom = 0;
        let xx:number;
        if (this.curIndex != null)  {
            xx = index > this.curIndex ? GameConfig.width : -GameConfig.width;
            view.x = xx;
            
            Laya.Tween.to(this.content, { x: -xx }, 300 , null, new Laya.Handler(this, this.onCom, [view]));
        }
        this.curIndex = index;

        if(this.curIndex == 1)
        {
            (this.views[1] as RoleView).showLayer(xx > 0);
        }
    }

    private onCom(view: Laya.View): void {
        this.content.x = 0;
        view.x = 0;
    }
}