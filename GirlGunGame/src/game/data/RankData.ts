import IData from "./IData";
import App from "../../core/App";
import Session from "../../main/Session";
import SysMap from "../../main/sys/SysMap";
export default class RankData implements IData{
    constructor(){
        
    }

    public setData(data:any):void{
        
    }

    public saveData(data:any):void{
        
    }
    
    public initData(data:any):void{
        
    }

    /**
     * 存储世界排行榜
     */
    public saveWorldRank():void
    {
        let obj:any = {};
        obj.skey = Session.SKEY;
        obj.name = "荒野女枪";
        obj.scorestr = this.getStageNum();
        obj.url = "main/suo.png";
        obj.item = 0;
        if( Laya.Browser.onMiniGame == false ){
            App.http( App.serverIP + "gamex3/saveRank" , obj , "post" );
            return;
        }
        if( App.sdkManager.haveRight == false ){
            return;
        }
        obj.name = App.sdkManager.wxName;
        obj.url = App.sdkManager.wxHead;
        App.http( App.serverIP + "gamex3/saveRank" , obj , "post" );
    }

    public getStageNum():number{
        let t = 0;
        for( let i :number = 1; i < Session.homeData.chapterId; i++  ){
            t += SysMap.getTotal( i );    
        }
        t += Session.homeData.mapIndex;
        return t;
    }

    public getRank( caller:any  , listener:Function  ):void {
        let obj:any = {};
        obj.skey = Session.SKEY;
        obj.st = 0;
        obj.et = 50;
        App.http( App.serverIP + "gamex3/getRank" ,  obj , "GET", caller , listener );
    }

    /**
     * 存储好友排行榜
     */
    public saveFriendRank():void{
        if( Laya.Browser.onMiniGame == false ){
            return;
        }
        var obj:any = {};
        var o1:any = {};
        o1.key = "stageNum";
        o1.value = Session.homeData.chapterId + "";
        obj["KVDataList"] = [o1];
        obj.success = (res)=>{
            console.log("存储好友排行榜成功" , res );
        }
        obj.fail = (res)=>{
            console.log("存储好友排行榜失败", res );
        }
        Laya.Browser.window.wx.setUserCloudStorage(obj);
    }
}